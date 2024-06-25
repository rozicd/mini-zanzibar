import logging
import json
import os
from flask import Flask, request, jsonify
import consul
import plyvel

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

db = plyvel.DB('127.0.0.1:2012', create_if_missing=True)
app = Flask(__name__)

consul_host = os.environ.get('CONSUL_HOST', 'localhost')
consul_port = int(os.environ.get('CONSUL_PORT', 8500))
consul_client = consul.Consul(host=consul_host, port=consul_port)

def get_active_namespace():
    index, data = consul_client.kv.get('active_namespace')
    if data:
        return data['Value'].decode('utf-8')
    return None

def get_namespace_config(version):
    index, data = consul_client.kv.get(f'namespace/{version}')
    if data:
        return json.loads(data['Value'].decode('utf-8'))
    return None

def set_namespace_config(config):
    versions_key = 'namespace/versions'
    index, data = consul_client.kv.get(versions_key)
    versions = json.loads(data['Value'].decode('utf-8')) if data else []
    new_version = f"v{len(versions)}"
    versions.append(new_version)
    consul_client.kv.put(versions_key, json.dumps(versions))
    consul_client.kv.put(f'namespace/{new_version}', json.dumps(config))
    consul_client.kv.put('active_namespace', new_version)
    return new_version

def validate_namespace_config(data):
    if not isinstance(data, dict):
        return False

    for relation, rules in data.items():
        if not isinstance(rules, dict):
            return False
        if "union" in rules:
            if not isinstance(rules["union"], list):
                return False
            for rule in rules["union"]:
                if not isinstance(rule, dict):
                    return False
                if "this" in rule and not isinstance(rule["this"], dict):
                    return False
                if "computed_userset" in rule:
                    if not isinstance(rule["computed_userset"], dict):
                        return False
                    if "relation" not in rule["computed_userset"]:
                        return False
    return True

@app.route('/acl', methods=['POST'])
def create_acl():
    data = request.json
    key = f"{data['object']}@{data['user']}"
    value = data['relation']
    db.put(key.encode('utf-8'), value.encode('utf-8'))
    return jsonify({"status": "success"}), 201

@app.route('/acl/check', methods=['GET'])
def check_acl():
    object = request.args.get('object')
    relation = request.args.get('relation')
    user = request.args.get('user')

    active_version = get_active_namespace()
    if not active_version:
        return jsonify({"authorized": False, "message": "No active namespace found"}), 404

    config = get_namespace_config(active_version)
    if not config:
        return jsonify({"authorized": False}), 404

    roles = list(config.keys())

    if relation not in roles:
        return jsonify({"authorized": False}), 404

    def is_authorized(obj, rel, usr):
        key = f"{obj}@{usr}"
        stored_relation = db.get(key.encode('utf-8'))
        if stored_relation and stored_relation.decode('utf-8') == rel:
            return True

        if 'union' in config.get(rel, {}):
            for rule in config[rel]['union']:
                if 'computed_userset' in rule:
                    parent_rel = rule['computed_userset']['relation']
                    if is_authorized(obj, parent_rel, usr):
                        return True
        return False

    authorized = is_authorized(object, relation, user)
    return jsonify({"authorized": authorized})

@app.route('/namespace', methods=['POST'])
def create_namespace_version():
    data = request.json
    if not validate_namespace_config(data):
        return jsonify({"status": "error", "message": "Invalid namespace configuration"}), 400

    config = data['relations']
    new_version = set_namespace_config(config)
    return jsonify({"status": "success", "new_version": new_version}), 201

@app.route('/namespace/roles', methods=['GET'])
def get_roles():
    active_version = get_active_namespace()
    if not active_version:
        return jsonify({"status": "error", "message": "No active namespace found"}), 404

    config = get_namespace_config(active_version)
    if not config:
        return jsonify({"status": "error", "message": "Namespace not found"}), 404

    roles = list(config.keys())
    return jsonify({"roles": roles}), 200

@app.route('/namespaces', methods=['GET'])
def get_all_namespace_versions():
    index, data = consul_client.kv.get('namespace/versions')
    versions = json.loads(data['Value'].decode('utf-8')) if data else []
    return jsonify({"versions": versions}), 200


@app.route('/active', methods=['GET'])
def get_active_version():
    active_version = get_active_namespace()
    return jsonify({"versions": active_version}), 200

@app.route('/namespace/switch', methods=['POST'])
def switch_active_namespace():
    data = request.json
    version = data.get('version')
    if not version:
        return jsonify({"status": "error", "message": "Version is required"}), 400

    index, data = consul_client.kv.get(f'namespace/{version}')
    if not data:
        return jsonify({"status": "error", "message": "Version not found"}), 404

    consul_client.kv.put('active_namespace', version)
    return jsonify({"status": "success"}), 200

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')

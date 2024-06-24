import logging
import json
import os
from flask import Flask, request, jsonify
import consul
import plyvel

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize LevelDB
db = plyvel.DB('127.0.0.1:2012', create_if_missing=True)
app = Flask(__name__)

# Consul configuration
consul_host = os.environ.get('CONSUL_HOST', 'localhost')
consul_port = int(os.environ.get('CONSUL_PORT', 8500))
consul_client = consul.Consul(host=consul_host, port=consul_port)

def get_namespace_config(namespace):
    index, data = consul_client.kv.get(f'namespace/{namespace}')
    if data:
        return json.loads(data['Value'].decode('utf-8'))
    return None

def set_namespace_config(namespace, config):
    consul_client.kv.put(f'namespace/{namespace}', json.dumps(config))

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

    namespace = object.split(':')[0]
    config = get_namespace_config(namespace)

    if not config:
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

def validate_namespace_config(data):
    required_keys = {"namespace", "relations"}
    if not all(key in data for key in required_keys):
        return False

    relations = data["relations"]
    if not isinstance(relations, dict):
        return False

    for relation, rules in relations.items():
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

@app.route('/namespace', methods=['POST'])
def create_namespace():
    data = request.json
    if not validate_namespace_config(data):
        return jsonify({"status": "error", "message": "Invalid namespace configuration"}), 400

    namespace = data['namespace']
    config = data['relations']
    set_namespace_config(namespace, config)
    return jsonify({"status": "success"}), 201

@app.route('/namespace/<namespace>/roles', methods=['GET'])
def get_roles(namespace):
    config = get_namespace_config(namespace)
    if not config:
        return jsonify({"status": "error", "message": "Namespace not found"}), 404

    roles = list(config.keys())
    return jsonify({"roles": roles}), 200

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')

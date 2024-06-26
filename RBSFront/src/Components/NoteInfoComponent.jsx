import {
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../App";

const NoteInfoComponent = ({ note }) => {
  const [text, setText] = useState("You don't have access to this note");
  const [isOwner, setIsOwner] = useState(false);
  const [roles, setRoles] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/Notes/${note.id}`, { withCredentials: true })
      .then((response) => {
        setText(response.data.text);
      })
      .catch((error) => {
        setText(error.response.data);
      });

    axios
      .get(`${API_BASE_URL}/Notes/is-owner/${note.id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setIsOwner(response.data);
        if (response.data) {
          axios
            .get(`${API_BASE_URL}/Notes/note-roles/${note.id}`, {
              withCredentials: true,
            })
            .then((response) => {
              setRoles(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [note.id]);

  const handleSubmit = () => {
    console.log("Input Value:", inputValue);
    console.log("Selected Role:", selectedRole);
    let user = {
      "targetUsername": inputValue,
      "relation": selectedRole,
    }

    axios.post(`${API_BASE_URL}/Notes/${note.id}/share`, user, { withCredentials: true })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12} sm={8}>
          <Typography variant="h5">{note.name}</Typography>
          <Box mt={2}>
            <Typography variant="body2">{text}</Typography>
          </Box>
        </Grid>
        {isOwner && (
          <Grid item xs={12} mt={2}>
            <TextField
              label="email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              fullWidth
              margin="normal"
            />
            <FormControl
              fullWidth
              margin="normal"
              sx={{ backgroundColor: "#333" }}
            >
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                sx={{ backgroundColor: "#333" }}
                labelId="role-select-label"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map((role, index) => (
                  <MenuItem
                    key={index}
                    value={role}
                    sx={{ backgroundColor: "#333" }}
                  >
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default NoteInfoComponent;

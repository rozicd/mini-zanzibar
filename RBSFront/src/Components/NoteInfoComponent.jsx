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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../App";

const NoteInfoComponent = ({ note }) => {
  const [text, setText] = useState("You don't have access to this note");
  const [isOwner, setIsOwner] = useState(false);
  const [roles, setRoles] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [access, setAccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/Notes/${note.id}`, { withCredentials: true })
      .then((response) => {
        setText(response.data.text);
        setNoteContent(response.data.text);
        setAccess(true);
      })
      .catch((error) => {
        setText(error.response.data);
        setAccess(false);
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
      targetUsername: inputValue,
      relation: selectedRole,
    };

    axios
      .post(`${API_BASE_URL}/Notes/${note.id}/share`, user, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setSnackbar({ open: true, message: "Role assigned successfully", severity: "success" });
      })
      .catch((error) => {
        console.log(error);
        setSnackbar({ open: true, message: "Failed to assign role", severity: "error" });
      });
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleEditSubmit = () => {
    axios
      .put(
        `${API_BASE_URL}/Notes/${note.id}`,
        { text: noteContent },
        { withCredentials: true }
      )
      .then((response) => {
        setText(noteContent);
        handleCloseDialog();
        setSnackbar({ open: true, message: "Note edited successfully", severity: "success" });
      })
      .catch((error) => {
        console.log(error);
        setSnackbar({ open: true, message: "Failed to edit note", severity: "error" });
      });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
        {access && (
          <Grid item xs={12} mt={2}>
            <IconButton sx={{ float: "right" }} color="secondary" onClick={handleOpenDialog}>
              <EditIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle sx={{ backgroundColor: "#333" }}>Edit Note</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#333" }}>
          <DialogContentText sx={{ backgroundColor: "#333" }}>
            Edit the content of the note below:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Note Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#333" }}>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NoteInfoComponent;

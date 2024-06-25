import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BasicPagination from "../Components/BasicPagination";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import NoteCardComponent from "../Components/NoteCardComponent";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const NotesPage = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10 });
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newNoteName, setNewNoteName] = useState("");
  const [newNoteText, setNewNoteText] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users/authenticate`, { withCredentials: true })
      .then((response) => {
        console.log(response);
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
        navigate("/login");
      });
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [user, pagination.pageNumber, pagination.pageSize]);

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      pageNumber: newPage,
    });
  };

  const fetchNotes = () => {
    console.log("Page:", pagination.pageNumber);
    axios
      .get(`${API_BASE_URL}/Notes/`, {
        params: {
          Search: search,
          Page: pagination.pageNumber,
          PageSize: pagination.pageSize,
        },
        withCredentials: true,
      })
      .then((response) => {
        setNotes(response.data.items);
        setTotalItems(response.data.totalItems);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddNote = () => {
    const newNote = {
      name: newNoteName,
      nameSpace: "doc",
      text: newNoteText,
    };
    axios.post(`${API_BASE_URL}/Notes/`, newNote, { withCredentials: true })
      .then((response) => {
        console.log(response);
        fetchNotes();
        handleCloseDialog();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Box display="flex" justifyContent="center" alignItems="center" marginBottom={2}>
        <IconButton color="primary" onClick={handleOpenDialog}>
          <AddIcon />
        </IconButton>
      </Box>

      <BasicPagination
        currentPage={pagination.pageNumber}
        pageSize={pagination.pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {notes.map((n) => (
          <NoteCardComponent key={n.id} note={n} />
        ))}
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle sx={{ backgroundColor: "#333" }}>Add New Note</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#333" }}>
          <TextField
            autoFocus
            margin="dense"
            label="Note Name"
            type="text"
            fullWidth
            value={newNoteName}
            onChange={(e) => setNewNoteName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Note Text"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#333" }}>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddNote} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotesPage;

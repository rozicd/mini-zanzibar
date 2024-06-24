import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BasicPagination from "../Components/BasicPagination";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import NoteCardComponent from "../Components/NoteCardComponent";

const NotesPage = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10 });
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [note, setNotes] = useState([]);

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

  return (
    <div>
      

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
        {note.map((n) => (
          <NoteCardComponent note = {n}/>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
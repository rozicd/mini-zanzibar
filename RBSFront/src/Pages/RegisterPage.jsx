import React, { useState } from "react";
import BasicForm from "../Components/BasicForm";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { API_BASE_URL } from "../App";
import axios from "axios";
import { Card, CardContent } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const registerTemplate = [
  {
    item: "BasicInput",
    label: "E-mail",
    itemValue: "email",
    type: "email",
  },
  {
    item: "BasicInput",
    label: "Name",
    itemValue: "name",
  },
  {
    item: "BasicInput",
    label: "Surname",
    itemValue: "surname",
  },
  {
    item: "BasicInput",
    label: "Password",
    itemValue: "password",
    type: "password",
  },
  {
    item: "BasicInput",
    label: "Confirm Password",
    itemValue: "confirmPassword",
    type: "password",
  },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");

  const handleCloseDialog = () => {
    setDialogOpen(false);
    navigate("/login");
  };

  const handleSubmit = async (state) => {
    if (state.password !== state.confirmPassword) {
      setDialogTitle("Error");
      setDialogContent("Passwords do not match.");
      setDialogOpen(true);
      return;
    }

    let data = new FormData();
    data.append("email", state.email);
    data.append("name", state.name);
    data.append("surname", state.surname);
    data.append("password", state.password);
    data.append("confirmPassword", state.confirmPassword); // Add confirmPassword

    axios
      .post(`${API_BASE_URL}/users`, data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setDialogTitle("Success");
        setDialogContent("You have successfully registered. Please login to continue.");
        setDialogOpen(true);
      })
      .catch((error) => {
        console.log(error);
        setDialogTitle("Error");
        setDialogContent(error.response?.data?.message || "Registration failed.");
        setDialogOpen(true);
      });
  };

  return (
    <div>
      <Card
        sx={{
          maxWidth: 400,
          margin: "0 auto",
          marginTop: "50px",
          padding: "10px",
          backgroundColor: "#333",
          color: "white",
        }}
      >
        <CardContent>
          <BasicForm label="Register" buttonName="Register" template={registerTemplate} callback={handleSubmit} />
          <Link to="/login" style={{ textDecoration: "none", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button color="inherit" sx={{ fontSize: "small", marginTop: "10px" }}>
              Already have an account? Login
            </Button>
          </Link>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle sx={{ backgroundColor: "#333" }}>{dialogTitle}</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#333" }}>{dialogContent}</DialogContent>
        <DialogActions sx={{ backgroundColor: "#333" }}>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegisterPage;

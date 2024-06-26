import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  styled,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../App";

const CustomSelect = styled(Select)(({ theme }) => ({
  backgroundColor: "#333",
  color: "white",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "gray",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "lightgray",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  "& .MuiSelect-select": {
    backgroundColor: "#333",
  },
  "& .MuiSelect-icon": {
    color: "white",
  },
  "& .MuiInputBase-root": {
    backgroundColor: "#333",
  },
  "& .MuiPaper-root": {
    backgroundColor: "#333",
    color: "white",
  },
}));

const CustomMenuItem = styled(MenuItem)({
  backgroundColor: "#333",
  color: "white",
  "&:hover": {
    backgroundColor: "gray",
  },
});
const AdminHomePage = () => {
  const [textValue, setTextValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [allVersions, setAllVersions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectValue(event.target.value);
  };

  const handleTextSubmit = () => {
    let data = new FormData();
    data.append("Json", textValue);
    axios
      .post(`${API_BASE_URL}/Notes/namespace`, data, { withCredentials: true })
      .then((response) => {
        console.log(response);
        setRefresh(!refresh);
        setSnackbar({ open: true, message: "Text submitted successfully", severity: "success" });
      })
      .catch((error) => {
        console.log(error);
        setSnackbar({ open: true, message: "Text submission failed", severity: "error" });
      });
  };

  const handleSelectSave = () => {
    axios
      .post(
        `${API_BASE_URL}/Notes/namespace/switch`,
        { text: selectValue },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        setSnackbar({ open: true, message: "Version saved successfully", severity: "success" });
      })
      .catch((error) => {
        console.log(error);
        setSnackbar({ open: true, message: "Version save failed", severity: "error" });
      });
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/Notes/namespace/active`, { withCredentials: true })
      .then((response) => {
        console.log(response);
        setSelectValue(response.data); // Set current version as the initial selected value

        axios
          .get(`${API_BASE_URL}/Notes/namespace/all`, { withCredentials: true })
          .then((response) => {
            console.log(response);
            setAllVersions(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Grid container spacing={2} style={{ height: "95vh", marginTop: "20px" }}>
      <Grid item xs={9}>
        <TextField
          fullWidth
          variant="outlined"
          label="Namespace JSON (format- {relations: {relations}}"
          value={textValue}
          onChange={handleTextChange}
          multiline
          rows={10}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleTextSubmit}
          style={{ marginTop: "16px" }}
        >
          Submit
        </Button>
      </Grid>
      <Grid item xs={3}>
        <FormControl
          sx={{ backgroundColor: "#333" }}
          fullWidth
          variant="outlined"
        >
          <InputLabel sx={{ color: "white" }}>Select Option</InputLabel>
          <CustomSelect
            value={selectValue}
            onChange={handleSelectChange}
            label="Select Option"
          >
            {allVersions.map((version) => (
              <CustomMenuItem key={version} value={version}>
                {version}
              </CustomMenuItem>
            ))}
          </CustomSelect>
        </FormControl>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSelectSave}
          style={{ marginTop: "16px" }}
        >
          Save
        </Button>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default AdminHomePage;

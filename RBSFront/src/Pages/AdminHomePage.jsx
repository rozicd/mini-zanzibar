import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../App";

const AdminHomePage = () => {
  const [textValue, setTextValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [allVersions, setAllVersions] = useState([]);
  const [refresh, setRefresh] = useState(false);

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
      })
      .catch((error) => {
        console.log(error);
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
      })
      .catch((error) => {
        console.log(error);
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

  return (
    <Grid container spacing={2} style={{ height: "95vh", marginTop: "20px" }}>
      <Grid item xs={9}>
        <TextField
          fullWidth
          variant="outlined"
          label="Text Box"
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
          <InputLabel>Select Option</InputLabel>
          <Select
            sx={{ backgroundColor: "#333" }}
            value={selectValue}
            onChange={handleSelectChange}
            label="Select Option"
          >
            {allVersions.map((version) => (
              <MenuItem
                sx={{ backgroundColor: "#333" }}
                key={version}
                value={version}
              >
                {version}
              </MenuItem>
            ))}
          </Select>
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
    </Grid>
  );
};

export default AdminHomePage;

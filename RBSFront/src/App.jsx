import logo from "./logo.svg";
import LoginComponent from "./Pages/LoginPage";
import { ThemeProvider } from "@mui/material/styles";
import { themeOptions } from "./themeOptions";
import { Container } from "@mui/material";
import HomePage from "./Pages/HomePage";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import NotesPage from "./Pages/NotesPage";
import AdminHomePage from "./Pages/AdminHomePage";


export const API_BASE_URL = "http://localhost:5107/api";

function App() {
  return (
    <ThemeProvider theme={themeOptions}>
      <Router>
        <Routes>
          <Route path="/*" element={<HomePage />} >

          <Route path="home" element={<NotesPage />} />
          <Route path="admin-home" element={<AdminHomePage />} />

          





          </Route>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterPage />} />

        </Routes>

        <Container sx={{ height: "100%" }}>

        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;

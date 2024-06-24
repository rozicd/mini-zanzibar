import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../Components/NavbarComponent";

import { Outlet } from "react-router-dom";


const HomePage = () => {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState(null);


  useEffect(() => {
    axios.get(`${API_BASE_URL}/users/authenticate`, {withCredentials: true})
    .then((response) => {
        console.log(response);
        setLoggedUser(response.data);

    })
    .catch((error) => {
        console.log(error);

    });
}, []);

  useEffect(() => {
    if (loggedUser != null && loggedUser.role === "ROLE_ADMIN") {
      navigate("/admin");
    } else if (loggedUser != null && loggedUser.role === "ROLE_USER") {
      navigate("/movies");
    }
  }, []);

 

  return (
    <div>
      {loggedUser && <NavbarComponent loggedUser={loggedUser}></NavbarComponent>}
      <Outlet style={{ flex: 1, overflowY: "auto" }}></Outlet>


      
    </div>
  );
};

export default HomePage;

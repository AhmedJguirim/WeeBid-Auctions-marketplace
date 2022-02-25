import React from 'react'
import { useState } from "react";
import { Grid , Box , TextField, Button } from '@mui/material'
import axios from 'axios';


const Login = () => {


    //#region form data state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
    //#endregion
    
    //#region state manipulation mathods
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
    //#endregion
    async function getUser() {
      try {
        const response = await axios.get("/api/userdata",{ headers : {'Authorization': `Bearer ${localStorage.getItem("token")}`}});
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
    
    const onSubmit = (event) => {
        event.preventDefault();
        const axios = require("axios");
        axios
          .post("/api/login_check", {
            username: email,
            password: password,
          })
          .then(function (response) {
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("refresh", response.data.refresh_token)

            
          })
          .catch(function (error) {
            console.log(error);
          });
          
      };
  
    return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={8}>
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
            width: "80%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            required
            id="email"
            label="Adresse Email"
            value={email}
            onChange={handleEmail}
          />
          <TextField
            required
            id="password"
            label="mot de passe"
            type="password"
            value={password}
            onChange={handlePassword}
          />
          <Button type="submit">sub</Button>
          <Button onClick={getUser}>get infos</Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Login
import React from "react";
import { useState } from "react";
import { Grid, Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { ButtonStyles, formBox } from "../base/customComponents/general";
import { apiRoutes } from "../../config/routes";
import API from "../../AxiosInstance";

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
      const response = await API.get(`userdata`);
      console.log(response["data"]);
    } catch (error) {
      console.error(error);
    }
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const axios = require("axios");
    API
      .post(`login_check`, {
        username: email,
        password: password,
      })
      .then(function (response) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refresh", response.data.refresh_token);
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
      <Grid item xs={12}>
        <Typography variant="h2">se connecter</Typography>
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={formBox}
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
          <Button type="submit" sx={ButtonStyles}>sub</Button>
          <Button onClick={getUser} sx={ButtonStyles}>get infos</Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;

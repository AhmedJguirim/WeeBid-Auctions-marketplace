import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { ButtonStyles, formBox } from "../base/customComponents/general";
import { apiRoutes } from "../../config/routes";

export const Register = () => {

  //#region form data state
  const [date, setDate] = React.useState(new Date());
  const [name, setName] = React.useState("");
  const [telephone, setTelephone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  //#endregion

  //#region state manipulation mathods

  const handleName = (event) => {
    setName(event.target.value);
  };
  const handleTelephone = (event) => {
    setTelephone(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleDisplayName = (event) => {
    setDisplayName(event.target.value);
  };
  //#endregion


  //#region registration POST request on submit
  const onSubmit = (event) => {
    event.preventDefault();
    const axios = require("axios");
    axios
      .post(`${apiRoutes.API}/register`, {
        name: name,
        displayName: displayName,
        email: email,
        password: password,
        telephone: telephone,
        avatar: "demo",
        isActive: true,
        birthDate: date,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //#endregion


  const styles = {
    form: {
      "& .MuiTextField-root": { m: 1, width: "25ch" },
      width: "80%",
      display: "flex",
      flexDirection: "column",
    },
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={formBox}
      >
        <Typography variant="h2">s'inscrir</Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item>
            <TextField
              required
              id="name"
              label="Nom complet"
              value={name}
              onChange={handleName}
            /></Grid><Grid item>
            <TextField
              required
              id="displayName"
              label="Nom d'utilisateur"
              value={displayName}
              onChange={handleDisplayName}
            /></Grid><Grid item>
            <TextField
              required
              id="email"
              label="Adresse Email"
              value={email}
              onChange={handleEmail}
            /></Grid><Grid item>
            <TextField
              required
              id="password"
              label="mot de passe"
              type="password"
              value={password}
              onChange={handlePassword}
            /></Grid><Grid item>
            <TextField
              required
              id="telephone"
              label="numero de téléphone"
              value={telephone}
              onChange={handleTelephone}
            /></Grid><Grid item>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DesktopDatePicker
                label="date de naissance"
                inputFormat="MM/dd/yyyy"
                value={date}
                onChange={setDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider></Grid>
            <Grid item>
            <Button type="submit" sx={ButtonStyles}>soumettre</Button>
            <br /><br /><br />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

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
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Register = () => {

  const navigate= new useNavigate()
  //#region form data state
  const [date, setDate] = React.useState(new Date());
  const [name, setName] = React.useState("");
  const [telephone, setTelephone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [pays, setPays] = React.useState("");
  const [ville, setVille] = React.useState("");
  const [rue, setRue] = React.useState("");
  const [zipcode, setZipcode] = React.useState("");
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
  const handlePays = (event) => {
    setPays(event.target.value);
  };
  const handleVille = (event) => {
    setVille(event.target.value);
  };
  const handleRue = (event) => {
    setRue(event.target.value);
  };
  const handleZipcode = (event) => {
    setZipcode(event.target.value);
  };
  //#endregion

  //login after registration
  const login = () => {
    axios
      .post(`${apiRoutes.API}/login_check`, {
        username: email,
        password: password,
      })
      .then(function (response) {
        localStorage.setItem("token", response.data.token);
        // localStorage.setItem("refresh", response.data.refresh_token);
        navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //#region registration POST request on submit
  const onSubmit = (event) => {
    event.preventDefault();
    //TODO: fix error
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
        axios.post(`${apiRoutes.API}/adresses`, {
          pays: pays,
          ville: ville,
          rue: rue,
          zipcode: zipcode,
          user: response["data"]["@id"]
        }).then(response=>{
          console.log("address created")
        login();
      })
        .catch(error=>console.log(error));
        
      })
      .catch(function (error) {
        console.log(error);
        login();
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
      <Box sx={formBox}>
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
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="displayName"
                label="Nom d'utilisateur"
                value={displayName}
                onChange={handleDisplayName}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="email"
                label="Adresse Email"
                value={email}
                onChange={handleEmail}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="password"
                label="mot de passe"
                type="password"
                value={password}
                onChange={handlePassword}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="telephone"
                label="numero de téléphone"
                value={telephone}
                onChange={handleTelephone}
              />
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DesktopDatePicker
                  label="date de naissance"
                  inputFormat="MM/dd/yyyy"
                  value={date}
                  onChange={setDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item>
            <Typography variant="h4">adresse:</Typography>
              <TextField
                required
                id="pays"
                label="Pays"
                value={pays}
                onChange={handlePays}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="ville"
                label="ville"
                value={ville}
                onChange={handleVille}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="rue"
                label="rue"
                value={rue}
                onChange={handleRue}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="zipcode"
                label="code zip"
                value={zipcode}
                onChange={handleZipcode}
              />
              
            </Grid>
            <Grid item>
            <Button type="submit" sx={ButtonStyles}>
                soumettre
              </Button>
              <br />
              <br />
              <br />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

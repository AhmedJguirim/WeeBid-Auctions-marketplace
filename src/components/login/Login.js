import React from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import image from "../../media/images/dotItLogo.png";
import { ButtonStyles, formBox } from "../base/customComponents/general";
import axios from "axios";
// import { useDispatch } from 'react-redux'
import { apiRoutes } from "../../config/routes";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = React.useState("");
  // const navigate = useNavigate()
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

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${apiRoutes.API}/login_check`, {
        username: email,
        password: password,
      })
      .then(function (response) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refresh", response.data.refresh_token);
        document.location.href = "/";
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status === 401) {
            setError("Utilisateur untrouvable");
            handleClickOpen();
          } else if (error.response.status >= 500) {
            setError("Erreur Interne du Serveur");
            handleClickOpen();
          }
        }
      });
  };
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid
      container
      spacing={0}
      sx={{ minHeight: "100%", backgroundColor: "primary.main" }}
    >
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{error}</DialogTitle>
        <DialogContent>
          {error === "Erreur Interne du Serveur" ? (
            <Typography>veuillez réessayer ultérieurement</Typography>
          ) : (
            <Typography>
              veuillez vérifier les coordonnées données et réessayer
            </Typography>
          )}
          <Button
            onClick={() => handleClose()}
            sx={{ ...ButtonStyles, mt: "5%", float: "right" }}
          >
            Retourner
          </Button>
        </DialogContent>
      </Dialog>
      <Grid item xs={6} textAlign={"center"} marginTop={"5%"}>
        <img src={image} className={"loginImage"} alt=""></img>
        <Typography variant="h5" marginTop={"5%"}>
          Dot-IT vous permet de trouver l'offre de vos rèves
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Box component="form" onSubmit={onSubmit} sx={formBox}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h2" marginBottom={"5%"} marginTop={"12%"}>
              Se connecter
            </Typography>
            <Grid item xs={12}>
              <TextField
                required
                id="email"
                label="Adresse Email"
                value={email}
                onChange={handleEmail}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: "3%" }}>
              <TextField
                required
                id="password"
                label="mot de passe"
                type="password"
                value={password}
                onChange={handlePassword}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: "3%" }}>
              <Button type="submit" sx={{ ...ButtonStyles }}>
                se connercter
              </Button>
            </Grid>
            {/* <Button onClick={getUser} sx={ButtonStyles}>get infos</Button> */}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;

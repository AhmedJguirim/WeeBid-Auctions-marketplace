import DateAdapter from "@mui/lab/AdapterDateFns";
import { ButtonStyles, formBox } from "../base/customComponents/general";
import {
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/lab";
import * as React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  CssBaseline,
  Button,
} from "@mui/material";
import { apiRoutes} from "../../config/routes";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
  import axios from "axios";
import { useNavigate } from "react-router-dom";

const steps = [
  
  "données de connection",
  "données générales",
  "votre adresse",
];

export default function MultiStepRegister() {
  const navigate= new useNavigate()
  //#region stepper part
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  };

  //#endregion
  //#region form part
  //#region form data state

  //#region states
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


  //#region state manipulation mathods
  //specific to article
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

  //#region categories for form
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
          console.log(response["data"]["@id"], "created successfully!")
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
  //#endregion
  return (
    <Box sx={{ width: "60%" , display:"blocks", mr:"auto", ml:"auto" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={formBox}>
          
          <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {activeStep === 0 && (
                <div className="step1">
                    <Typography variant="h2" sx={{mb:2}}>{steps[0]}</Typography>
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
                </div>
              )}
              {/* TODO: make an optional step for documents */}
              {activeStep === 1 && (
                  
                <div className="step2">
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
                </div>
              )}
              <Grid item xs={12}>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished {activeStep} {steps.length}
                  </Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ ...ButtonStyles , mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />


                    {activeStep === steps.length - 1 ? <Button sx={ButtonStyles} type="submit">
                        soumettre
                      
                    </Button> : 
                    <Button sx={ButtonStyles} onClick={handleNext}>
                    next
                  
                </Button>}
                  </Box>
                </React.Fragment>
              )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

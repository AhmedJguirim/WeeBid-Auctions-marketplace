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
import { useFormik } from "formik";

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
  const validate = values => {
    const errors = {};
    if (!values.name) {
      errors.name = 'ce champ est obligatoir';
    } else if (values.name.length > 20) {
      errors.name = 'le nom doit avoir 20 characteres au maximum';
    }
    
    if (!values.email) {
      errors.email = 'ce champ est obligatoir';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.displayName) {
      errors.displayName = 'ce champ est obligatoir';
    } else if (values.displayName.length > 10) {
      errors.displayName = "le nom d'utilisateur doit avoir 20 characteres au maximum";
    }else if (values.displayName.length <4) {
      errors.displayName = "le nom d'utilisateur doit avoir 4 characteres au minimum";
    }

    if (!values.telephone) {
      errors.telephone = 'ce champ est obligatoir';
    } else if (!/^[0-9]{8}$/i.test(values.telephone)) {
      errors.telephone = "le numero de telephone doit contenir exactement 8 chiffres";
    }
    if (!values.zipcode) {
      errors.zipcode = 'ce champ est obligatoir';
    } else if (!/^[0-9]{4}$/i.test(values.zipcode)) {
      errors.zipcode = "le code zip doit contenir exactement 4 chiffres";
    }
    if (!values.ville) {
      errors.ville = 'ce champ est obligatoir';
    } else if (values.ville.length > 10) {
      errors.ville = "le nom de ville doit avoir 10 characteres au maximum";
    }

    if (!values.pays) {
      errors.pays = 'ce champ est obligatoir';
    } else if (values.pays.length > 10) {
      errors.pays = "le nom de pays doit avoir 10 characteres au maximum";
    }

    if (!values.rue) {
      errors.rue = 'ce champ est obligatoir';
    } else if (values.rue.length > 10) {
      errors.rue = "le nom de rue doit avoir 10 characteres au maximum";
    }

    if (!values.password) {
      errors.password = 'ce champ est obligatoir';
    } else if (values.password.length < 4) {
      errors.password = "le mot de passe doit avoir 6 characteres au minimum";
    }
  
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      telephone: "",
      email: "",
      password: "",
      displayName: "",
      pays: "",
      ville: "",
      rue: "",
      zipcode: "",
    },
    validate,
  });


  //#endregion

  //#region categories for form
  const login = () => {
    axios
      .post(`${apiRoutes.API}/login_check`, {
        username: formik.values.email,
        password: formik.values.password,
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
        name: formik.values.name,
        displayName: formik.values.displayName,
        email: formik.values.email,
        password: formik.values.password,
        telephone: formik.values.telephone,
        avatar: "demo",
        isActive: true,
        birthDate: date,
      })
      .then(function (response) {
        console.log(response);
        axios.post(`${apiRoutes.API}/adresses`, {
          pays: formik.values.pays,
          ville: formik.values.ville,
          rue: formik.values.rue,
          zipcode: formik.values.zipcode,
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
                    {formik.errors.name ? <div>{formik.errors.name}</div> : null}
              <TextField
                required
                id="name"
                label="Nom complet"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item>
            {formik.errors.displayName ? <div>{formik.errors.displayName}</div> : null}
              <TextField
                required
                id="displayName"
                label="Nom d'utilisateur"
                value={formik.values.displayName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item>
            {formik.errors.email ? <div>{formik.errors.email}</div> : null}
              <TextField
                required
                id="email"
                label="Adresse Email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item>
            {formik.errors.password ? <div>{formik.errors.password}</div> : null}
              <TextField
                required
                id="password"
                label="mot de passe"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item>
            {formik.errors.telephone ? <div>{formik.errors.telephone}</div> : null}
              <TextField
                required
                id="telephone"
                label="numero de téléphone"
                value={formik.values.telephone}
                onChange={formik.handleChange}
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
                    {formik.errors.pays ? <div>{formik.errors.pays}</div> : null}
            <Typography variant="h4">adresse:</Typography>
              <TextField
                required
                id="pays"
                label="Pays"
                value={formik.values.pays}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item>
            {formik.errors.ville ? <div>{formik.errors.ville}</div> : null}
              <TextField
                required
                id="ville"
                label="ville"
                value={formik.values.ville}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item>
            {formik.errors.rue ? <div>{formik.errors.rue}</div> : null}
              <TextField
                required
                id="rue"
                label="rue"
                value={formik.values.rue}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item>
            {formik.errors.zipcode ? <div>{formik.errors.zipcode}</div> : null}
              <TextField
                required
                id="zipcode"
                label="code zip"
                value={formik.values.zipcode}
                onChange={formik.handleChange}
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

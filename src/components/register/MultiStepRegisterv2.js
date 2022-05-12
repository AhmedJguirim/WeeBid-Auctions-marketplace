import DateAdapter from "@mui/lab/AdapterDateFns";
import { ButtonStyles, formBox, formContainer, FormTextField } from "../base/customComponents/general";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
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
import { apiRoutes, navRoutes } from "../../config/routes";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { pinkish } from "../base/customComponents/general";


const steps = ["données de connection" ,"votre adresse"];

export default function MultiStepRegister() {
  const navigate = new useNavigate();
  //#region stepper part
  const [activeStep, setActiveStep] = React.useState(0);
  const [containsError , setContainsError] = React.useState(true)
  const [stepOne, setStepOne] = React.useState(false);
  const [stepTwo, setStepTwo] = React.useState(false);

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
  const validate = (values) => {
    const errors = {};
    const currentDate = new Date();
    if (!values.name) {
      errors.name = "ce champ est obligatoir";
    } else if (values.name.length > 20) {
      errors.name = "le nom doit avoir 20 characteres au maximum";
    }

    if (!values.email) {
      errors.email = "ce champ est obligatoir";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }
    if (!values.displayName) {
      errors.displayName = "ce champ est obligatoir";
    } else if (values.displayName.length > 10) {
      errors.displayName =
        "le nom d'utilisateur doit avoir 20 characteres au maximum";
    } else if (values.displayName.length < 4) {
      errors.displayName =
        "le nom d'utilisateur doit avoir 4 characteres au minimum";
    }

    if (!values.telephone) {
      errors.telephone = "ce champ est obligatoir";
    } else if (!/^[0-9]{8}$/i.test(values.telephone)) {
      errors.telephone =
        "le numero de telephone doit contenir exactement 8 chiffres";
    }
    if (!values.zipcode) {
      errors.zipcode = "ce champ est obligatoir";
    } else if (!/^[0-9]{4}$/i.test(values.zipcode)) {
      errors.zipcode = "le code zip doit contenir exactement 4 chiffres";
    }
    if (!values.ville) {
      errors.ville = "ce champ est obligatoir";
    } else if (values.ville.length > 10) {
      errors.ville = "le nom de ville doit avoir 10 characteres au maximum";
    }

    if (!values.pays) {
      errors.pays = "ce champ est obligatoir";
    } else if (values.pays.length > 10) {
      errors.pays = "le nom de pays doit avoir 10 characteres au maximum";
    }

    if (!values.rue) {
      errors.rue = "ce champ est obligatoir";
    } else if (values.rue.length > 10) {
      errors.rue = "le nom de rue doit avoir 10 characteres au maximum";
    }

    if (!values.password) {
      errors.password = "ce champ est obligatoir";
    } else if (values.password.length < 4) {
      errors.password = "le mot de passe doit avoir 4 characteres au minimum";
    }
    if (!values.date) {
      errors.date = "champ obligatoir";
    } else if (values.date > currentDate) {
      errors.date = "la date de naissance ne peut pas etre superieur a la date actuelle";
    }
    else{
      delete errors.date
    }

    if(Object.keys(errors).length === 0){
      setContainsError(false)
  }
  if(errors.name === undefined && errors.displayName=== undefined && errors.email=== undefined && errors.telephone=== undefined 
    && errors.password=== undefined && errors.date=== undefined){
    setStepOne(true)      
  }else{
    setStepOne(false)
  }
  if(errors.ville === undefined && errors.rue=== undefined && errors.pays=== undefined && errors.zipcode ===undefined){
    setStepTwo(true)      
    
  }else{
    setStepTwo(false)
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
      date: Date.now(),
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

        // document.location.href = "/";
        // navigate("/");
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  const loginWithError = () => {
    axios
      .post(`${apiRoutes.API}/login_check`, {
        username: formik.values.email,
        password: formik.values.password,
      })
      .then(function (response) {
        localStorage.setItem("token", response.data.token);
        axios
          .get(`${apiRoutes.API}/userdata`, {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          })
          .then((res) => {
            console.log(res);
            axios
              .post(`${apiRoutes.API}/adresses`, {
                pays: formik.values.pays,
                ville: formik.values.ville,
                rue: formik.values.rue,
                zipcode: formik.values.zipcode,
                user: `/api/users/${res["data"].id}`,
              })
              .then((response) => {
                console.log(response["data"]["@id"], "created successfully!");
                document.location.href = "/";
              })
              .catch((error) => console.log(error));
          });
        // 
        // navigate("/");
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };
  //#region registration POST request on submit
  const onSubmit = (event) => {
    event.preventDefault();
    //TODO: fix error
    const date = new Date(formik.values.date);
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
        login();
        // you need to create an adress in the profile afterwards because of the error
        // axios
        //   .post(`${apiRoutes.API}/adresses`, {
        //     pays: formik.values.pays,
        //     ville: formik.values.ville,
        //     rue: formik.values.rue,
        //     zipcode: formik.values.zipcode,
        //     user: response["data"]["@id"],
        //   })
        //   .then((response) => {
        //     console.log(response["data"]["@id"], "created successfully!");
        //     login();
        //   })
        //   .catch((error) => console.log(error));
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.data["hydra:description"] == "not an error") {
            
            loginWithError();
          }
        }
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
    container: {
      width: "60%",
      display: "blocks",
      mr: "auto",
      ml: "auto",
      border: "1px solid black",
      padding: 10,
      padding: "40px",
      minWidth: "540px",
      borderRadius: "10px",

      transition: "all 0.4s ease",
      backgroundColor:"primary.main",
    },
    text: {
      mt: 1,
    },
    error:{
      fontSize:12,
      color:"error.main",
    }
  };
  //#endregion
  return (
    <Box sx={pinkish}>
      <br /><br />
    <Box sx={formContainer}>
      
      <Stepper sx={{width:"80%", margin: "0 auto"}} activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps} >
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Container component="main" maxWidth="xs">
        <CssBaseline />

          <Box component="form" onSubmit={onSubmit} sx={{...formBox, mt: 3 }}>
            <Grid container spacing={2}>
              {activeStep === 0 && (
                <div className="step1">
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {steps[0]}
                  </Typography>
                  <Grid item>
                    
                    <TextField
                      required
                      id="name"
                      error={formik.errors.name}
                      label="Nom complet"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      sx={styles.text}
                    />{formik.errors.name ? (
                      <Typography sx={styles.error}>{formik.errors.name}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item>
                    
                    <TextField
                      required
                      id="displayName"
                      error={formik.errors.displayName}
                      label="Nom d'utilisateur"
                      value={formik.values.displayName}
                      onChange={formik.handleChange}
                      sx={styles.text}
                    />{formik.errors.displayName ? (
                      <Typography sx={styles.error}>{formik.errors.displayName}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item>
                   
                    <TextField
                      required
                      id="email"
                      error={formik.errors.email}
                      label="Adresse Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      sx={styles.text}
                    /> {formik.errors.email ? (
                      <Typography sx={styles.error}>{formik.errors.email}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item>
                    
                    <TextField
                      required
                      id="password"
                      error={formik.errors.password}
                      label="mot de passe"
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      sx={styles.text}
                    />{formik.errors.password ? (
                      <Typography sx={styles.error}>{formik.errors.password}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item>
                   
                    <TextField
                      required
                      id="telephone"
                      label="numero de téléphone"
                      error={formik.errors.telephone}
                      value={formik.values.telephone}
                      onChange={formik.handleChange}
                      sx={styles.text}
                    /> {formik.errors.telephone ? (
                      <Typography sx={styles.error}>{formik.errors.telephone}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item sx={{mt:1}}>
                  <LocalizationProvider dateAdapter={DateAdapter}>
                      <DesktopDatePicker
                        label="date de naissance"
                        inputFormat="MM/dd/yyyy"
                        value={formik.values.date}
                        name="date"
                        onChange={(value) => {
                          formik.setFieldValue('date', Date.parse(value));
                          }}
                        renderInput={(params) => <FormTextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <React.Fragment>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ ...ButtonStyles, mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />

                      {activeStep === steps.length ? (
                          <></>
                      ) : (
                        <Button sx={ButtonStyles} disabled={!stepOne} onClick={handleNext}>
                          next
                        </Button>
                      )}
                    </Box>
                  </React.Fragment>
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
                      error={formik.errors.pays}
                      label="Pays"
                      value={formik.values.pays}
                      onChange={formik.handleChange}
                      sx={styles.text}
                    />
                    {formik.errors.pays ? (
                      <Typography sx={styles.error}>{formik.errors.pays}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item>

                    <TextField
                      required
                      id="ville"
                      label="ville"
                      
                      error={formik.errors.ville}
                      value={formik.values.ville}
                      onChange={formik.handleChange}
                      sx={styles.text}
                    />{formik.errors.ville ? (
                      <Typography sx={styles.error}>{formik.errors.ville}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item>

                    <TextField
                      required
                      id="rue"
                      label="rue"
                      error={formik.errors.rue}
                      value={formik.values.rue}
                      onChange={formik.handleChange}
                      sx={styles.text}
                    />{formik.errors.rue ? (
                      <Typography sx={styles.error}>{formik.errors.rue}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item>

                    <TextField
                      required
                      id="zipcode"
                      label="code zip"
                      value={formik.values.zipcode}
                      onChange={formik.handleChange}
                      sx={styles.text}
                    />{formik.errors.zipcode ? (
                      <Typography sx={styles.error}>{formik.errors.zipcode}</Typography>
                    ) : null}
                  </Grid>
                  <React.Fragment>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ ...ButtonStyles, mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />

                      {activeStep === steps.length ? (
                          <></>
                      ) : (
                        <Button sx={ButtonStyles} disabled={!stepTwo} type="submit">
                          next
                        </Button>
                      )}
                    </Box>
                  </React.Fragment>
                </div>
              )}
              {/* <Grid item xs={12}>
                {activeStep === steps.length &&
                  (<React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished {activeStep}{" "}
                      {steps.length}
                    </Typography>
                  </React.Fragment>)
                }
              </Grid> */}
            </Grid>
          </Box>
      </Container>
    </Box>
    <br /><br />
    </Box>
  );
}

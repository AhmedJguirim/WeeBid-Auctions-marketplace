import DateAdapter from "@mui/lab/AdapterDateFns";
import Api from "../../AxiosInstance";
import { ButtonStyles, formBox , formContainer, FormTextField} from "../base/customComponents/general";
import {
  DateTimePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/lab";
import * as React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Container,
  Typography,
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  Button,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { navRoutes } from "../../config/routes";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useNavigate } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import { useFormik } from "formik";
import { pinkish } from "../base/customComponents/general";

const steps = [
  "enregistrer un article",
  "enregistrer l'offre",
  "fixer les dates",
];
var someDate = new Date();
const stateOptions = ["utilisé", "neuf"];



export default function CreateArticle() {
    const validate = (values) => {
        const errors = {};
        const currentDate = new Date();
        //fabricationDate/localisation/brand/description/codebar are optional
        
        //name validation
        if (!values.name) {
          errors.name = "champ obligatoir";
        } else if (values.name.length > 15) {
          errors.name = "doit contenir 15 caractères au maximum";
        } else if (values.name.length < 4) {
          errors.name = "doit contenir 4 caractères au minimum";
        }
      
        //localisation validation
        if (!values.localisation) {
          errors.localisation = "champ obligatoir";
        } else if (values.localisation.length > 15) {
          errors.localisation = "doit contenir 15 caractères au maximum";
        } else if (values.localisation.length < 3) {
          errors.localisation = "doit contenir 4 caractères au minimum";
        }
      
        //brand validation
        if (!values.brand) {
        } else if (values.brand.length > 10) {
          errors.brand = "doit contenir 15 caractères au maximum";
        }
      
        //description validation
        if (!values.description) {
        } else if (values.description.length > 255) {
          errors.description = "doit contenir 255 caractères au maximum";
        }
      
        //quantity validation
        if (!values.quantity) {
          errors.quantity = "champ obligatoir";
        } else if (values.quantity < 0) {
          errors.quantity = "la quantité doit être positive";
        }
      
        //initPrice validation
        if (!values.initPrice) {
          errors.initPrice = "champ obligatoir";
        } else if (values.initPrice < 0) {
          errors.initPrice = "le prix initial doit être positif";
        }
      
        //immediatePrice validation
        if (!values.immediatePrice) {
          errors.immediatePrice = "champ obligatoir";
        } else if (values.immediatePrice < 0) {
          errors.immediatePrice = "le prix immediat doit être positif";
        } else if (values.immediatePrice < values.initPrice) {
          errors.immediatePrice =
            "le prix immediat doit être superieur au prix initial";
        }


        //fabrication date validation
        if (!values.date) {
            errors.date = "champ obligatoir";
          } else if (values.date > currentDate) {
            errors.date = "la date de fabrication ne peut pas etre superieur a la date actuelle";
          }
          else{
            delete errors.date
          }

          //start date validation
          if (!values.startDate) {
            errors.startDate = "champ obligatoir";
          } else if (values.startDate < currentDate) {
            errors.startDate = "la date de debut ne peut pas etre inferieur a la date actuelle";
          }else{
            delete errors.startDate
          }

          //end date validation
          if (!values.endDate) {
            errors.endDate = "champ obligatoir";
          } else if (values.endDate < currentDate) {
            errors.endDate = "la date de fin ne peut pas etre inferieur a la date actuelle";
          }else if (values.endDate < values.startDate) {
            errors.endDate = "la date de debut ne peut pas etre inferieur a la date de debut";
          }else{
            delete values.startDate
          }

      if(Object.keys(errors).length === 0){
          setContainsError(false)
      }
      if(errors.name === undefined && errors.localisation=== undefined && errors.brand=== undefined && errors.description=== undefined 
        && errors.state=== undefined && errors.date=== undefined){
        setStepOne(true)      
      }else{
        setStepOne(false)
      }
      if(errors.quantity === undefined && errors.initPrice=== undefined && errors.immediatePrice=== undefined && category !==""){
        setStepTwo(true)      
        
      }else{
        setStepTwo(false)
      }
      
      if(errors.endDate == undefined && errors.startDate== undefined ){
        setStepThree(true)      
      }else{
        setStepThree(false)
      }

        return errors;
      };


  const navigate = new useNavigate();
  const styles = {
    error:{
      fontSize:12,
      color:"error.main",
    }
  }
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
  const [type, setType] = React.useState("encheres");
  const [state, setState] = React.useState("utilisé");
  const [containsError , setContainsError] = React.useState(true)
  const [images, setImages] = React.useState([]);

  const [stepOne, setStepOne] = React.useState(false);
  const [stepTwo, setStepTwo] = React.useState(false);
  const [stepThree, setStepThree] = React.useState(false);
const handleState = (event) => {
    setState(event.target.value);
  };
const handleType = (event) => {
    setType(event.target.value);
  };

  const formik = useFormik({
    initialValues: {
      type: "encheres",
      name: "",
      localisation: "",
      codebar: "",
      brand: "",
      description: "",
      quantity: 1,
      initPrice: 1,
      immediatePrice: 2,
      date: Date.now(),
      startDate: Date.now(),
      endDate: Date.now(),
    },
    validate,
  });


  const handleImageDelete = (imageName) => {
    setImages(images.filter((item) => item.get("file").name !== imageName));
  };

  //#endregion

  //#region categories for form
  const [categories, setCategories] = React.useState({});
  const [category, setCategory] = React.useState("")
  const handleCategory = (event) => {
    setCategory(event.target.value);
  };
  //categories GET request
  async function getCategories() {
    try {
      const response = await Api.get("http://127.0.0.1:8000/api/categories");

      setCategories(response["data"]["hydra:member"]);
    } catch (error) {
      console.error(error);
    }
  }

  //this makes getCategory run on render
  React.useEffect(() => {
    getCategories();
  }, []);
  //#endregion

  //to get the state of the user from store
  const user = useSelector((state) => state.user);

  //calling the api to post
  const submitHandler = (event ) => {
    const endDate= new Date(formik.values.endDate)
    const date= new Date(formik.values.date)
    const startDate= new Date(formik.values.startDate)
    event.preventDefault();
    Api.post("/articles", {
      name: formik.values.name,
      state: state,
      fabricationDate: date,
      localisation: formik.values.localisation,
      codebar: formik.values.codebar,
      brand: formik.values.brand,
      description: formik.values.description,
    })
      .then((response) => {
        if (images.length > 0) {
          images.map((image) => {
            image.append("article", response["data"]["id"]);
            Api.post("documents", image, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          });
        }
        Api.post(`/${type}`, {
          quantity: parseInt(formik.values.quantity),
          initPrice: parseFloat(formik.values.initPrice),
          currentPrice: parseFloat(formik.values.initPrice),
          immediatePrice: parseFloat(formik.values.immediatePrice),
          startDate: startDate,
          endDate: endDate,
          category: `/api/categories/${category}`,
          article: `${response["data"]["@id"]}`,
          //change this hardcoded line with user from store
          user: `/api/users/${user.id}`,
        })
          .then((response) => {
            console.log(response["data"]["@id"], "created successfully!");
            if (type === "enchere_inverses") {
              const enchereInverseId = response["data"]["id"];
              Api.post("/surveilles", {
                user: `/api/users/${user.id}`,
                enchereInverse: `${response["data"]["@id"]}`,
              })
                .then((response) => {
                  console.log(response["data"]["@id"], "created successfully!");
                  navigate(`${navRoutes.ENCHEREINVERSE}/${enchereInverseId}`);
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              const enchereId = response["data"]["id"];
              Api.post("/surveilles", {
                user: `/api/users/${user.id}`,
                enchere: `${response["data"]["@id"]}`,
              })
                .then((response) => {
                  console.log(response["data"]["@id"], "created successfully!");
                  navigate(`${navRoutes.ENCHERE}/${enchereId}`);
                })
                .catch((error) => console.log(error));
            }
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  //#endregion
  return (
    <Box sx={pinkish}>
    <Box sx={formContainer}>

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
          <Box component="form" onSubmit={submitHandler} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {activeStep === 0 && (
                <div className="step1">
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {steps[0]}
                  </Typography>
                  <Grid item xs={12}>
                    <FormTextField
                      fullWidth
                      required
                      id="name"
                      label="Nom"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />{formik.errors.name ? (
                      <Typography sx={styles.error}>{formik.errors.name}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item xs={12}>

                    <FormTextField
                      fullWidth
                      id="brand"
                      label="marque"
                      value={formik.values.brand}
                      onChange={formik.handleChange}
                    />{formik.errors.brand ? (
                      <Typography sx={styles.error}>{formik.errors.brand}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item xs={12}>

                    <FormTextField
                      fullWidth
                      required
                      id="localisation"
                      label="localisation"
                      value={formik.values.localisation}
                      onChange={formik.handleChange}
                    />{formik.errors.localisation ? (
                      <Typography sx={styles.error}>{formik.errors.localisation}</Typography>
                    ) : null}
                  </Grid>

                  <Grid item xs={12}>
                    <FormTextField
                      id="codebar"
                      label="code a barre"
                      value={formik.values.codebar}
                      onChange={formik.handleChange}
                    />{formik.errors.codebar ? (
                      <Typography sx={styles.error}>{formik.errors.codebar}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item xs={12}>
                    {/* TODO: date stays as default , fix it */}
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DesktopDatePicker
                        label="date de fabrication"
                        inputFormat="MM/dd/yyyy"
                        value={formik.values.date}
                        name="date"
                        onChange={(value) => {
                          formik.setFieldValue('date', Date.parse(value));
                          }}
                        renderInput={(params) => <FormTextField {...params} />}
                      />{formik.errors.date ? (
                        <Typography sx={styles.error}>{formik.errors.date}</Typography>
                      ) : null}
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl sx={{marginTop:"8px"}} fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        état
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="etat"
                        onChange={handleState}
                        value={state}
                      >
                        <MenuItem value="neuf">neuf</MenuItem>
                        <MenuItem value="utilisé">utilisé</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>{formik.errors.state ? (
                        <Typography sx={styles.error}>{formik.errors.state}</Typography>
                      ) : null}
                  <Grid item xs={12}>

                    <textarea
                      name="description"
                      id="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      className="descriptionField"
                      cols="30"
                      rows="10"
                      placeholder="description"
                    ></textarea>
                  </Grid>{formik.errors.description ? (
                        <Typography sx={styles.error}>{formik.errors.description}</Typography>
                      ) : null}
                  <Grid item xs={12}>
                      
                    <FormControlLabel
                      control={<Checkbox value="validation" />}
                      label="vous guarentissez la validité de ces informations"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <label htmlFor="contained-button-file">
                      <Input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={(event) => {
                          if (images.length < 4) {
                            const data = new FormData();
                            data.append(
                              "file",
                              event.target.files[0],
                              event.target.files[0].name
                            );

                            setImages([...images, data]);
                            console.log(data.get("file").name);
                          } else {
                            alert("max 4 images");
                          }
                        }}
                      />
                      <Button
                        sx={{ ...ButtonStyles, margin: 2, display: "none" }}
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={12}>

                    {images.map((image) => (
                      <MenuItem value={image} key={image.get("file").name}>
                        <Typography>{image.get("file").name}</Typography>
                        <IconButton
                          onClick={() =>
                            handleImageDelete(image.get("file").name)
                          }
                        >
                          <CancelIcon color="warning" />
                        </IconButton>
                      </MenuItem>
                    ))}
                  </Grid>
                  <React.Fragment>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ ...ButtonStyles, mr: 1 }}
                      >
                        Revenir
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />

                      {activeStep === steps.length ? (
                          <></>
                      ) : (
                        <Button sx={ButtonStyles} disabled={!stepOne} onClick={handleNext}>
                          Suivant
                        </Button>
                      )}
                    </Box>
                  </React.Fragment>
                </div>
              )}
              {/* TODO: make an optional step for documents */}
              {activeStep === 1 && (
                <div className="step2">
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {steps[1]}
                  </Typography>
                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                      Type :
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={type}
                      onChange={handleType}
                    >
                      <FormControlLabel
                        value="enchere_inverses"
                        control={<Radio />}
                        label="EnchereInversé"
                      />
                      <FormControlLabel
                        value="encheres"
                        control={<Radio />}
                        label="Enchere"
                      />
                    </RadioGroup>
                  </FormControl>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        categorie
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={handleCategory}
                        label="category"
                        value={category}
                      >
                        {Object.keys(categories).map((key, index) => (
                          <MenuItem value={categories[key].id} key={index}>
                            {categories[key].name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>

                    <FormTextField
                      fullWidth
                      required
                      type="number"
                      id="quantity"
                      label="quantité"
                      value={formik.values.quantity}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.quantity ? (
                        <Typography sx={styles.error}>{formik.errors.quantity}</Typography>
                      ) : null}
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField
                      fullWidth
                      required
                      type="number"
                      id="immediatePrice"
                      label="prix immediat"
                      value={formik.values.immediatePrice}
                      onChange={formik.handleChange}
                    />{formik.errors.immediatePrice ? (
                      <Typography sx={styles.error}>{formik.errors.immediatePrice}</Typography>
                    ) : null}
                  </Grid>

                  <Grid item xs={12}>
                    <FormTextField
                      required
                      fullWidth
                      type="number"
                      id="initPrice"
                      label="prix initial"
                      value={formik.values.initPrice}
                      onChange={formik.handleChange}
                    />{formik.errors.initPrice ? (
                      <Typography sx={styles.error}>{formik.errors.initPrice}</Typography>
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
                        <Button sx={ButtonStyles} disabled={!stepTwo} onClick={handleNext}>
                          next
                        </Button>
                      )}
                    </Box>
                  </React.Fragment>
                </div>
              )}
              {activeStep === 2 && (
                <div className="step3">
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {steps[2]}
                  </Typography>
                  <Grid item xs={12}>

                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DateTimePicker
                        label="date de debut"
                        name="startDate"
                        inputFormat="MM/dd/yyyy"
                        value={formik.values.startDate}
                        onChange={(value) => {
                          formik.setFieldValue('startDate', Date.parse(value));
                          }}
                        renderInput={(params) => <FormTextField {...params} />}
                      />
                    </LocalizationProvider>
                    {formik.errors.startDate ? (
                      <Typography sx={styles.error}>{formik.errors.startDate}</Typography>
                    ) : null}
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DateTimePicker
                        label="date de fin"
                        inputFormat="MM/dd/yyyy"
                        name="endDate"
                        value={formik.values.endDate}
                        onChange={(value) => {
                          formik.setFieldValue('endDate',Date.parse(value));
                          }}
                        renderInput={(params) => <FormTextField {...params} />}
                      />
                    </LocalizationProvider>
                    {formik.errors.endDate ? (
                      <Typography sx={styles.error}>{formik.errors.endDate}</Typography>
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
                        <Button sx={ButtonStyles} disabled={!stepThree} type="submit">
                          soumettre
                        </Button>
                      )}
                    </Box>
                  </React.Fragment>
                </div>
              )}
             
            </Grid>
          </Box>
        </Box>
      </Container>

    </Box>
    </Box>
  );
}

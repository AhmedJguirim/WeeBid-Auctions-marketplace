import DateAdapter from "@mui/lab/AdapterDateFns";
import Api from "../../AxiosInstance";
import { ButtonStyles, formBox } from "../base/customComponents/general";
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

const steps = [
  "enregistrer un article",
  "enregistrer l'offre",
  "fixer les dates",
];

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

        let customErrors = {}
        //fabrication date validation
        if (!date) {
            customErrors.date = "champ obligatoir";
          } else if (date > currentDate) {
            customErrors.date = "la date de fabrication ne peut pas etre superieur a la date actuelle";
          }
          else{
            delete customErrors.date
          }

          //start date validation
          if (!startDate) {
            customErrors.startDate = "champ obligatoir";
          } else if (startDate < currentDate) {
            customErrors.startDate = "la date de debut ne peut pas etre inferieur a la date actuelle";
          }else{
            delete customErrors.startDate
          }

          //end date validation
          if (!endDate) {
            customErrors.endDate = "champ obligatoir";
          } else if (endDate > currentDate) {
            customErrors.endDate = "la date de fin ne peut pas etre inferieur a la date actuelle";
          }else if (endDate > startDate) {
            customErrors.endDate = "la date de debut ne peut pas etre inferieur a la date de debut";
          }else{
            delete customErrors.startDate
          }

          //article state validation
        
          if (!state) {
            customErrors.state = "champ obligatoir";
          } else if (!stateOptions.includes(state)) {
            customErrors.state = "l'état ne peut qu'etre : 'utilisé' ou 'neuf'";
          }else{
            delete customErrors.startDate 
          }


      setCustomValidation(customErrors)
      if(Object.keys(errors).length === 0 && Object.keys(customErrors).length === 0){
          setContainsError(false)

          
      }
        return errors;
      };

  const navigate = new useNavigate();
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
  const [state, setState] = React.useState("");
  const [containsError , setContainsError] = React.useState(true)
  const [images, setImages] = React.useState([]);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [date, setDate] = React.useState(new Date());
  const [customVadlidation, setCustomValidation] = React.useState({})

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
      state: "",
      localisation: "",
      codebar: "",
      brand: "",
      description: "",
      quantity: 1,
      initPrice: 1,
      immediatePrice: 2,
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
    <Box sx={{ width: "60%", display: "blocks", mr: "auto", ml: "auto" }}>
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
                  {formik.errors.name ? <div>{formik.errors.name}</div> : null}
                    <TextField
                      fullWidth
                      required
                      id="name"
                      label="Nom"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                  {formik.errors.brand ? <div>{formik.errors.brand}</div> : null}
                    <TextField
                      fullWidth
                      id="brand"
                      label="marque"
                      value={formik.values.brand}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                  {formik.errors.localisation ? <div>{formik.errors.localisation}</div> : null}
                    <TextField
                      fullWidth
                      required
                      id="localisation"
                      label="localisation"
                      value={formik.values.localisation}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                  {formik.errors.codebar ? <div>{formik.errors.codebar}</div> : null}
                    <TextField
                      id="codebar"
                      label="code a barre"
                      value={formik.values.codebar}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                  {customVadlidation.date ? <div>{customVadlidation.date}</div> : null}
                    {/* TODO: date stays as default , fix it */}
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DesktopDatePicker
                        label="date de fabrication"
                        inputFormat="MM/dd/yyyy"
                        value={date}
                        onChange={setDate}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                  {customVadlidation.state ? <div>{customVadlidation.state}</div> : null}
                    <FormControl fullWidth>
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
                  </Grid>
                  <Grid item xs={12}>
                  {formik.errors.description ? <div>{formik.errors.description}</div> : null}
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
                  </Grid>
                  <Grid item xs={12}>
                      
                    <FormControlLabel
                      control={<Checkbox value="validation" />}
                      label="vous guarentissez la validité de ces informations"
                    />
                  </Grid>
                  {/* TODO: make it upload multiple files at the end by mapping through the dataform object */}
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
                  {formik.errors.quantity ? <div>{formik.errors.quantity}</div> : null}
                    <TextField
                      fullWidth
                      required
                      type="number"
                      id="quantity"
                      label="quantité"
                      value={formik.values.quantity}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                  {formik.errors.immediatePrice ? <div>{formik.errors.immediatePrice}</div> : null}
                    <TextField
                      fullWidth
                      required
                      type="number"
                      id="immediatePrice"
                      label="prix immediat"
                      value={formik.values.immediatePrice}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                  {formik.errors.initPrice ? <div>{formik.errors.initPrice}</div> : null}
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="initPrice"
                      label="prix initial"
                      value={formik.values.initPrice}
                      onChange={formik.handleChange}
                    />
                  </Grid>
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
                </div>
              )}
              {activeStep === 2 && (
                <div className="step3">
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {steps[2]}
                  </Typography>
                  <Grid item xs={12}>
                  {customVadlidation.startDate ? <div>{customVadlidation.startDate}</div> : null}
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DateTimePicker
                        label="date de debut"
                        inputFormat="MM/dd/yyyy"
                        value={startDate}
                        onChange={setStartDate}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                  {customVadlidation.endDate ? <div>{customVadlidation.endDate}</div> : null}
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DateTimePicker
                        label="date de fin"
                        inputFormat="MM/dd/yyyy"
                        value={endDate}
                        onChange={setEndDate}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                </div>
              )}
              <Grid item xs={12}>
                {activeStep === steps.length ? (
                  <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished {activeStep}{" "}
                      {steps.length}
                      </Typography>
                      {Object.keys(customVadlidation).map((key, index) => (
                          <MenuItem key={index}>
                            {customVadlidation[key]}
                          </MenuItem>
                        ))}
                        {Object.keys(formik.errors).map((key, index) => (
                          <MenuItem key={index}>
                            {formik.errors[key]}
                          </MenuItem>
                        ))}
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

                      <Button sx={ButtonStyles} disabled={containsError} type="submit">
                          soumettre
                        </Button>
                    </Box>

                
                  </React.Fragment>
                ) : (
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
                        <Button sx={ButtonStyles} onClick={handleNext}>
                          next
                        </Button>
                      )}
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

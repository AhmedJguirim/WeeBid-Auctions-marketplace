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
} from "@mui/material";
import { useSelector } from "react-redux";
import { apiRoutes, navRoutes } from "../../config/routes";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = [
  "enregistrer un article",
  "enregistrer l'offre",
  "fixer les dates",
];

export default function CreateArticle() {
  //file upload
  // const [selectedFile, setSelectedFile] = React.useState(null);

  // const onFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]);
  // };

  // const onFileUpload = () => {
  //   // Create an object of formData
  //   const formData = new FormData();
  //   let data = selectedFile;
  //   data.lastModifiedDate = 
  //   // Update the formData object
  //   formData.append(
  //     "myFile",
  //     selectedFile,
  //     selectedFile.name
  //   );

  //   // Details of the uploaded file
  //   console.log(selectedFile);

  //   // Request made to the backend api
  //   // Send formData object
  //   Api.post("documents", formData);
  // };
  // const fileData = () => {
  //   if (selectedFile) {
  //     return (
  //       <div>
  //         <h2>File Details:</h2>

  //         <p>File Name: {selectedFile.name}</p>

  //         <p>File Type: {selectedFile.type}</p>

  //         <p>
  //           Last Modified:{" "}
  //           {selectedFile.lastModifiedDate.toDateString()}
  //         </p>
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div>
  //         <br />
  //         <h4>Choose before Pressing the Upload button</h4>
  //       </div>
  //     );
  //   }
  // };

  //#region stepper part
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // if(activeStep === steps.length){
    //     handleSubmit();
    // }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //#endregion
  //#region form part
  //#region form data state

  //specific to article
  const [date, setDate] = React.useState(new Date());
  const [name, setName] = React.useState("");
  const [state, setState] = React.useState("");
  const [localisation, setLocalisation] = React.useState("");
  const [codeBar, setCodeBar] = React.useState("");
  const [marque, setMarque] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState("enchere");
  const [images, setImages] = React.useState(null);

  //specific to enchere/enchereInverse
  const [quantity, setQuantity] = React.useState(0);
  const [initPrice, setInitPrice] = React.useState(0);
  const [immediatePrice, setImmediatePrice] = React.useState(0);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [category, setCategory] = React.useState("");

  //#endregion

  //#region state manipulation mathods
  //specific to article
  const handleState = (event) => {
    setState(event.target.value);
  };
  const handleName = (event) => {
    setName(event.target.value);
  };
  const handleLocalisation = (event) => {
    setLocalisation(event.target.value);
  };
  const handleCodeBar = (event) => {
    setCodeBar(event.target.value);
  };
  const handleMarque = (event) => {
    setMarque(event.target.value);
  };

  //specific to enchere/enchereInverse
  const handleDescription = (event) => {
    setDescription(event.target.value);
  };
  const handleType = (event) => {
    setType(event.target.value);
  };
  const handleQuantity = (event) => {
    setQuantity(event.target.value);
  };
  const handleInitPrice = (event) => {
    setInitPrice(event.target.value);
  };
  const handleImmediatePrice = (event) => {
    setImmediatePrice(event.target.value);
  };
  const handleCategory = (event) => {
    setCategory(event.target.value);
  };

  //#endregion

  //#region categories for form
  const [categories, setCategories] = React.useState({});
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
  const handleSubmit = (event) => {
    event.preventDefault();
    Api.post("/articles", {
      name: name,
      state: state,
      fabricationDate: date,
      localisation: localisation,
      codebar: codeBar,
      brand: marque,
      description: description,
    })
      .then((response) => {
        Api.post(`/${type}`, {
          quantity: parseInt(quantity),
          initPrice: parseFloat(initPrice),
          currentPrice: parseFloat(initPrice),
          immediatePrice: parseFloat(immediatePrice),
          startDate: startDate,
          endDate: endDate,
          category: `/api/categories/${category}`,
          article: `${response["data"]["@id"]}`,
          //change this hardcoded line with user from store
          user: `/api/users/${user.id}`,
        })
          .then((response) => {
            console.log(response);
            if (type === "enchere_inverses") {
              const enchereInverseId = response["data"]["id"];
              Api.post("/surveilles", {
                user: `/api/users/${user.id}`,
                enchereInverse: `${response["data"]["@id"]}`,
              })
                .then((response) => {
                  console.log(response);
                  document.location.href = `${navRoutes.ENCHEREINVERSE}/${enchereInverseId}`;
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
                  console.log(response);
                  document.location.href = `${navRoutes.ENCHERE}/${enchereId}`;
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
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {activeStep === 0 && (
                <div className="step1">
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {steps[0]}
                  </Typography>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      id="name"
                      label="Nom"
                      value={name}
                      onChange={handleName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      id="marque"
                      label="marque"
                      value={marque}
                      onChange={handleMarque}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      id="localisation"
                      label="localisation"
                      value={localisation}
                      onChange={handleLocalisation}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="codeBar"
                      label="code a barre"
                      value={codeBar}
                      onChange={handleCodeBar}
                      placeholder="hello bro"
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        état
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="etat"
                        onChange={handleState}
                        value=""
                      >
                        <MenuItem value="neuf">neuf</MenuItem>
                        <MenuItem value="utilisé">utilisé</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <textarea
                      name="description"
                      id="description"
                      value={description}
                      onChange={handleDescription}
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
                          const data = new FormData();
                          data.append(
                            "file",
                            event.target.files[0],
                            event.target.files[0].name
                          );
                          console.log(event.target.files[0])
                          Api.post("documents", data, {
                            headers: {
                              "Content-Type": "multipart/form-data",
                            },
                          });
                        }}
                      />
                      <Button
                        sx={{ ...ButtonStyles, margin: 2 }}
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
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
                    <TextField
                      fullWidth
                      required
                      type="number"
                      id="quantity"
                      label="quantité"
                      value={quantity}
                      onChange={handleQuantity}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      id="immediatePrice"
                      label="prix immediat"
                      value={immediatePrice}
                      onChange={handleImmediatePrice}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="initPrice"
                      label="prix initial"
                      value={initPrice}
                      onChange={handleInitPrice}
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
                        value=""
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

                      {activeStep === steps.length - 1 ? (
                        <Button sx={ButtonStyles} type="submit">
                          soumettre
                        </Button>
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

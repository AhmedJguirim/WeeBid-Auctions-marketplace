import DateAdapter from "@mui/lab/AdapterDateFns";
import { ButtonStyles, formBox } from "../base/customComponents/general";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import CreerEnchere from "./CreerEnchere";

export default function CreerArticle() {
  //#region form data state
  const [date, setDate] = React.useState(new Date());
  const [name, setName] = React.useState("");
  const [state, setState] = React.useState("");
  const [localisation, setLocalisation] = React.useState("");
  const [codeBar, setCodeBar] = React.useState("");
  const [marque, setMarque] = React.useState("");
  const [description, setDescription] = React.useState("");
  //#endregion

  //#region state manipulation mathods
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
  const handleDescription = (event) => {
    setDescription(event.target.value);
  };
  //#endregion
  const handleSubmit = (event) => {
    event.preventDefault();
    const axios = require("axios");
    console.log(JSON.stringify({
      name: name,
      state: state,
      fabricationDate: date,
      localisation: localisation,
      codebar: codeBar,
      brand: marque,
      description: description,
    }))
    // axios
    //   .post("http://127.0.0.1:8000/api/articles", {
    //     name: name,
    //     state: state,
    //     fabricationDate: date,
    //     localisation: localisation,
    //     codebar: codeBar,
    //     brand: marque,
    //     description: description,
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  const myArticle = {
    name: name,
    state: state,
    fabricationDate: date,
    localisation: localisation,
    codebar: codeBar,
    brand: marque,
    description: description,
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={formBox}
      >
        <Typography variant="h2">enregistrer un article</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
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
                <InputLabel id="demo-simple-select-label">état</InputLabel>
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
            {/* handle saving documents here */}
            <Grid item xs={12}>
            <label htmlFor="contained-button-file">
              <Input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
              />
              <Button sx={{...ButtonStyles, margin: 2}} component="span">
                Upload
              </Button>
            </label>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            sx={ButtonStyles}
          >
            soumettre
          </Button>
        </Box>
        <CreerEnchere article = {myArticle}/>
      </Box>
    </Container>
  );
}

import DateAdapter from "@mui/lab/AdapterDateFns";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ButtonStyles, formBox } from "../base/customComponents/general";

const CreerEnchereInverse = () => {
  //#region form data state
  
  const [quantity, setQuantity] = React.useState("");
  const [initPrice, setInitPrice] = React.useState("");
  const [immediatePrice, setImmediatePrice] = React.useState("");
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [category, setCategory] = React.useState("");
  //#endregion

  //#region state manipulation mathods
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
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const enchereData = {
        "quantity": quantity,
        "initPrice": initPrice,
        "immediatePrice": immediatePrice,
        "startDate": startDate,
        "endDate": endDate,
        "category": category
    }
    console.log(enchereData)

  };
  //change this to categories from api!
  const categories = {
      1: {id: 1 , name:"informatique"},
      2: {id: 2 , name:"informatique"},
      3: {id: 3 , name:"informatique"},
      4: {id: 4 , name:"informatique"},
      5: {id: 5 , name:"informatique"},
  }

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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
        <Typography variant="h2">créer une enchere inversé</Typography>
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
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DesktopDatePicker
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
                <DesktopDatePicker
                  label="date de fin"
                  inputFormat="MM/dd/yyyy"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">categorie</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={handleCategory}
                  label="category"
                  value=""
                >

                {Object.keys(categories).map((key, index) => (
                    <MenuItem value={categories[key].id} key={index}>{categories[key].name}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{...ButtonStyles ,mt: 3, mb: 2 }}
              >
                soumettre
              </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreerEnchereInverse;

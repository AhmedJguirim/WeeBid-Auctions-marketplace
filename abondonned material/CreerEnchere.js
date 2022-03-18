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
import Api from '../../AxiosInstance';



const CreerEnchere = ({article, type}) => {
  //#region form data state
  
  const [quantity, setQuantity] = React.useState(0);
  const [initPrice, setInitPrice] = React.useState(0);
  const [immediatePrice, setImmediatePrice] = React.useState(0);
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
  const [categories, setCategories] = React.useState({});
   //categories GET request
   async function getCategories() {
    try {
      const response = await Api.get('http://127.0.0.1:8000/api/categories');
      
      setCategories(response["data"]["hydra:member"])
      
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    Api.post('/articles', article
    ).then(response=>{

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
        user: `/api/users/28`
      })
    .then(response=>console.log(response["data"]["@id"], "created successfully!"))
    .catch(error=>console.log(error))}

      )
    .catch(error=>console.log(error))}
  
  React.useEffect(()=>{
    getCategories()
  },[])

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
        <Typography variant="h2">créer une enchere</Typography>
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
                sx={{...ButtonStyles ,mt: 3, mb: 2}}
              >
                soumettre
              </Button>
        </Box>
      </Box>
    </Container>
  );
                }

export default CreerEnchere;

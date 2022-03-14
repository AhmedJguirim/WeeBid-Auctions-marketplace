import DateAdapter from "@mui/lab/AdapterDateFns";
import Api from '../../AxiosInstance'
import { ButtonStyles, formBox } from "../base/customComponents/general";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import * as React from "react";

import {FormControl,FormLabel,Input,InputLabel,MenuItem,Radio,RadioGroup,Select,
  Container,Typography,Box,Grid,Checkbox,FormControlLabel,TextField,CssBaseline,
  Button
} from "@mui/material";
import { useSelector } from "react-redux";
import { apiRoutes, navRoutes } from "../../config/routes";

export default function CreerArticle() {
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
      const response = await Api.get('http://127.0.0.1:8000/api/categories');
      
      setCategories(response["data"]["hydra:member"])
      
    } catch (error) {
      console.error(error);
    }
  }
  //this makes getCategory run on render
  React.useEffect(()=>{
    getCategories()
  },[])
  //#endregion

  //to get the state of the user from store
  const user = useSelector(state=>state.user)


  const handleSubmit = (event) => {
    event.preventDefault();
    Api.post('/articles', {
      name: name,
      state: state,
      fabricationDate: date,
      localisation: localisation,
      codebar: codeBar,
      brand: marque,
      description: description,
    }
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
        user: `/api/users/${user.id}`
      }
      
      )
    .then(response=>{
      console.log(response)
      if(type === "enchere_inverses"){
        const enchereInverseId= response["data"]["id"]
        Api.post("/surveilles", {
          user: `/api/users/${user.id}`,
          enchereInverse:  `${response["data"]["@id"]}`
        }).then(
          response=>{console.log(response)
          // document.location.href=`${navRoutes.ENCHEREINVERSE}/${enchereInverseId}`
        }
        
        ).catch(error=>{
          console.log(error)
          
        })
      }
      else{
        const enchereId= response["data"]["id"]
        Api.post("/surveilles", {
          user: `/api/users/${user.id}`,
          enchere:  `${response["data"]["@id"]}`
        }).then(response=>{
          console.log(response)
          // document.location.href=`${navRoutes.ENCHERE}/${enchereId}`
        }).catch(error=>console.log(error))
      }
      
    })
    .catch(error=>console.log(error))}

      )
    .catch(error=>console.log(error))}
  

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={formBox}>
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
                <Button sx={{ ...ButtonStyles, margin: 2 }} component="span">
                  Upload
                </Button>
              </label>
            </Grid>
          
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Type</FormLabel>
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
            <FormControlLabel value="encheres" control={<Radio />} label="Enchere" />
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
          <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{...ButtonStyles ,mt: 3, mb: 2}}
              >
                soumettre
              </Button>
              </Grid>
        </Box>
      </Box>
    </Container>
  );
}

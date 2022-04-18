import {
    Avatar,
    Grid,
    Typography,
    TextField,
    DialogTitle,
    DialogContent,
    Dialog,
    Button,
  } from "@mui/material";
  import React from "react";
  import { darkContainer } from "./base/customComponents/general";
  import { Box } from "@mui/system";
  import { ButtonStyles } from "./base/customComponents/general";
  import { apiRoutes } from "../config/routes";
import axios from "axios";
import { useParams } from "react-router-dom";
import Api from '../AxiosInstance';
import { useSelector } from "react-redux";
import Socket from './base/customComponents/Socket'

  
  const ConsultUser = () => {
    const myUser = useSelector((state) => state.user);
    let { id } = useParams();
    //#region form data state
    const [quantity, setQuantity] = React.useState(1);
    const [description, setDescription] = React.useState("");
    //#endregion
  
    //#region dialog manipulation
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    //#endregion
    //#region state manipulation mathods

    const handleQuantity = (event) => {
      setQuantity(event.target.value);
    };
    const handleDescription = (event) => {
      setDescription(event.target.value);
    };
    //#endregion
  
    //get user and set it to state
    const [user, setUser] = React.useState({});
    async function getUser() {
      try {
        const response = await axios.get(`${apiRoutes.API}/users/${id}`);
        const data = response["data"];
        console.log(data);
        setUser({
          name: data.name,
          username: data.displayName,
          email: data.email,
          password: "******",
          telephone: data.telephone,
          birthDate: data.birthDate.slice(0, 10),
        });
      } catch (error) {
        console.error(error);
      }
    }
    //TODO add custom passowrd put
    const handleSubmit = (event)=>{
      event.preventDefault();
      Api.post(`${apiRoutes.API}/demande_devis`,{
        
          descriptionArticle: description,
          quantity: parseInt(quantity),
          transmitter: `/api/users/${myUser.id}`,
          transmittedTo: `/api/users/${id}`
        
      }).then(res=>{console.log(`demande ${res["data"]["@id"]} transmitted`)
    handleClose()
    console.log(res["data"])
  Socket.emit("DEMANDE", res["data"], id)
  }
    ).catch(err=>console.log(err))
      
    }
  
    React.useEffect(() => {
        getUser();
      }, [id]);
    return (
      <Grid container sx={darkContainer}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">demander de {user.displayName} </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                required
                type="number"
                id="quantity"
                label="quantity"
                value={quantity}
                onChange={handleQuantity}
              />
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
              <Button type="submit" sx={ButtonStyles}>submit</Button>
              <Button
              sx={ButtonStyles}
              onClick={() => {
                handleClose();
              }}
            >
              Disagree
            </Button>
            </Box>
          </DialogContent>
        </Dialog>
        {/* title */}
        <Grid container>
          <Grid item xs={1}>
            <Avatar>AH</Avatar>
          </Grid>
          <Grid item xs={3.5} sx={{ textAlign: "left" }}>
            <Typography variant="h2">{user.displayName}</Typography>{" "}
          </Grid>
          <Grid item xs={3.5} sx={{ textAlign: "right" }}>
            <Button onClick={handleClickOpen}>demande de devis</Button>
          </Grid>
        </Grid>
        <Grid item xs={9} sx={{ mt: 5 }}>
          {Object.keys(user).map((key, index) => (
            <Grid container key={index}>
              <Grid item xs={6}>
                {" "}
                <Typography variant="h4">{key}:</Typography>
              </Grid>
              <Grid item xs={5}>
                {" "}
                <Typography variant="h4">{user[key]}</Typography>
              </Grid>
            
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  };
  
  export default ConsultUser;
  
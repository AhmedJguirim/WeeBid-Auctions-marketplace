import {
    Avatar,
    Grid,
    Typography,
    TextField,
    DialogTitle,
    DialogContent,
    Dialog,
    Button,
    Card,
    CardContent,
    ListItem
  } from "@mui/material";
  import React from "react";
  import { darkContainer, pinkish } from "./base/customComponents/general";
  import { Box } from "@mui/system";
  import { ButtonStyles } from "./base/customComponents/general";
  import { apiRoutes, navRoutes } from "../config/routes";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Api from '../AxiosInstance';
import { useSelector } from "react-redux";
import Socket from './base/customComponents/Socket'
import ProductsListing from "./generalComponents/ProductsListing";
import { CategoryLink } from "./base/customComponents/TopNavLink";

  
  const ConsultUser = () => {
    const myUser = useSelector((state) => state.user);
    let { id } = useParams();
    //#region form data state
    const [quantity, setQuantity] = React.useState(1);
    const [description, setDescription] = React.useState("");
    const [avatar, setAvatar] = React.useState("");
    
    //#endregion
    const [encheresCount, setEncheresCount] = React.useState(0);
    const [encheresInverseesCount, setEncheresInverseesCount] = React.useState(0);
    const [encheresInverses, setEnchereInverses] = React.useState([]);
    const [encheres, setEncheres] = React.useState([]);
    var today = new Date();
  
    var date =
      today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    function getEnchereInverses() {
      axios
        .get(`${apiRoutes.API}/enchere_inverses/getEight`, {
          params: {
            page: "1",
            "endDate[after]": date,
            user: `/api/users/${id}`
          },
        })
        .then(function (response) {
          setEnchereInverses(response["data"]["hydra:member"]);
          console.log(response["data"]["hydra:member"]);
        })
        .catch((error) => console.log(error));
    }
    function getEncheres() {
      axios
        .get(`${apiRoutes.API}/encheres/getEight`, {
          params: {
            page: "1",
            "endDate[after]": date,
            user: `/api/users/${id}`
          },
        })
        .then(function (response) {
          setEncheres(response["data"]["hydra:member"]);
          console.log(response["data"]["hydra:member"])
        })
        .catch((error) => console.log(error));
    }
    //#endregion
    const navigate = useNavigate();
    const getCounts = ()=>{
      axios
      .get(`${apiRoutes.API}/encheres/pages`, {
        params: {
          user: `/api/users/${id}`
        },
      })
      .then((res) => {
        setEncheresCount(res["data"]["hydra:member"].length);
    }).catch(err=>console.log(err))
    axios
      .get(`${apiRoutes.API}/enchere_inverses/pages`, {
        params: {
          user: `/api/users/${id}`
        },
      })
      .then((res) => {
        setEncheresInverseesCount(res["data"]["hydra:member"].length);
    }).catch(err=>console.log(err))}
  
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
          nom: data.name,
          ["nom d'utilisateur"]: data.displayName,
          email: data.email,
          ["téléphone"]: data.telephone,
          ["date de naissance"]: data.birthDate.slice(0, 10),
        });
        let path = "http://127.0.0.1:8000/user/";
        const myImg = path.concat(data.image);
        setAvatar(myImg)
        console.log(`http://127.0.0.1:8000/${data.image}`)
      }catch(err){console.log(err)}
    }
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
        getCounts();
        getEnchereInverses();
        getEncheres();
      }, [id]);
    return (
<Grid container sx={{...pinkish}}>
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
      <Grid container  margin={"2%"}>
      {/* <Grid xs={12}><Typography variant="h2">buttons for functionalities and things TODO //////////////////////////////////////</Typography>{" "}<br /><br /></Grid> */}
        <Grid item xs={12} marginBottom={2}>
          <Grid container>
  
            <Grid item>
              <Grid item xs={12}><Button sx={ButtonStyles} onClick={handleClickOpen}>demande de devis</Button><br /><br /></Grid>

            </Grid>
            <Grid item>
              <Button onClick={()=>navigate(`${navRoutes.ENCHERES}${navRoutes.PERUSER}/${id}`)} sx={ButtonStyles}>enchères</Button>
            </Grid>   
            <Grid item>
              <Button onClick={()=>navigate(`${navRoutes.ENCHERESINVERSES}${navRoutes.PERUSER}/${id}`)} sx={ButtonStyles}>enchères inversées</Button>
            </Grid>   
            </Grid>
        </Grid>
        <Grid item xs={3} sx={{ textAlign: "left"}}>
        <Card >
              <CardContent>
                <Box >
              <Avatar sx={{ width: "100%", height: "100%" }} alt="avatar" src={avatar}/>
              </Box>
               <Box sx={{ textAlign: "center"}}><Typography variant="h5">{user["nom d'utilisateur"]}</Typography>{" "}</Box>
                
              </CardContent></Card>
        </Grid>
        <Grid item xs={1}>
          
        </Grid>
      
      <Grid item xs={7} sx={{backgroundColor:"primary.main", padding:"2%"}}>
        {Object.keys(user).map((key, index) => (
          <ListItem key={index} divider>
          <Grid container >
            <Grid item xs={6}>
              {" "}
              <Typography variant="h5">{key}:</Typography>
            </Grid>
            <Grid item xs={5}>
              {" "}
              <Typography variant="h6">{user[key]}</Typography>
            </Grid>

          </Grid>
          </ListItem>

        ))}
        <Grid container sx={{textAlign: "center"}}>
          <Grid item xs={6}>
              <Typography variant="h1">{encheresCount}</Typography>
              <Typography variant="h4">enchères crées</Typography>
          </Grid>
          <Grid item xs={6}>
              <Typography variant="h1">{encheresInverseesCount}</Typography>
              <Typography variant="h4">enchères inversées crées</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    <Box sx={{marginTop: "5%", ml:"2%",width:"90%",ml:"auto", mr:"auto"}}>

        <Grid container >
          <Grid item xs={12}>
          <Grid container>
            <Grid item xs={7}>
            <Typography variant="h4">
              les enchères de {user["nom d'utilisateur"]}
            </Typography>
            </Grid>
            <Grid item xs={3}>
            </Grid>
            <CategoryLink to={`${navRoutes.ENCHERES}${navRoutes.PERUSER}/${myUser.id}`} >
              voir tous
            </CategoryLink>
            </Grid>

              <ProductsListing
              ventes={encheres}
              type={navRoutes.ENCHERE}
              elemsPerLine={5}
            />
          </Grid>

          <Grid item xs={12} sx={{mt:"4%"}}>
          <Grid container>
            <Grid item xs={7}>
            <Typography variant="h4">
              les enchères inversées de {user["nom d'utilisateur"]}
            </Typography>
            </Grid>
            <Grid item xs={3}>
            </Grid>
            <CategoryLink to={`${navRoutes.ENCHERESINVERSES}${navRoutes.PERUSER}/${myUser.id}`} >
              voir tous
            </CategoryLink>
            </Grid>

              <ProductsListing
              ventes={encheresInverses}
              type={navRoutes.ENCHEREINVERSE}
              elemsPerLine={5}
            />
          </Grid>
        </Grid>
      </Box>
    </Grid>



      // <Grid container sx={pinkish}>
      //   
      //   {/* title */}
      //   <Grid container>
      //   <Grid xs={12}><Button sx={ButtonStyles} onClick={handleClickOpen}>demande de devis</Button><br /><br /></Grid>
      //   <Grid item xs={3} sx={{ textAlign: "left"}}>
      //   <Card >
      //         <CardContent>
      //           <Box >
      //         <Avatar sx={{ width: "100%", height: "100%" }} alt="avatar" src={avatar}/>
      //         </Box>
      //          <Box sx={{ textAlign: "center"}}><Typography variant="h2">{user.displayName}</Typography>{" "}</Box>
                
      //         </CardContent></Card>
      //   </Grid>
      //   <Grid item xs={1}>
          
      //     </Grid>
        
      //   <Grid item xs={7} sx={{ mt: 5 }}>
      //     {Object.keys(user).map((key, index) => (
      //       <Grid container key={index}>
      //         <Grid item xs={6}>
      //           {" "}
      //           <Typography variant="h4">{key}:</Typography>
      //         </Grid>
      //         <Grid item xs={5}>
      //           {" "}
      //           <Typography variant="h4">{user[key]}</Typography>
      //         </Grid>
            
      //       </Grid>
      //     ))}
      //   </Grid>
      //   </Grid>
      // </Grid>
    );
  };
  
  export default ConsultUser;
  
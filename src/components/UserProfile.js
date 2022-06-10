import {
  Avatar,
  IconButton,
  Grid,
  Typography,
  TextField,
  DialogTitle,
  DialogContent,
  Dialog,
  Button,
  Card,
  CardContent,
  Divider,
  ListItem,
  Badge,
} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { lightContainer } from "./base/customComponents/general";
import API from "../AxiosInstance";
import { Box } from "@mui/system";
import { ButtonStyles } from "./base/customComponents/general";
import { apiRoutes, navRoutes } from "../config/routes";
import { useSelector } from "react-redux";
import { pinkish } from "./base/customComponents/general";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductsListing from "./generalComponents/ProductsListing";
import { CategoryLink } from "./base/customComponents/TopNavLink";

const UserProfile = () => {
  const myUser = useSelector((state) => state.user);
  //#region form data state
  const [avatar, setAvatar] = React.useState("");
  const [isEditing, setIsEditing] = React.useState("");
  const [modification, setModification] = React.useState("");
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
          fermeture: null,
          page: "1",
          "endDate[after]": date,
          user: `/api/users/${myUser.id}`,
        },
      })
      .then(function (response) {
        setEnchereInverses(response["data"]["hydra:member"].slice(0,5));
        console.log(response["data"]["hydra:member"]);
      })
      .catch((error) => console.log(error));
  }
  function getEncheres() {
    axios
      .get(`${apiRoutes.API}/encheres/getEight`, {
        params: {
          fermeture: null,
          page: "1",
          "endDate[after]": date,
          user: `/api/users/${myUser.id}`,
        },
      })
      .then(function (response) {
        setEncheres(response["data"]["hydra:member"].slice(0,5));
        console.log(response["data"]["hydra:member"]);
      })
      .catch((error) => console.log(error));
  }
  //#endregion
  const navigate = useNavigate();
  const getCounts = () => {
    axios
      .get(`${apiRoutes.API}/encheres/pages`, {
        params: {
          user: `/api/users/${myUser.id}`,
        },
      })
      .then((res) => {
        setEncheresCount(res["data"]["hydra:member"].length);
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiRoutes.API}/enchere_inverses/pages`, {
        params: {
          user: `/api/users/${myUser.id}`,
        },
      })
      .then((res) => {
        setEncheresInverseesCount(res["data"]["hydra:member"].length);
      })
      .catch((err) => console.log(err));
  };

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

  const handleModification = (event) => {
    setModification(event.target.value);
  };
  //#endregion

  //get user and set it to state
  const [user, setUser] = React.useState({});
  async function getUser() {
    try {
      const response = await API.get(`userdata`);
      const data = response["data"];
      console.log(data);
      setUser({
        nom: data.name,
        ["nom d'utilisateur"]: data.displayName,
        email: data.email,
        ["mot de passe"]: "******",
        ["téléphone"]: data.telephone,
        ["date de naissance"]: data.birthDate.slice(0, 10),
      });
      let myImg = "";
        if(data.avatar){
          let path = "http://127.0.0.1:8000/media/";
          myImg = path.concat(data.avatar.filePath);
        }else{
          let path = "http://127.0.0.1:8000/user/";
          myImg = path.concat(data.image);
        }
        
      setAvatar(myImg);
      console.log(`http://127.0.0.1:8000/${data.image}`);
    } catch (error) {
      console.error(error);
    }
  }

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("under construction");
    let data = {};
    data[isEditing] = modification;

    console.log(data);
    switch (isEditing) {
      case "password":
        API.put(`${apiRoutes.API}/putPassword/${myUser.id}`, data)
        .then((res) => getUser())
        .catch((err) => console.log(err));
        break;
      case "nom":
        API.put(`${apiRoutes.API}/users/${myUser.id}`,{
          name: modification
        })
        .then((res) => getUser())
        .catch((err) => console.log(err));
        break;
      case "nom d'utilisateur":
        API.put(`${apiRoutes.API}/users/${myUser.id}`,{
         displayName: modification
        })
        .then((res) => getUser())
        .catch((err) => console.log(err));
        break;
      case "email":
        API.put(`${apiRoutes.API}/users/${myUser.id}`,{
          email: modification
        })
        .then((res) => getUser())
        .catch((err) => console.log(err));
        break;
      case "téléphone":
        API.put(`${apiRoutes.API}/users/${myUser.id}`,{
          telephone: modification
        })
        .then((res) => getUser())
        .catch((err) => console.log(err));
        break;
      default:
        break;
    }
    if (isEditing === "password") {
      API.put(`${apiRoutes.API}/putPassword/${myUser.id}`, data)
        .then((res) => getUser())
        .catch((err) => console.log(err));
    } else {
      API.put(`${apiRoutes.API}/users/${myUser.id}`, data)
        .then((res) => getUser())
        .catch((err) => console.log(err));
    }

    handleClose();
  };
  React.useEffect(() => {
    getUser();
    getCounts();
    getEnchereInverses();
    getEncheres();
  }, []);

  return (
    <Grid container sx={{ ...pinkish }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">changer {isEditing} </DialogTitle>
        <DialogContent>
          <Box component="form">
          {isEditing==="email" && <Typography fontSize={12}>vous devez se reconnecter après changer votre adresse email</Typography>}
            <TextField
              fullWidth
              required
              id="modification"
              label="modification"
              value={modification}
              onChange={handleModification}
            />    
            <Button onClick={submitHandler} sx={ButtonStyles}>
              Sousmettre
            </Button>
            <Button
              sx={ButtonStyles}
              onClick={() => {
                handleClose();
              }}
            >
              Fermer
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      {/* title */}
      <Grid container margin={"2%"}>
        {/* <Grid xs={12}><Typography variant="h2">buttons for functionalities and things TODO //////////////////////////////////////</Typography>{" "}<br /><br /></Grid> */}
        <Grid item xs={12} marginBottom={2}>
          <Grid container>
            <Grid item>
              <Button
                onClick={() => navigate(navRoutes.WATCHLIST)}
                sx={ButtonStyles}
              >
                liste de surveilles
              </Button>
            </Grid>

            <Grid item>
              <Button
                onClick={() =>
                  navigate(
                    `${navRoutes.ENCHERES}${navRoutes.PERUSER}/${myUser.id}`
                  )
                }
                sx={ButtonStyles}
              >
                vos enchères
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() =>
                  navigate(
                    `${navRoutes.ENCHERESINVERSES}${navRoutes.PERUSER}/${myUser.id}`
                  )
                }
                sx={ButtonStyles}
              >
                vos enchères inversées
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => navigate(navRoutes.DEMANDESLISTING)}
                sx={ButtonStyles}
              >
                demandes de devis recus
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => navigate(navRoutes.PROPOSITIONSLISTING)}
                sx={ButtonStyles}
              >
                propositions recus
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} sx={{ textAlign: "left" }}>
          <Card>
            <CardContent>
              <Box>
                
                {/* <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={<IconButton><EditIcon /></IconButton> }
                > */}
                  <Avatar
                sx={{ width: "100%", height: "100%" }}
                alt="avatar"
                src={avatar}
              />
              {/* </Badge> */}
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5">
                  {user["nom d'utilisateur"]}
                </Typography>{" "}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={1}></Grid>

        <Grid
          item
          xs={7}
          sx={{ backgroundColor: "primary.main", padding: "2%" }}
        >
          {Object.keys(user).map((key, index) => (
            <ListItem key={index} divider>
              <Grid container>
                <Grid item xs={6}>
                  {" "}
                  <Typography variant="h5">{key}:</Typography>
                </Grid>
                <Grid item xs={5}>
                  {" "}
                  <Typography variant="h6">
                    {user[key]}
                  </Typography>
                </Grid>
                <Grid item>
                  {key !== "date de naissance" && <IconButton
                    onClick={() => {
                      handleClickOpen();
                      setIsEditing(key);
                    }}
                    id={key}
                  >
                    <EditIcon color="secondary" size="large" />{" "}
                  </IconButton>}
                  
                </Grid>
              </Grid>
            </ListItem>
          ))}
          <Grid container sx={{ textAlign: "center" }}>
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
      <Box
        sx={{ marginTop: "5%", ml: "2%", width: "90%", ml: "auto", mr: "auto" }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={7}>
                <Typography variant="h4">vos enchères</Typography>
              </Grid>
              <Grid item xs={3}></Grid>
              <CategoryLink
                to={`${navRoutes.ENCHERES}${navRoutes.PERUSER}/${myUser.id}`}
              >
                voir tous
              </CategoryLink>
            </Grid>

            <ProductsListing
              ventes={encheres}
              type={navRoutes.ENCHERE}
              elemsPerLine={5}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: "4%" }}>
            <Grid container>
              <Grid item xs={7}>
                <Typography variant="h4">vos enchères inversées</Typography>
              </Grid>
              <Grid item xs={3}></Grid>
              <CategoryLink
                to={`${navRoutes.ENCHERESINVERSES}${navRoutes.PERUSER}/${myUser.id}`}
              >
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
  );
};

export default UserProfile;

import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import logoPath from "../../../media/images/logo.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TopNavLink from "../customComponents/TopNavLink";
import { TopNavGrid, TopAppBar } from "../customComponents/general";
import {
  Box,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import MyDrawer from "./Drawer";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { navRoutes } from "../../../config/routes";
import SearchBar from "./SearchBar";
import Socket from "../customComponents/Socket";
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import axios from "axios";



const TopNavBar = () => {

  // Socket.on("connect",()=>{
  //   console.log(`you're connected to socket.io`)})
  //#region type of search (default "enchere" to avoid unnecessary headache))
  const [type, setType] = React.useState("/encheres");
  const [notifications, setNotifications] = React.useState([]);
  const typesOptions  = {
    0 : {
      value:"/encheres",
      text: "encheres"
    },
    1 : {
      value:"/enchere_inverses",
      text: "encheres inversés"
    },
    //TODO: ajouter ventes et utilisateurs 
  }
  const handleType = (event) => {
    setType(event.target.value);
  };  

  //#endregion
  const styles = {
    topBox: {
      height: 70,
    },
    secondGrid: {
      justifyContent: "flex-end",
      paddingRight: 2,
    },
  };
  const user = useSelector((state) => state.user);
  
  let variableLinks = {};
  if (user.id === undefined) {
    variableLinks = {
      0: {
        text: "connection",
        path: navRoutes.LOGIN,
      },
      1: {
        text: "inscription",
        path: navRoutes.REGISTER,
      }
    };

  }
  else {
    
    variableLinks = {
      0: {
        text: "se deconnecter",
        path: navRoutes.LOGOUT,
      },
      1: {
        text: "profile",
        path: navRoutes.USERPROFILE,
      },
    };
  }
  const constLinks = {
    0: {
      text: "categories",
      path: navRoutes.CATEGORIES,
    },
    1: {
      text: "produits",
      path: navRoutes.VENTES,
    },
  };

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  
  //#region search bar
  

  //#endregion

  React.useEffect(()=>{
    if (user.id !== undefined) {
    axios.get("http://127.0.0.1:8000/api/notifications",{
      params:{
        page:1,
        user: `/api/users/${user.id}`,
        "order[date]": "desc"
      }
    }).then(res=>{
      console.log(res["data"]["hydra:member"]);
      setNotifications(res["data"]["hydra:member"])
    })}
  },[user])
  return (
    <Box sx={styles.topBox}>
      <TopAppBar position="static" sx={{backgroundColor:"primary.main"}} >
        <Grid container >
          <TopNavGrid md={8} sm={11} item>
            <IconButton
              size="large"
              edge="start"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Link to="/">
              <img src={logoPath} alt="logo" className="logo" />
            </Link>
            {Object.keys(constLinks).map((key, index) => (
              <TopNavLink
                key={index}
                text={constLinks[key].text}
                path={constLinks[key].path}
              ></TopNavLink>
            ))}
            <Box sx={{ minWidth: 120 }}>
              <FormControl  fullWidth>
                <InputLabel sx={{mt:0 ,color: "secondary.main"}}>type</InputLabel>
                <Select sx={{mt:0, color:"secondary.main"}} value={type} onChange={handleType}>
                {Object.keys(typesOptions).map((key, index) => (
                    <MenuItem value={typesOptions[key].value} key={index}>{typesOptions[key].text}</MenuItem>))}
                </Select>
              </FormControl>
            </Box>
              {/* my searchBar */}
            <Box>
            {/* <TextField
              id="outlined-basic"
              variant="outlined"
              fullWidth
              label="Search"
            /> */}
            <SearchBar type={type} />

            </Box>
          </TopNavGrid>
          <TopNavGrid md={4} sm={1} item sx={styles.secondGrid}>
            {Object.keys(variableLinks).map((key, index) => (
              <TopNavLink
                key={index}
                text={variableLinks[key].text}
                path={variableLinks[key].path}
              ></TopNavLink>
            ))}

            <IconButton
              size="large"
              edge="end"
              aria-label="open drawer"
              sx={{ ml: "0.5%" }}
            >
              <NotificationsNoneTwoToneIcon />
            </IconButton>
          </TopNavGrid>
        </Grid>
      </TopAppBar>
      <MyDrawer open={open} setOpen={setOpen} />
    </Box>
  );
};

export default TopNavBar;

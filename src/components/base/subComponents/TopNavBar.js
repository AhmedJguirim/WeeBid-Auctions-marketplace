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
import {io} from "socket.io-client"

let socket = io("http://127.0.0.1:8081");
socket.on("connect",()=>{
console.log(`you're connected to socket.io`)})

const TopNavBar = () => {


  //#region type of search (default "enchere" to avoid unnecessary headache))
  const [type, setType] = React.useState("/encheres");
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
  const watchList = useSelector((state) => state.watchList)
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
      },
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
  



  React.useEffect(()=>{    
    
      if (watchList[0] !== undefined){
        socket.emit("join-rooms", watchList)
      }}
    
  
  ,[watchList])
  
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

  return (
    <Box sx={styles.topBox}>
      <TopAppBar position="static" >
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
                <InputLabel sx={{mt:0}}>type</InputLabel>
                <Select sx={{mt:0}} value={type} onChange={handleType}>
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
              <ShoppingCartIcon />
            </IconButton>
          </TopNavGrid>
        </Grid>
      </TopAppBar>
      <MyDrawer open={open} setOpen={setOpen} />
    </Box>
  );
};

export default TopNavBar;

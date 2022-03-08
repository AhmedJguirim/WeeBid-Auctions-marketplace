import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import logoPath from "../../../media/images/logo.png";
import Autowhatever from "react-autowhatever/dist/Autowhatever";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TopNavLink from "../customComponents/TopNavLink";
import {TopNavGrid, TopAppBar} from "../customComponents/general";
import {
  Box,
  Select,
  MenuItem,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Grid,
  
} from "@mui/material";
import MyDrawer from "./Drawer";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { navRoutes } from "../../../config/routes";

const TopNavBar = () => {
  const styles = {
    topBox:{
      height: 70,

    },
    secondGrid:{
      justifyContent: "flex-end",
      paddingRight: 2,
      
    },
  }
  const user = useSelector(state=>state.user)
  let variableLinks = {}
  if(user.id == undefined){
    variableLinks = {
      0: {
        text: "connection",
        path: navRoutes.LOGIN
      },
      1: {
        text: "inscription",
        path: navRoutes.REGISTER
      }
    }
  }
  else{
    variableLinks = {
      0: {
        text: "se deconnecter",
        path: navRoutes.LOGOUT
      },
      1: {
        text: "profile",
        path: navRoutes.USERPROFILE
      }
    }
  }
  const constLinks = {
    0: {
      text: "categories",
      path: navRoutes.CATEGORIES
    },
    1: {
      text: "produits",
      path: navRoutes.VENTES
    }
  }
  
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
      <Box
        sx={styles.topBox}
      >
        <TopAppBar position="static" >
          <Grid container>
            <TopNavGrid
              md={8}
              sm={11}
              item
            >
              <IconButton
                size="large"
                edge="start"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                sx={{ mr: 2, ...(open && { display: 'none' })}}
              >
                <MenuIcon />
              </IconButton>
              <Link to="/">
                <img src={logoPath} className="logo" />
              </Link>
              {Object.keys(constLinks).map((key, index) => (
            <TopNavLink key={index} text={constLinks[key].text} path={constLinks[key].path}></TopNavLink>
          ))}
              <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel>type</InputLabel>
                <Select value="">
                  <MenuItem value={"enchere"}>enchere</MenuItem>
                  <MenuItem value={"enchereInv"}>enchere inverse</MenuItem>
                  <MenuItem value={"vente"}>ventes</MenuItem>
                  <MenuItem value={"user"}>utilisateurs</MenuItem>
                </Select>
              </FormControl>
              </Box>
              {/* uncomment for real search bar */}
              {/* <Autowhatever
                //   items={}                 //list of items to search
                //   renderItem={}            //the value to display (name)
                //   inputProps={}            //placeholder/value(the onChange state value)/onChange: 
                //   highlightedItemIndex={}  //hovered item index
              /> */}
              <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                sx={{ width: "92%", mr: 5, minWidth: 100 }}
              />
            </TopNavGrid>
            <TopNavGrid
              md={4}
              sm={1}
              item
              sx={styles.secondGrid}
            > 
            {Object.keys(variableLinks).map((key, index) => (
            <TopNavLink key={index} text={variableLinks[key].text} path={variableLinks[key].path}></TopNavLink>
          ))}
              
              <IconButton
                size="large"
                edge="end"
                aria-label="open drawer"
                sx={{ ml: "0.5%"}}
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

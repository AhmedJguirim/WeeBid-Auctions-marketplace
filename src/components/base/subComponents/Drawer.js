import React from "react";
import {
  Drawer,
  Divider,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  ListItem,
  Box
} from "@mui/material";
import { DrawerHeader } from "../customComponents/general";
import { ChevronLeft } from "@mui/icons-material";

const styles = {
  drawer:{
    width: "25%",
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: "25%",
      boxSizing: "border-box",
    },
  },
  item:{"&:hover": {
    backgroundColor: "info.main",
    color: "primary.main"
  }}

}

const listeElems1 = {
  "tous les encheres": "browseAll",
  "categories": "browseCategories",
  "nos produits": "sales",
  "a propos de nous": "about",
  "contactez nous": "contact",
};
//this changes if the state of user is authorized
const listeElems2 = {
  "créer un compte": "register",
  "se connecter": "login",
  "politiques d'intimité": "privacyPolicies",
};
//to this one
const listeElems2V2 = {
  "commancer un enchère" : "makeEnchere",
  "commancer un enchère Inversé" : "makeEnchereInverse",
  "envoyer une demande de devis": "sendDemand",
  
  "liste de surveilles": "watchList",
  "vos Encheres" : "userEncheres",
  "vos Encheres Inversés" : "userEncheresInverses",
  "les demandes de devis recus" : "demandesRecus",
  "les propositions recus" : "propositions",

  "mon compte": "AccountInfos",
  "se déconnecter": "logout",
  "politiques d'intimité": "privacyPolicies",
};


const MyDrawer = ({open, setOpen}) => {
  
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      sx={styles.drawer}
      variant="persistent"
      anchor="left"
      open={open}
    >
      
      <DrawerHeader >
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeft />
        </IconButton>
      </DrawerHeader>

      <Divider />
      <List>
        {Object.keys(listeElems1).map((key, index) => (
          <ListItem sx={styles.item} button key={index} id={listeElems1[key]}>
            <ListItemText primary={key} />
          </ListItem>
        ))}

      </List>
      <Divider />
      <List>
        {Object.keys(listeElems2).map((key, index) => (
          <ListItem sx={styles.item} button key={index} id={listeElems1[key]}>
            <ListItemText primary={key} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MyDrawer;

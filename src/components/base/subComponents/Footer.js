import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { pinkish } from "../customComponents/general";
import { CustomLink } from "../customComponents/TopNavLink";

import { FooterLink } from "../customComponents/general";
import { useSelector } from "react-redux";
import { navRoutes } from "../../../config/routes";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { FooterMediaLink } from "./FooterStyles";

const Footer = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const listeElems1 = {
    "tous les encheres": navRoutes.ENCHERES,
    "nos enchères inversées": navRoutes.ENCHERESINVERSES,
    categories: navRoutes.CATEGORIES,
  };

  let listeElems2 = {};
  if (user.id === undefined) {
    listeElems2 = {
      "page d'accueil": "/",
      "créer un compte": navRoutes.REGISTER,
      "se connecter": navRoutes.LOGIN,
    };
  } else {
    listeElems2 = {
      "commancer un enchère ou enchere inversé": navRoutes.MAKE_ARTICLE,
      "votre profile": navRoutes.USERPROFILE,
      "liste de surveilles": navRoutes.WATCHLIST,
    };
  }

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "5%",
        ...pinkish,
        color: "black",
      }}
    >
      <Grid container>
        <Grid item xs={4}>
          <Typography variant="h4" ml={"3%"}>
            Compte
          </Typography>
          <List dense={true}>
            {Object.keys(listeElems1).map((key, index) => (
              <ListItem button key={index} id={listeElems1[key]}>
                <ListItemText>
                  <FooterLink to={listeElems1[key]}>{key}</FooterLink>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" ml={"3%"}>
            Offres
          </Typography>
          <List dense={true}>
            {Object.keys(listeElems2).map((key, index) => (
              <ListItem button key={index} id={listeElems2[key]}>
                <ListItemText>
                  <FooterLink to={listeElems2[key]}>{key}</FooterLink>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" ml={"3%"}>
            test
          </Typography>
          <List dense={true}>
            <ListItem id="facebook">
            <Facebook />
              <ListItemText>
                  
                <FooterMediaLink href={"https://www.facebook.com"}>Facebook </FooterMediaLink>
              </ListItemText>
            </ListItem>
            <ListItem button id="instagram">
            <Instagram />
              <ListItemText>
              
              <FooterMediaLink href={"https://www.instagram.com"}>Instagram </FooterMediaLink>
              </ListItemText>
            </ListItem>
            <ListItem id="twitter">

            <Twitter />
            <ListItemText>
            <FooterMediaLink href={"https://www.Twitter.com"}>Twitter </FooterMediaLink>
                </ListItemText>
            </ListItem>
        
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Footer;

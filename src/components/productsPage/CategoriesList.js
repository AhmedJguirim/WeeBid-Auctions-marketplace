import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import axios from "axios";
import { CustomLink } from "../base/customComponents/TopNavLink";
import { apiRoutes, navRoutes } from "../../config/routes";

const CategoriesList = () => {


  //#region getting categories
  //TODO: this code is duplicated from productslisting.js , declare it somewhere else then import it
  const [categories, setCategories] = React.useState({});
  async function getCategories() {
    try {
      const response = await axios.get(`${apiRoutes.API}/categories`);

      setCategories(response["data"]["hydra:member"]);
    } catch (error) {
      console.error(error);
    }
  }
  React.useEffect(()=>{
    getCategories()
  },[])
  //#endregion

  const styles = {
    productsGrid: { 
      backgroundColor: "primary.main" , 
      padding: 3,
      mt: 2
    }
  }

  return (
    <Grid
      container
      sx={{ ...styles.productsGrid, textAlign: "center" }}
      spacing={3}
    >
      {Object.keys(categories).map((key, index) => (
        <Grid item xs={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h4">{categories[key].name}</Typography>
              <br /><br />
              <CustomLink to={`${navRoutes.ENCHERES}${navRoutes.PERCATEGORY}/${categories[key].id}`}>
                encheres
              </CustomLink> <br /><br />
              <CustomLink to={`${navRoutes.ENCHERESINVERSES}${navRoutes.PERCATEGORY}/${categories[key].id}`}>
                encheres inversés
              </CustomLink>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoriesList;

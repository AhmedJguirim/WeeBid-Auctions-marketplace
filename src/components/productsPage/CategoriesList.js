import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import axios from "axios";
import { CategoryLink } from "../base/customComponents/TopNavLink";
import { apiRoutes, navRoutes } from "../../config/routes";
import { Link } from "react-router-dom";

const CategoriesList = () => {
  //#region getting categories
  //TODO: this code is duplicated from productslisting.js , declare it somewhere else then import it
  const [categories, setCategories] = React.useState({});
  const imageLinkPrefix = "http://127.0.0.1:8000/category/"
  async function getCategories() {
    try {
      const response = await axios.get(`${apiRoutes.API}/categories`);

      setCategories(response["data"]["hydra:member"]);
    } catch (error) {
      console.error(error);
    }
  }
  React.useEffect(() => {
    getCategories();
  }, []);
  //#endregion

  const styles = {
    productsGrid: {
      backgroundColor: "primary.main",
      padding: 3,
      mt: 2,
    },
  };

  return (
    <Grid
      container
      sx={{ ...styles.productsGrid, textAlign: "center" }}
      spacing={3}
    >
      {Object.keys(categories).map((key, index) => (
        <Grid item xs={4} key={index}>
          {/* TODO:make a relation between document and category 1to1 */}
          <Card variant="outlined" sx={{minWidth:"30%", minHeight:"50%"}}>
            <CardContent>
            {categories[key].image?(<img src={`${imageLinkPrefix}${categories[key].image}`} className="categoryImage" />):(<></>)}
              <Typography variant="h4">{categories[key].name}</Typography>
              <br />
              <br />
              <Grid container>
                <Grid item xs={6}>
                  <CategoryLink
                    to={`${navRoutes.ENCHERES}${navRoutes.PERCATEGORY}/${categories[key].id}`}
                  >
                    enchères
                  </CategoryLink>
                </Grid>
                <Grid item xs={6}>
                  <CategoryLink to={`${navRoutes.ENCHERESINVERSES}${navRoutes.PERCATEGORY}/${categories[key].id}`}
                  >
                    enchères inversés
                  </CategoryLink>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoriesList;

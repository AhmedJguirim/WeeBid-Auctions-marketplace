import { Checkbox, Grid, Pagination, Typography } from "@mui/material";
import React from "react";
import ProductsListing from "../generalComponents/ProductsListing";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiRoutes, navRoutes } from "../../config/routes";

const EncheresInverseParCategory = () => {
  const { categoryId } = useParams();
  const [enchereInverses, setEnchereInverses] = React.useState({});
  const [categoryName, setCategoryName] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pagesNumber, setPageNumber] = React.useState(1);
  const [checked, setChecked] = React.useState(false);

  function getPagesNumber() {
    if(checked){
      axios
      .get(`${apiRoutes.API}/enchere_inverses/pages`, {
        params: {
          category: categoryId,
        },
      })
      .then((res) => {
        if (res["data"]["hydra:member"].length / 12 < 1) {
          setPageNumber(1);
        } else {
          setPageNumber(Math.ceil(res["data"]["hydra:member"].length / 12));
        }
      });
    }else{axios
      .get(`${apiRoutes.API}/enchere_inverses/pages`, {
        params: {
          category: categoryId,
          "endDate[after]": new Date(),
        },
      })
      .then((res) => {
        if (res["data"]["hydra:member"].length / 12 < 1) {
          setPageNumber(1);
        } else {
          setPageNumber(Math.ceil(res["data"]["hydra:member"].length / 12));
        }
      });}
  }
  function getEnchereInverses() {
    if(checked){
      axios
      .get(`${apiRoutes.API}/enchere_inverses`, {
        params: {
          page: page,
          category: categoryId,
        },
      })
      .then(function (response) {
        console.log(response["data"]["@id"], "retrieved successfully!");
        setEnchereInverses(response["data"]["hydra:member"]);
      })
      .catch((error) => console.log(error));
    }else{
      axios
      .get(`${apiRoutes.API}/enchere_inverses`, {
        params: {
          page: page,
          category: categoryId,
          "endDate[after]": new Date(),
        },
      })
      .then(function (response) {
        console.log(response["data"]["@id"], "retrieved successfully!");
        setEnchereInverses(response["data"]["hydra:member"]);
      })
      .catch((error) => console.log(error));
    }
    
  }
  
  const getCategoryName = () => {
    axios
      .get(`${apiRoutes.API}/categories/${categoryId}`)
      .then((response) => {
        setCategoryName(response["data"].name);
      })
      .catch((error) => {
        return error;
      });
  };
  const handlePagination = (event, value) => {
    setPage(value);
  };
  const handleCheck = (event) => {
    setChecked(event.target.checked);
  };
  React.useEffect(() => {
    getEnchereInverses();
    getCategoryName();
    getPagesNumber();
  }, []);
  React.useEffect(() => {
    getEnchereInverses();
  }, [page, checked]);


  return (
    <Grid container>
      <Grid container>
        <Grid item xs={7}>
          <Typography variant="h3">
            nos encheres inversées de {categoryName}
          </Typography>
        </Grid>
        <Grid item >
          <Checkbox
            checked={checked}
            onChange={handleCheck}
            inputProps={{ "aria-label": "controlled" }}
          />
          
        </Grid>
        <Grid item xs={3}><br /><Typography>afficher les encheres Inversées expirés</Typography></Grid>
      </Grid>

      <ProductsListing
        elemsPerLine={6}
        type={navRoutes.ENCHEREINVERSE}
        ventes={enchereInverses}
      ></ProductsListing>
      {/* TODO:center pagination */}
      <Pagination
        count={pagesNumber}
        onChange={handlePagination}
        color="secondary"
      />
    </Grid>
  );
};

export default EncheresInverseParCategory;

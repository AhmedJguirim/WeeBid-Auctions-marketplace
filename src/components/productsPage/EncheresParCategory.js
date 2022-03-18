import { Grid, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../generalComponents/ProductsListing';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { apiRoutes } from "../../config/routes";

const EncheresParCategory = () => {
  const {categoryId} = useParams();
  const [encheres, setEncheres] = React.useState({});
  const [categoryName, setCategoryName] = React.useState("");
  
  function getEnchere() {
    axios.get(`${apiRoutes.API}/encheres`, {
      params: {
        page: "1",
        category: `${categoryId}`
      }
    })
    .then(function (response) {
      console.log(response["data"]["@id"], "retrieved successfully!")
      setEncheres(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))
  }
  const getCategoryName = ()=>{
    axios.get(`${apiRoutes.API}/categories/${categoryId}`).then(response=>{setCategoryName(response["data"].name)}).catch(error=>{return error})
  }
  React.useEffect(()=>{
    getEnchere()
    getCategoryName()
  },[])

      return (
        <Grid container>
            <Typography variant='h3'>nos encheres de {categoryName}</Typography>
            <ProductsListing elemsPerLine={6} ventes={encheres}>
            </ProductsListing>
        </Grid>
      )
}

export default EncheresParCategory
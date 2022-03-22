import { Grid, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../generalComponents/ProductsListing';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { apiRoutes, navRoutes } from '../../config/routes';

const EncheresInverseParCategory = () => {
  const {categoryId} = useParams();
  const [enchereInverses, setEnchereInverses] = React.useState({});
  const [categoryName, setCategoryName] = React.useState("");
  
  function getEnchereInverses() {
    axios.get(`${apiRoutes.API}/enchere_inverses`, {
      params: {
        page: "1",
        category: categoryId
      }
    })
    .then(function (response) {
      console.log(response["data"]["@id"], "retrieved successfully!")
      setEnchereInverses(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))
  }
  const getCategoryName = ()=>{
    axios.get(`${apiRoutes.API}/categories/${categoryId}`).then(response=>{setCategoryName(response["data"].name)}).catch(error=>{return error})
  }
  React.useEffect(()=>{
    getEnchereInverses()
    getCategoryName()
  },[])

      return (
        <Grid container>
            <Typography variant='h3'>nos encheres inversées de {categoryName}</Typography>
            <ProductsListing elemsPerLine={6} type={navRoutes.ENCHEREINVERSE} ventes={enchereInverses}>
            </ProductsListing>
        </Grid>
      )
}

export default EncheresInverseParCategory
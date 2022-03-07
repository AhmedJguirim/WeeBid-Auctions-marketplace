import { Grid, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../generalComponents/ProductsListing';
import Api from "../../AxiosInstance";
import { useParams } from 'react-router-dom';

const EncheresInverseParCategory = () => {
  const {categoryId} = useParams();
  const [enchereInverses, setEnchereInverses] = React.useState({});
  const [categoryName, setCategoryName] = React.useState("");
  
  function getEnchereInverses() {
    Api.get('/enchere_inverses', {
      params: {
        page: "1",
        category: categoryId
      }
    })
    .then(function (response) {
      setEnchereInverses(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))
  }
  const getCategoryName = ()=>{
    Api.get(`/categories/${categoryId}`).then(response=>{setCategoryName(response["data"].name)}).catch(error=>{return error})
  }
  React.useEffect(()=>{
    getEnchereInverses()
    getCategoryName()
  },[])

      return (
        <Grid container>
            <Typography variant='h3'>nos encheres inversées de {categoryName}</Typography>
            <ProductsListing elemsPerLine={6} ventes={enchereInverses}>
            </ProductsListing>
        </Grid>
      )
}

export default EncheresInverseParCategory
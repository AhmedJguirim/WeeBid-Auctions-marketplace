import { Grid, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../generalComponents/ProductsListing';
import Api from "../../AxiosInstance";


const EncheresInvListing = () => {
  const [enchereInverses, setEnchereInverses] = React.useState({});

  
  function getEnchereInverses() {
    Api.get('/enchere_inverses', {
      params: {
        page: "1",
      }
    })
    .then(function (response) {
      setEnchereInverses(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))
  }

  React.useEffect(()=>{
    getEnchereInverses()
  },[])

      return (
        <Grid container>
            <Typography variant='h3'>nos encheres inversées</Typography>
            <ProductsListing elemsPerLine={6} ventes={enchereInverses}>
            </ProductsListing>
        </Grid>
      )
}

export default EncheresInvListing
import { Grid, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../generalComponents/ProductsListing';
import Api from "../../AxiosInstance";

const EncheresListing = () => {
  const [encheres, setEncheres] = React.useState({});

  
  function getEncheres() {
    Api.get('/encheres', {
      params: {
        page: "1",
      }
    })
    .then(function (response) {
      setEncheres(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))
  }

  React.useEffect(()=>{
    getEncheres()
  },[])

      return (
        <Grid container>
            <Typography variant='h3'>nos encheres</Typography>
            <ProductsListing elemsPerLine={6} ventes={encheres}>
            </ProductsListing>
        </Grid>
      )
}

export default EncheresListing
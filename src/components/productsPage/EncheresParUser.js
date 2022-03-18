import { Grid, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../generalComponents/ProductsListing';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { apiRoutes, navRoutes } from "../../config/routes";

const EncheresParUser = () => {
  const {id} = useParams();
  const [encheres, setEncheres] = React.useState({});
  const [userName, setUserName] = React.useState("")
  //just to get the username
  function getUser() {
    console.log("user id:",id)
    axios.get(`${apiRoutes.API}/users/${id}`)
    .then(function (response) {
      setUserName(response["data"].displayName);
    }).catch(error=>console.log(error))
  }
  
  function getEnchere() {
    console.log("user id",id)
    axios.get(`${apiRoutes.API}/encheres`, {
      params: {
        page: "1",
        user: `${id}`
      }
    })
    .then(function (response) {
      console.log(response["data"]["hydra:member"])
      setEncheres(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))
  }
  React.useEffect(()=>{
    getEnchere()
    getUser()

  },[])

      return (
        <Grid container>
            <Typography variant='h3'>nos encheres de {userName}</Typography>
            <ProductsListing elemsPerLine={6} ventes={encheres}>
            </ProductsListing>
        </Grid>
      )
}

export default EncheresParUser
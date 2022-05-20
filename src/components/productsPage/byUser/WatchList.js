import { Divider, Grid, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../../generalComponents/ProductsListing';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { apiRoutes, navRoutes } from "../../../config/routes";
import { useSelector } from 'react-redux';
import { pinkish } from '../../base/customComponents/general';

const WatchList = () => {

  const [encheres, setEncheres] = React.useState({});
  const [encheresInverses, setEncheresInverses] = React.useState({});
  let tempencheres = []
  let tempencheresInverses = []

const filling = list=>{
    let e = 0;
    let ei = 0;
    list.map(surveille=>{
        if(surveille.enchere){
            tempencheres[e] = surveille.enchere;
            e++;
        }
        else{
            tempencheresInverses[ei] = surveille.enchereInverse;
            ei++;
        }
    })
    setEncheres(tempencheres);
    setEncheresInverses(tempencheresInverses);
}
const user = useSelector((state) => state.user);
  function getWatchList() {
      if(user.id ===undefined){
          return
      }
    axios.get(`${apiRoutes.API}/surveilles`, {
      params: {
        page: "1",
        user: user.id
      }
    })
    .then(function (response) {
      filling(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))
  }
  React.useEffect(()=>{
    getWatchList()
  },[user])


      return (
        <Grid container sx={pinkish}>
            <Grid item xs={12}><br /><Typography variant='h3' marginLeft={3}>votre liste de surveilles</Typography></Grid>
            <Grid item xs={0.3}></Grid>
            <Grid item xs={5.6}>
            <br /><br />
            <Typography variant='h5'>enchères Surveillées</Typography>
            <ProductsListing elemsPerLine={3} type={navRoutes.ENCHERE} ventes={encheres}></ProductsListing>
            </Grid>
            <Grid item xs={0.4}></Grid>
            
            <Grid item xs={5.6}>
            <br /><br />
            <Typography variant='h5'>enchères Inversées Surveillées</Typography>
            <ProductsListing elemsPerLine={3} type={navRoutes.ENCHEREINVERSE} ventes={encheresInverses}></ProductsListing>
            </Grid>
            <Grid item xs={0.1}></Grid>
        </Grid>
      )
}

export default WatchList
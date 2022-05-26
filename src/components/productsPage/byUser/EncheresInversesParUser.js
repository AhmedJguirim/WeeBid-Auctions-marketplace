import { Checkbox, Grid, Pagination, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../../generalComponents/ProductsListing';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { apiRoutes, navRoutes } from "../../../config/routes";

const EncheresInversesParUser = () => {
  const {id} = useParams();
  const [encheres, setEncheres] = React.useState({});
  const [userName, setUserName] = React.useState("")
  const [page, setPage] = React.useState(1);
  const [pagesNumber, setPageNumber] = React.useState(1);
  const [checked, setChecked] = React.useState(false);

  //just to get the username
  function getUser() {
    axios.get(`${apiRoutes.API}/users/${id}`)
    .then(function (response) {
      setUserName(response["data"].displayName);
    }).catch(error=>console.log(error))
  }
  //could be a general function for everything TODO
  function getPagesNumber() {
    if(checked){
      axios
      .get(`${apiRoutes.API}/enchere_inverses/pages`, {
        params: {
          user:id
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
          user:id,
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

  function getEnchere() {
    if(checked){
    axios.get(`${apiRoutes.API}/enchere_inverses`, {
      params: {
        page: page,
        user: `${id}`
      }
    })
    .then(function (response) {
      console.log(response["data"]["@id"], "retrieved successfully!")
      setEncheres(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))}
    else{
      axios.get(`${apiRoutes.API}/enchere_inverses`, {
        params: {
          page: page,
          user: `${id}`,
          "endDate[after]": new Date(),
        }
      })
      .then(function (response) {
        console.log(response["data"]["@id"], "retrieved successfully!")
        setEncheres(response["data"]["hydra:member"]);
      }).catch(error=>console.log(error))
    }
  }
  
  const handleCheck = (event) => {
    setChecked(event.target.checked);
  };
  const handlePagination = (event, value)=>{
    setPage(value)
  }
  React.useEffect(()=>{
    getEnchere()
    getUser()
    getPagesNumber()
  },[])
  React.useEffect(()=>{
    getEnchere()
  },[page, checked])

      return (
        <Grid container>
          <Grid container>
        <Grid item xs={7}>
          <Typography variant="h3" ml="2%">
            Nos enchères inversées de {userName}
          </Typography>
        </Grid>
        <Grid item sx = {{mt:1}} >
          <Checkbox
            checked={checked}
            onChange={handleCheck}
            inputProps={{ "aria-label": "controlled" }}
          />
          
        </Grid>
        <Grid item xs={3}><br /><Typography>afficher les encheres Inversées expirés</Typography></Grid>
      </Grid>
           
            <ProductsListing elemsPerLine={6} type={navRoutes.ENCHEREINVERSE} ventes={encheres}>
            </ProductsListing>
            <Pagination count={pagesNumber} onChange={handlePagination} color="secondary" />
        </Grid>
      )
}

export default EncheresInversesParUser
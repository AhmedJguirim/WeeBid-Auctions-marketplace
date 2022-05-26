import { Checkbox, Grid, Pagination, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../../generalComponents/ProductsListing';
import axios from 'axios';
import { apiRoutes, navRoutes } from '../../../config/routes';

const EncheresListing = () => {
  const [encheres, setEncheres] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [pagesNumber, setPageNumber] = React.useState(1);
  const [checked, setChecked] = React.useState(false);

  function getPagesNumber() {
    if(checked){
      axios
      .get(`${apiRoutes.API}/encheres/pages`, {
      })
      .then((res) => {
        if (res["data"]["hydra:member"].length / 12 < 1) {
          setPageNumber(1);
        } else {
          setPageNumber(Math.ceil(res["data"]["hydra:member"].length / 12));
        }
      });
    }else{axios
      .get(`${apiRoutes.API}/encheres/pages`, {
        params: {
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
  function getEncheres() {
    if(checked){
    axios.get(`${apiRoutes.API}/encheres`, {
      params: {
        page: page,
      }
    })
    .then(function (response) {
      setEncheres(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))
  }else{
    axios.get(`${apiRoutes.API}/encheres`, {
      params: {
        page: page,
        "endDate[after]": new Date(),
      }
    })
    .then(function (response) {
      setEncheres(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))
  }
  }

  const handlePagination = (event, value) => {
    setPage(value);
  };
  const handleCheck = (event) => {
    setChecked(event.target.checked);
  };

  React.useEffect(()=>{
    getEncheres()
    getPagesNumber();
  },[])
  React.useEffect(() => {
    getEncheres();
  }, [page, checked]);

      return (
        <Grid container>
          <Grid container>
        <Grid item xs={7}>
        <Typography variant='h3'>nos enchères</Typography>
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
            
            <ProductsListing elemsPerLine={6} type={navRoutes.ENCHERE} ventes={encheres}>
            </ProductsListing>
            <Pagination
        count={pagesNumber}
        onChange={handlePagination}
        color="secondary"
      />
        </Grid>
      )
}

export default EncheresListing
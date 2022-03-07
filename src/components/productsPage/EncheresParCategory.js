import { Grid, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../generalComponents/ProductsListing';
import Api from "../../AxiosInstance";
import { useParams } from 'react-router-dom';

const EncheresParCategory = ({category}) => {
  const {categoryId} = useParams();
  const [encheres, setEncheres] = React.useState({});
  const [categoryName, setCategoryName] = React.useState("");
  
  function getEnchere() {
    Api.get('/encheres', {
      params: {
        page: "1",
        category: `${categoryId}`
      }
    })
    .then(function (response) {
      setEncheres(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))
  }
  const getCategoryName = ()=>{
    Api.get(`/categories/${categoryId}`).then(response=>{setCategoryName(response["data"].name)}).catch(error=>{return error})
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
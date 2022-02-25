import React from 'react'

import TopNavBar from './subComponents/TopNavBar'
import { Box } from '@mui/material'
import Login from '../login/Login.js'
import Homepage from '../homepage/Homepage.js'
import VentesListing from '../productsPage/VentesListing.js'
import CreerArticle from '../forms/CreerArticle.js'
import { Register } from '../register/Register'
import DetailedProduct from '../productsPage/DetailedProduct'


const styles = {
  body:{
    backgroundColor: "primary.main"
  }
}
const Base = () => {
  return (
    <Box sx={styles.body}>
    
    <TopNavBar />

    <DetailedProduct />
{/* <CreerArticle /> 
    <Register /> 
    <Homepage /> 

    <Login />
    <VentesListing /> */}
    </Box>
  )
}

export default Base


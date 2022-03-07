import React from 'react'

import TopNavBar from './subComponents/TopNavBar'
import { Box } from '@mui/material'
import Login from '../login/Login.js'
import Homepage from '../homepage/Homepage.js'
import VentesListing from '../productsPage/VentesListing.js'
import CreerArticle from '../forms/CreerArticle.js'
import { Register } from '../register/Register'
import DetailedProduct from '../productsPage/DetailedProduct'
import UserProfile from '../UserProfile';
import EncheresHistory from '../userHistory/EncheresHistory'
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { checkUser, getUserData } from '../../redux/actions'
import CategoriesList from '../productsPage/CategoriesList'
import EncheresParCategory from '../productsPage/EncheresParCategory'
import EncheresInverseParCategory from '../productsPage/EncheresInverseParCategory'
import EncheresListing from '../productsPage/EncheresListing'
import EncheresInvListing from '../productsPage/EncheresInvListing'


const styles = {
  body:{
    backgroundColor: "primary.main"
  }
}
const Base = () => {
  const dispatch = useDispatch();  
    window.addEventListener('storage', () => {
      dispatch(getUserData())
    });
    React.useEffect(()=>{
      dispatch(getUserData())
    },[])
  
  return (
    <Router>
      <Box sx={styles.body}>
        <TopNavBar />
        <Routes>
          {/* TODO: declare the routes in config/route.js */}
          <Route path="/makeEnchere" element={<CreerArticle />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/enchereHistory/:userId" element={<EncheresHistory />}></Route>
          <Route path="/enchere/:id" element={<DetailedProduct />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/" element={<Homepage /> }></Route>
          <Route path="/profile/:userId" element={<UserProfile />}></Route>
          <Route path="/ventes" element={<VentesListing />}></Route>
          <Route path="/categories" element={<CategoriesList />}></Route>
          <Route path="/encheres/:categoryId" element={<EncheresParCategory />}></Route>
          <Route path="/encheresInverses/:categoryId" element={<EncheresInverseParCategory />}></Route>
          <Route path="/encheres/:categoryId" element={<EncheresParCategory />}></Route>
          <Route path="/encheresInverses" element={<EncheresInvListing />}></Route>
          <Route path="/encheres" element={<EncheresListing />}></Route>
          <Route path="/enchere/:enchereId" element={<DetailedProduct />}></Route>
          
          
        </Routes>
      </Box>
    </Router>
  )
}

export default Base


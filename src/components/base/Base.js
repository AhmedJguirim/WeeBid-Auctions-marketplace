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
import {BrowserRouter as Router,  Route,Routes} from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { checkUser, getUserData } from '../../redux/actions'
import CategoriesList from '../productsPage/CategoriesList'
import EncheresParCategory from '../productsPage/EncheresParCategory'
import EncheresInverseParCategory from '../productsPage/EncheresInverseParCategory'
import EncheresListing from '../productsPage/EncheresListing'
import EncheresInvListing from '../productsPage/EncheresInvListing'
import Logout from '../login/logout'
import { navRoutes } from '../../config/routes'
import WorkInProgress from './customComponents/WorkInProgress'
import EncheresParUser from '../productsPage/EncheresParUser'
import EncheresInversesParUser from '../productsPage/EncheresInversesParUser'
import WatchList from '../productsPage/WatchList'
import CreateArticle from '../forms/MultiStepArticle'


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
          <Route path={navRoutes.MAKE_ARTICLE} element={<CreateArticle />}></Route>
          <Route path={navRoutes.LOGIN} element={<Login />}></Route>
          <Route path="/enchereHistory/:userId" element={<EncheresHistory />}></Route>
          <Route path={`${navRoutes.ENCHERE}/:id`} element={<DetailedProduct />}></Route>
          <Route path={navRoutes.REGISTER} element={<Register />}></Route>
          <Route path="/" element={<Homepage /> }></Route>
          <Route path={navRoutes.USERPROFILE} element={<UserProfile />}></Route>
          <Route path={navRoutes.VENTES} element={<VentesListing />}></Route>
          <Route path={navRoutes.CATEGORIES} element={<CategoriesList />}></Route>
          <Route path={`${navRoutes.ENCHERES}${navRoutes.PERCATEGORY}/:categoryId`} element={<EncheresParCategory />}></Route>
          <Route path={`${navRoutes.ENCHERESINVERSES}${navRoutes.PERCATEGORY}/:categoryId`} element={<EncheresInverseParCategory />}></Route>
          <Route path={navRoutes.ENCHERESINVERSES} element={<EncheresInvListing />}></Route>
          <Route path={navRoutes.ENCHERES} element={<EncheresListing />}></Route>
          {/* TODO: make a seperate page for detailed ENCCHEREINVERSE */}
          <Route path={`${navRoutes.ENCHEREINVERSE}/:id`} element={<DetailedProduct />}></Route>
          <Route path={navRoutes.LOGOUT} element={<Logout />}></Route>
          <Route path={navRoutes.INPROGRESS}element={<WorkInProgress />}></Route>
          <Route path={`${navRoutes.ENCHERES}${navRoutes.PERUSER}/:id`}element={<EncheresParUser />}></Route>
          <Route path={`${navRoutes.ENCHERESINVERSES}${navRoutes.PERUSER}/:id`}element={<EncheresInversesParUser />}></Route>
          <Route path={navRoutes.WATCHLIST}element={<WatchList />}></Route>

          
        </Routes>
      </Box>
    </Router>
  )
}

export default Base


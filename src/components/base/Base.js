import React from 'react'

import TopNavBar from './subComponents/TopNavBar'
import { Box } from '@mui/material'
import Login from '../login/Login.js'
import Homepage from '../homepage/Homepage.js'
import VentesListing from '../productsPage/VentesListing.js'
import UserProfile from '../UserProfile';
import EncheresHistory from '../userHistory/EncheresHistory'
import {BrowserRouter as Router,  Route,Routes} from 'react-router-dom';
import DemandesListing from '../tableListings/DemandesListing'
import { useDispatch, useSelector } from 'react-redux'
import { checkUser, getUserData } from '../../redux/actions'
import CategoriesList from '../productsPage/generalListing/CategoriesList'
import EncheresParCategory from '../productsPage/byCategory/EncheresParCategory'
import EncheresInverseParCategory from '../productsPage/byCategory/EncheresInverseParCategory'
import EncheresListing from '../productsPage/generalListing/EncheresListing'
import EnchereSearchPage from '../productsPage/search/EnchereSearchPage'
import EncheresInvListing from '../productsPage/generalListing/EncheresInvListing'
import Logout from '../login/logout'
import { navRoutes } from '../../config/routes'
import WorkInProgress from './customComponents/WorkInProgress'
import EncheresParUser from '../productsPage/byUser/EncheresParUser'
import EncheresInversesParUser from '../productsPage/byUser/EncheresInversesParUser'
import WatchList from '../productsPage/byUser/WatchList'
import CreateArticle from '../forms/multiStepArticlev2'
import MultiStepRegister from '../register/MultiStepRegisterv2'
import DetailedEnchereInverse from '../productsPage/generalListing/DetailedEnchereInverse'
import DetailedEnchere from '../productsPage/generalListing/DetailedEnchere'
import Socket from './customComponents/Socket'
import ConsultUser from '../ConsultUser'
import Demande from '../demande/Demande'
import NotFound from './customComponents/NotFound'
import EnchereInverseSearchPage from '../productsPage/search/EnchereInverseSearchPage'
import UserSearchPage from '../productsPage/search/UserSearchPage'
import NotificationListing from '../tableListings/NotificationListing'
import PropositionsListing from '../tableListings/propositionsListing'
// import image from "../../media/images/backgroundimg.gif"





const styles = {
  body:{
    backgroundColor: "#f4ebf5",
    height:630
  }
}
const Base = () => {
  const watchList = useSelector((state) => state.watchList)
  const user = useSelector((state) => state.user)
  React.useEffect(()=>{    
    
    if (watchList[0] !== undefined){
      let list = [];
      watchList.map(elem=>{
        if(elem.enchere!== undefined){
          list.push(elem.enchere)
        }else{
          list.push(elem.enchereInverse)
        }
      })
      Socket.emit("join-rooms", list)
      Socket.emit("join-rooms", user.id + "USER")
    }}
  

,[watchList])


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
          <Route path={`${navRoutes.USERSEARCH}/:search`} element={<UserSearchPage /> }></Route>
          <Route path={`${navRoutes.PROPOSITIONSLISTING}`} element={<PropositionsListing /> }></Route>
          <Route path={`${navRoutes.DEMANDESLISTING}`} element={<DemandesListing /> }></Route>
          <Route path={`${navRoutes.NOTIFICATIONS}`} element={<NotificationListing />}></Route>
          <Route path={`${navRoutes.DEMANDE}/:id`} element={<Demande />}></Route>
          <Route path={`${navRoutes.CONSULTUSER}/:id`} element={<ConsultUser />}></Route>
          <Route path={navRoutes.MAKE_ARTICLE} element={<CreateArticle />}></Route>
          <Route path={navRoutes.LOGIN} element={<Login />}></Route>
          <Route path="/enchereHistory/:userId" element={<EncheresHistory />}></Route>
          <Route path={`${navRoutes.ENCHERE}/:id`}  element={<DetailedEnchere />}></Route>
          <Route path={navRoutes.REGISTER} element={<MultiStepRegister />}></Route>
          <Route path="/" element={<Homepage /> }></Route>
          <Route path={navRoutes.USERPROFILE} element={<UserProfile />}></Route>
          <Route path={navRoutes.VENTES} element={<VentesListing />}></Route>
          <Route path={navRoutes.CATEGORIES} element={<CategoriesList />}></Route>
          <Route path={`${navRoutes.ENCHERES}${navRoutes.PERCATEGORY}/:categoryId`} element={<EncheresParCategory />}></Route>
          <Route path={`${navRoutes.ENCHERESINVERSES}${navRoutes.PERCATEGORY}/:categoryId`} element={<EncheresInverseParCategory />}></Route>
          <Route path={navRoutes.ENCHERESINVERSES} element={<EncheresInvListing />}></Route>
          <Route path={navRoutes.ENCHERES} element={<EncheresListing />}></Route>
          <Route path={`${navRoutes.ENCHEREINVERSE}/:id`} element={<DetailedEnchereInverse />}></Route>
          <Route path={navRoutes.LOGOUT} element={<Logout />}></Route>
          <Route path={navRoutes.INPROGRESS}element={<WorkInProgress />}></Route>
          <Route path={`${navRoutes.ENCHERES}${navRoutes.PERUSER}/:id`}element={<EncheresParUser />}></Route>
          <Route path={`${navRoutes.ENCHERESINVERSES}${navRoutes.PERUSER}/:id`}element={<EncheresInversesParUser />}></Route>
          <Route path={navRoutes.WATCHLIST}element={<WatchList />}></Route>
          <Route path={`${navRoutes.ENCHERESEARCH}/:search`} element={<EnchereSearchPage />}></Route>
          <Route path={`${navRoutes.ENCHEREINVERSESEARCH}/:search`} element={<EnchereInverseSearchPage />}></Route>
          {/* TODO: users search missing */}
          <Route path={`${navRoutes.USERSEARCH}/:search`} element={<UserSearchPage />}></Route>

          <Route path="*" element={<NotFound />}></Route>

          
        </Routes>
      </Box>
    </Router>
  )
}

export default Base


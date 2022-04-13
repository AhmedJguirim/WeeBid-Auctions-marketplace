import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { apiRoutes } from '../../config/routes'


export const setPrice = (price)=>{
  return {
    type: "SETPRICE",
    price: price
  }
}
export function getUserData() {
  
  return dispatch=>{
  axios.get(`${apiRoutes.API}/userdata`,{
    headers:{
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(function (response) {
    const data = response.data
    dispatch(checkUser(data));
    dispatch(fetchWatchList(data.id))
    dispatch(fetchNotifications(data.id))
    }
  )
  .catch(function (error) {
    dispatch(checkUser({}))
    window.localStorage.clear()
    const { status } = error.response;
      if (status === StatusCodes.INTERNAL_SERVER_ERROR) {
        console.log("le serveur fait face a un probleme , veuillez patienter")
      }
      else if(status === StatusCodes.UNAUTHORIZED){
        console.log("vous n'etes pas authetifié")
      }
  })

  }}
  export const checkUser = (user)=>{

    return {
        type: 'CHECKUSER',
        payload: user
    }

  }

  export function fetchWatchList(userId) {
  
    return dispatch=>{
    axios.get(`${apiRoutes.API}/surveilles`,{
    params:{
      user:`/api/users/${userId}`
    }
    })
    .then(function (response) {
      const data = response["data"]["hydra:member"];
      dispatch(getWatchList(data))
      }
    )
    .catch(function (error) {
      console.log(error)
      const { status } = error.response;
        if (status === StatusCodes.INTERNAL_SERVER_ERROR) {
          console.log("le serveur fait face a un probleme , veuillez patienter")
        }
    })
  
    }}
    export const getWatchList = (watchList)=>{

      return {
          type: 'GETWATCHLIST',
          payload: watchList
      }
  
    }

    export function fetchNotifications(userId) {
  
      return dispatch=>{
      axios.get(`${apiRoutes.API}/notifications`,{
      params:{
        user:`/api/users/${userId}`
      }
      })
      .then(function (response) {
        const data = response["data"]["hydra:member"];
        dispatch(getNotifications(data))
        }
      )
      .catch(function (error) {
        const { status } = error.response;
          if (status === StatusCodes.INTERNAL_SERVER_ERROR) {
            console.log("le serveur fait face a un probleme , veuillez patienter")
          }
      })
    
      }}

  export const getNotifications = (notifications)=>{

    return {
        type: 'GETNOTIFICATIONS',
        payload: notifications
    }

  }


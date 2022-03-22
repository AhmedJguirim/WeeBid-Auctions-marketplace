import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { useDispatch } from 'react-redux'
import { apiRoutes } from '../../config/routes'

export function getUserData() {
  
  return dispatch=>{
  axios.get(`${apiRoutes.API}/userdata`,{
    headers:{
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(function (response) {
    const data = response.data
    dispatch(checkUser(data))
  })
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

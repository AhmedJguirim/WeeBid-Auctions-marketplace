import axios from 'axios'
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
    console.log(error);
  })

  }}


export const checkUser = (user)=>{

    return {
        type: 'CHECKUSER',
        payload: user
    }

  }

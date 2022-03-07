import Api from "../../AxiosInstance"
import { useDispatch } from 'react-redux'

export function getUserData() {
  return dispatch=>{
  Api.get("http://127.0.0.1:8000/api/userdata")
  .then(function (response) {
    const data = response.data
    dispatch(checkUser(data))
  })
  .catch(function (error) {
    dispatch(checkUser({}))
    console.log(error);
  })

  }}


export const checkUser = (user)=>{

    return {
        type: 'CHECKUSER',
        payload: user
    }

  }

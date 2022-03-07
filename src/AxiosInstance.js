import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { navRoutes } from "./config/routes";
import { apiRoutes } from "./config/routes";

const Api = () => {
  const api = axios.create({
    baseURL: `${apiRoutes.API}`,
  });

  api.interceptors.request.use(
    (config) => {
      //   const token = await AsyncStorage.getItem("token");
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      else{
        document.location.href = navRoutes.LOGIN;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,

    (error) => {
      console.log("Error Interceptor");
      const { status } = error.response;
      if (status === StatusCodes.INTERNAL_SERVER_ERROR) {
        // configureStore.dispatch({
        //   type: types.TOGGLE_FLASH_MESSAGE,
        //   payload: {
        //     message: "Une erreur est survenue",
        //     type: flashType.ERROR,
        //   },
        // });
      }
      
      //make this smarter by redirecting just when you visit a page that requires permission
      // else if (status === StatusCodes.UNAUTHORIZED) {
      //   document.location.href = navRoutes.LOGIN;
      // }

      return Promise.reject(error);
    }
  );
  return api;
};
// ==============================

export default Api();


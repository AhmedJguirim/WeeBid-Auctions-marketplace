import userReducer from "./user";
import { combineReducers } from "redux";
import currentPrice from "./price";
import watchListReducer from "./watchList";
import notificationsReducer from "./notifications";

const myReducers = combineReducers({user :userReducer, currentPrice : currentPrice, watchList:watchListReducer, notifications:notificationsReducer})

export default myReducers;
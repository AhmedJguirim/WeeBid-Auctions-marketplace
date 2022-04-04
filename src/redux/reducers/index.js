import userReducer from "./user";
import { combineReducers } from "redux";
import currentPrice from "./price";
import watchListReducer from "./watchList";

const myReducers = combineReducers({user :userReducer, currentPrice : currentPrice, watchList:watchListReducer})

export default myReducers;
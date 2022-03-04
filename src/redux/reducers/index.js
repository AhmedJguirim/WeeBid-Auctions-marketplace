import userReducer from "./user";
import { combineReducers } from "redux";
import cartReducer from "./cart";
import watchListReducer from "./watchList";

const myReducers = combineReducers({user :userReducer, cart : cartReducer, watchList:watchListReducer})

export default myReducers;
import drawerReducer from "./drawerReducer";
import { combineReducers } from "redux";

const myReducers = combineReducers({drawerReducer : drawerReducer})

export default myReducers;
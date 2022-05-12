import { createStore ,compose,applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import myReducers from "./reducers/index";




const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(myReducers, composeEnhancer(applyMiddleware(thunk)))
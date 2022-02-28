
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom';
import Base from './components/base/Base.js';
import React from 'react'
import { createTheme, ThemeProvider  } from '@mui/material/styles';
import { createStore } from 'redux';
import myReducers from './redux/reducers/index.js';
import { Provider } from 'react-redux';
import "./styles/app.css";

const store = createStore(myReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const theme = createTheme({
  palette: {
    primary: {
      main: '#FCF8FF',
      dark: '#362B48',
      light: '#FCF8FF'
    },
    secondary: {
      main: '#362B48',
      dark: '#FCF8FF',
      light: '#362B48'
    },
    info: {
      main: '#5927E5',
      dark: '#5927E5',
      light: '#5927E5'
    }
  },
  
});
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Base />
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

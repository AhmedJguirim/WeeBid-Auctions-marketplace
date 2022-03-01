
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom';
import Base from './components/base/Base.js';
import React from 'react'
import { createTheme, ThemeProvider  } from '@mui/material/styles';
import { createStore } from 'redux';
import myReducers from './redux/reducers/index.js';
import { Provider } from 'react-redux';
import "./styles/app.css";
import Api from './AxiosInstance';

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


async function getUser() {
  try {
    const response = await Api.get("http://127.0.0.1:8000/api/userdata");
    console.log(response["data"]);
  } catch (error) {
    console.error(error);
  }
}

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

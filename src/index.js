
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom';
import Base from './components/base/Base.js';
import React from 'react'
import { createTheme, ThemeProvider  } from '@mui/material/styles';
import { Provider } from 'react-redux';
import "./styles/app.css";
import Api from './AxiosInstance';
import { store } from './redux/store';


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
  breakpoints:{
    values: {
      xs: 0,
      sm: 600,
      md: 1000,
      lg: 1200,
      xl: 1536,
    }
  },
  components:{
    MuiInputLabel:{
      styleOverrides:{
        '& .MuiFormLabel-root.Mui-disabled': {
          color: 'red',
        },
        
      }}
    
  }

  
});





ReactDOM.render(
  <Provider store={store}>
  <ThemeProvider theme={theme}>
    <Base />
  </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

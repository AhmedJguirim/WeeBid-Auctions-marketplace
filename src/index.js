
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom';
import Base from './components/base/Base.js';
import React from 'react'
import { createTheme, ThemeProvider  } from '@mui/material/styles';
import { Provider } from 'react-redux';
import "./styles/app.css";
import { store } from './redux/store';



const colorCollection = {
  main: {
    primary:'#FCF8FF',
    secondary: "#362B48",
    info: "#5927E5"
  },
  light:{
    primary:'#FCF8FF',
    secondary: "#362B48",
    info: "#5927E5"
  },
  dark: {
    primary:'#362B48',
    secondary: "#FCF8FF",
    info: "#5927E5"
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: colorCollection.main.primary,
      dark: colorCollection.dark.primary,
      light: colorCollection.light.primary
    },
    secondary: {
      main: colorCollection.main.secondary,
      dark: colorCollection.dark.secondary,
      light: colorCollection.light.secondary
    },
    info: {
      main: colorCollection.main.info,
      dark: colorCollection.dark.info,
      light: colorCollection.light.info
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
          root:
          {marginTop: 20,
            "&.Mui-focused" :{
            color:colorCollection.main.secondary,
            backgroundColor:colorCollection.main.primary
          }},
        },     
      },
      MuiInputBase:{
        styleOverrides:{
            root:
              {marginTop: 20
                ,"&.Mui-focused" :{
              border:"1px solid #362B48"
            }},
          },
          
        },
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

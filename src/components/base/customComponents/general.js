import { Grid, AppBar, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";

export const TopNavGrid = styled(Grid)(() => ({
  display: "flex",
  paddingLeft: "20px",
  alignItems: "center",
  alignContent: "space-between",
}));
export const TopAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    // width: `calc(100% - ${drawerWidth}px)`,
    // marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const ArticleImage = styled("img")(({ theme }) => ({
  margin:"10px 40px 40px 40px",
  width:"80%"
}));
export const ArticleSubImage = styled("img")(({ theme }) => ({
  maxWidth: 100,
}));

// export const errorDiv = styled('div')(({theme})=>{
//   color: theme.palette.mode.
// })

export const FormTextField = styled(TextField)(({ theme }) => ({
  marginTop: 8,
}));
export const FooterLink = styled(Link)(({ theme }) => ({
  marginTop:"25%",
textDecoration: "none",
fontWeight: "bold",
color: "secondary.main",
fontSize:15,
fontFamily: `"Roboto,"Helvetica","Arial",sans-serif"`,
}));

export const ButtonStyles = {
  color: "secondary.main",
  border: "1px solid black",
  "&:hover": {
    backgroundColor: "secondary.main",
    color: "primary.main",
  },
};
export const pinkish= {
  backgroundColor: "#f4ebf5",
}
export const mainContainer = {
  margin: "2%",
  width:"98%"
}
export const darkContainer = {
  padding: 4,
  borderRadius: 10,
  backgroundColor: "secondary.main",
  color: "primary.main",
};

export const formContainer = {

    width: "60%",
    display: "blocks",
    mr: "auto",
    ml: "auto",
    mt:"2%",
    border: "1px solid black",
    padding: "40px",
    minWidth: "540px",
    borderRadius: "10px",
    transition: "all 0.4s ease",
    backgroundColor:"primary.main",

}

export const formBox = {
  marginTop: 8,
};

export const lightContainer = {
  backgroundColor: "primary.main",
  color: "secondary.main",
  padding: 4,
  margin:5,
};
export const expriredContainer = {
  backgroundColor: "secondary.main",
  color: "primary.main",
  padding: 4,
  margin:4,
  width:"100%",
  textAlign:"center"
}

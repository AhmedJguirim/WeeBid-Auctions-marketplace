import { Grid, AppBar, TextField } from "@mui/material";
import { styled } from "@mui/system";

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
export const ButtonStyles = {
  color: "secondary.main",
  border: "1px solid black",
  "&:hover": {
    backgroundColor: "secondary.main",
    color: "primary.main",
  },
};
export const pinkish= {
  backgroundColor: "#f4ebf5"
}
export const darkContainer = {
  padding: 4,
  borderRadius: 10,
  backgroundColor: "secondary.main",
  color: "primary.main",
};

export const formBox = {
  marginTop: 8,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
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


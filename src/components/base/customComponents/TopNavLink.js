import React from "react";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";


export const CustomLink = styled(Link)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
  textDecoration: "none",
  paddingLeft: 20,
  paddingRight: 20,
  borderRadius: 25,
  fontSize:20,
  fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
  "&:hover": {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.primary.main
  }
}));
const TopNavLink = ({text, path}) => {
    return (
      <CustomLink to={path} sx={{color:"secondary.main"}} >
        {text}
      </CustomLink>
  )

};

export default TopNavLink;

import React from "react";
import { styled } from "@mui/system";
import { Link } from "@mui/material";

const TopNavLink = (props) => {
  const CustomLink = styled(Link)(({ theme }) => ({
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 25,
    "&:hover": {
      backgroundColor: theme.palette.info.main,
      color: theme.palette.primary.main
    }


  }));
    return (
      <CustomLink variant={"h6"} href="#" underline="none" sx={{color:"secondary.main"}}>
        {props.text}
      </CustomLink>
  )

};

export default TopNavLink;

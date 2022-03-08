import { Avatar, IconButton, Grid, Typography } from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { darkContainer } from "./base/customComponents/general";
import API from "../AxiosInstance";


const UserProfile = () => {
  //#region form data state
  const [date, setDate] = React.useState(new Date());
  const [name, setName] = React.useState("");
  const [telephone, setTelephone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  //#endregion

  //#region state manipulation mathods

  const handleName = (event) => {
    setName(event.target.value);
  };
  const handleTelephone = (event) => {
    setTelephone(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleDisplayName = (event) => {
    setDisplayName(event.target.value);
  };
  //#endregion

  //get user and set it to state
  const [user, setUser] = React.useState({});
  async function getUser() {
    try {
      const response = await API.get(`userdata`);
      const data = response["data"];
      console.log(data)
      setUser({
        name: data.name,
        username: data.displayName,
        email: data.email,
        password: "******",
        telephone: data.telephone,
        birthDate: data.birthDate.slice(0,10),
      });
    } catch (error) {
      console.error(error);
    }
  }

  // const userData = {
  //   name: "name",
  //   displayName: "displayName",
  //   email: "email",
  //   password: "password",
  //   telephone: "telephone",
  //   avatar: "demo",
  //   birthDate: "date",
  // };

  const handleClick = () => {
    setIsEditing(true);
    //TODO: editing display and logic , an idea is to make display none/visible textFields and add edite fields to an object then put on submit (use the sstates up)
    console.log("work under construction");
  };
  React.useEffect(() => {
    getUser();
  }, []);

  if (isEditing === false) {
    return (
      <Grid container sx={darkContainer}>
        {/* title */}
        <Grid container>
          <Grid item xs={1}>
            <Avatar>AH</Avatar>
          </Grid>
          <Grid item xs={3.5} sx={{ textAlign: "left" }}>
            <Typography variant="h2">{user.displayName}</Typography>{" "}
          </Grid>
        </Grid>
        <Grid item xs={9} sx={{ mt: 5 }}>
          {Object.keys(user).map((key, index) => (
            <Grid container key={index}>
              <Grid item xs={6}>
                {" "}
                <Typography variant="h4">{key}:</Typography>
              </Grid>
              <Grid item xs={5}>
                {" "}
                <Typography variant="h4">{user[key]}</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={handleClick}>
                  <EditIcon color="primary" size="large" />{" "}
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid Container sx={darkContainer}>
        {/* title */}
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={1}>
              <Avatar>AH</Avatar>
            </Grid>
            <Grid item xs={3.5} sx={{ textAlign: "left" }}>
              <Typography variant="h2">{user.displayName}</Typography>{" "}
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={handleClick}>
                <EditIcon color="primary" size="large" />{" "}
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={6} sx={{ mt: 5 }}>
            {Object.keys(user).map((key, index) => (
              <Grid container key={index}>
                <Grid item xs={6}>
                  {" "}
                  <Typography variant="h4">{key}:</Typography>
                </Grid>
                <Grid item xs={6}>
                  {" "}
                  <Typography variant="h4">{user[key]}</Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    );
  }
};

export default UserProfile;

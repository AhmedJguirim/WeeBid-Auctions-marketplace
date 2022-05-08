import {
  Avatar,
  IconButton,
  Grid,
  Typography,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { lightContainer } from "./base/customComponents/general";
import API from "../AxiosInstance";
import { Box } from "@mui/system";
import { ButtonStyles } from "./base/customComponents/general";
import { apiRoutes } from "../config/routes";
import { useSelector } from "react-redux";
import { pinkish } from "./base/customComponents/general";

const UserProfile = () => {
  const myUser = useSelector((state) => state.user);
  //#region form data state
  const [avatar, setAvatar] = React.useState("");
  const [isEditing, setIsEditing] = React.useState("");
  const [modification, setModification] = React.useState("");
  //#endregion

  //#region dialog manipulation
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //#endregion
  //#region state manipulation mathods


  const handleModification = (event) => {
    setModification(event.target.value);
  };
  //#endregion

  //get user and set it to state
  const [user, setUser] = React.useState({});
  async function getUser() {
    try {
      const response = await API.get(`userdata`);
      const data = response["data"];
      console.log(data);
      setUser({
        name: data.name,
        displayName: data.displayName,
        email: data.email,
        password: "******",
        telephone: data.telephone,
        birthDate: data.birthDate.slice(0, 10),
      });
      let path = "http://127.0.0.1:8000/user/";
      const myImg = path.concat(data.image);
      setAvatar(myImg)
      console.log(`http://127.0.0.1:8000/${data.image}`)
    } catch (error) {
      console.error(error);
    }
  }

  const submitHandler = (event) => {
event.preventDefault();
    console.log("under construction");
    let data = {}
    data[isEditing] = modification

    console.log(data)
    if(isEditing==="password"){
      API.put(`${apiRoutes.API}/putPassword/${myUser.id}`,data).then(res=>getUser()).catch(err=>console.log(err))
    }else{
      API.put(`${apiRoutes.API}/users/${myUser.id}`,data).then(res=>getUser()).catch(err=>console.log(err))
    }

    handleClose()
  };
  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <Grid container sx={pinkish}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">changer {isEditing} </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={submitHandler}>
            <TextField
              fullWidth
              required
              id="modification"
              label="modification"
              value={modification}
              onChange={handleModification}
            />
            <Button type="submit" sx={ButtonStyles}>submit</Button>
            <Button
            sx={ButtonStyles}
            onClick={() => {
              handleClose();
            }}
          >
            Disagree
          </Button>
          </Box>
        </DialogContent>
      </Dialog>
      {/* title */}
      <Grid container>
      {/* <Grid xs={12}><Typography variant="h2">buttons for functionalities and things TODO //////////////////////////////////////</Typography>{" "}<br /><br /></Grid> */}
        <Grid item xs={3} sx={{ textAlign: "left"}}>
        <Card >
              <CardContent>
                <Box >
              <Avatar sx={{ width: "100%", height: "100%" }} alt="avatar" src={avatar}/>
              </Box>
               <Box sx={{ textAlign: "center"}}><Typography variant="h2">{user.displayName}</Typography>{" "}</Box>
                
              </CardContent></Card>
        </Grid>
        <Grid item xs={1}>
          
        </Grid>
      
      <Grid item xs={7} sx={{ mt: 5 }}>
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
            <Grid item >
              <IconButton
                onClick={() => {
                  handleClickOpen();
                  setIsEditing(key);
                }}
                id={key}
              >
                <EditIcon color="secondary" size="large" />{" "}
              </IconButton>
            </Grid>
          </Grid>
        ))}
        {/* <Grid xs={12}><Typography variant="h2">LISTINGS OF auctions TODOOOO ////</Typography>{" "}<br /><br /></Grid> */}
      </Grid>
    </Grid>
    </Grid>
  );
};

export default UserProfile;

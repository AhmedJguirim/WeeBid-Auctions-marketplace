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
} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { darkContainer } from "./base/customComponents/general";
import API from "../AxiosInstance";
import { Box } from "@mui/system";
import { ButtonStyles } from "./base/customComponents/general";
import { apiRoutes } from "../config/routes";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const myUser = useSelector((state) => state.user);
  //#region form data state

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
        username: data.displayName,
        email: data.email,
        password: "******",
        telephone: data.telephone,
        birthDate: data.birthDate.slice(0, 10),
      });
    } catch (error) {
      console.error(error);
    }
  }
  //TODO add custom passowrd put

  const submitHandler = (event) => {
event.preventDefault();
    console.log("under construction");
    let data = {}
    data[isEditing] = modification
    API.put(`${apiRoutes.API}/users/${myUser.id}`,data).then(res=>getUser()).catch(err=>console.log(err))
    handleClose()
  };
  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <Grid container sx={darkContainer}>
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
              <IconButton
                onClick={() => {
                  handleClickOpen();
                  setIsEditing(key);
                }}
                id={key}
              >
                <EditIcon color="primary" size="large" />{" "}
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default UserProfile;

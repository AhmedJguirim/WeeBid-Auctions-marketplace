import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsNoneTwoToneIcon from "@mui/icons-material/NotificationsNoneTwoTone";
import { Card, CardContent, IconButton, Slide, Snackbar, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Socket from "./Socket";
import { newNotifications } from "../../../redux/actions";
import { useNavigate } from "react-router-dom";
import TopNavLink from "./TopNavLink";


function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}
export default function NotificationsMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackText, setSnackText] = React.useState("");
  const transition = TransitionUp;


  const notifications = useSelector((state) => state.notifications);
  Socket.on("connect", () => {
    Socket.on("NOTIFICATION", (notification) => {
      dispatch(newNotifications(notification));
      console.log("notified");
      setSnackText(notification.title)
      setOpenSnack(true)
    });
  });

  const handleCloseSnack = () => {
    setOpenSnack(false);
  };



  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
      days = Math.floor(duration / (1000 * 60 * 60) / 24);
    days = days < 1 ? "" : days + "d,";
    hours = (hours-2) < 1 ? "" : (hours-2) + "h,";
    minutes = minutes < 1 ? "" : minutes + "m";
    seconds = seconds < 1 ? "" : seconds;
    if(days<1 && hours <1 &&minutes < 1){
      return "just now"
    }

    return days + hours + minutes;
  }

  return (
    <div>
{/* TODO MAKE A PROMISE THAT WAITS 4 SECONDS THEN REMOVES THE SNACK AND MAKE IT REDIRECT USER ON CLICK */}
        <Snackbar
        open={openSnack}
        onClick={handleCloseSnack}
        message={snackText}
        key={transition ? transition.name : ''}
      />
      <IconButton
        size="large"
        edge="end"
        sx={{ ml: "0.5%" }}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <NotificationsNoneTwoToneIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {Object.keys(notifications).map((key, index) => (
          <MenuItem value={notifications[key].id} key={index} >
            <Card variant="outlined" onClick={()=>navigate(`/${notifications[key].type}/${notifications[key].route}`)}>
              <CardContent>
                <Typography variant="h6" color="secondary">
                  {notifications[key].title}
                </Typography>
                <Typography>{notifications[key].description}</Typography>
                <Typography>
                  {msToTime(
                    Math.abs(new Date() - new Date(notifications[key].date))
                  )}
                </Typography>
              </CardContent>
            </Card>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

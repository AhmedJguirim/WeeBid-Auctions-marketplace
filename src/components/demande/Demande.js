import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { apiRoutes, navRoutes } from "../../config/routes";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Api from "../../AxiosInstance";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { ButtonStyles } from "../base/customComponents/general";
import Socket from "../base/customComponents/Socket";
import { CategoryLink, CustomLink } from "../base/customComponents/TopNavLink";

let cancelToken;

const Demande = () => {

  const navigate = useNavigate();

  const myUser = useSelector((state) => state.user);
  //id of demande
  let { id } = useParams();

  //name and photo of transmitter
  const [transmitter, setTransmitter] = React.useState({});
  const [demande, setDemande] = React.useState({});



  async function getDemande() {
    try {
      const response = await axios.get(`${apiRoutes.API}/demande_devis/${id}`);
      console.log(response["data"]);
      setDemande(response["data"]);
      let path = "http://127.0.0.1:8000/user/";
      const myImg = path.concat(response["data"].transmitter.image);
      console.log(response["data"])
      setTransmitter({
        id:response["data"].transmitter.id,
        displayName: response["data"].transmitter.displayName,
        avatar: myImg,
      });
    } catch (error) {
      console.error(error);
    }
  }
  const styles = {
    mainContainer : { backgroundColor: "primary.main" , width: "90%", margin:"5% auto"},
    submitButton: {...ButtonStyles,float:"right", mr:"5%", mt:"1%"}
  }


  //#region form data state
  //l'enchere proposé
  const [enchere, setEnchere] = React.useState("");
  //#endregion

  //#region search bar code
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleInput = async (event) => {
    setOptions([]);
    setInput(event.target.value);
    setLoading(true);
    //Check if there are any previous pending requests
    if (cancelToken !== undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }
    //Save the cancel token for the current request
    cancelToken = axios.CancelToken.source();
    try {
      const response = await axios.get(`${apiRoutes.API}/encheres/search`, {
        params: {
          page: "1",
          "article.name": input,
        },
        cancelToken: cancelToken.token,
      });
      console.log("requested");
      preparation(response["data"]["hydra:member"]);
    } catch (error) {
      console.log(error);
    }
  };

  function preparation(data) {
    let searchResult = [];
    data.map((value, index) => {
      searchResult.push({
        id: value.id,
        enchere: `api/encheres/${value.id}`,
        name: value.article.name,
      });
    });
    setOptions(searchResult);
    setLoading(false);
  }

  //#endregion

  const handleSubmit = () => {
    Api.post(`${apiRoutes.API}/propositions`, {
      enchere: enchere,
      transmitter: `/api/users/${myUser.id}`,
      transmittedTo: demande.transmitter["@id"],
    })
      .then((res) => {
        console.log(`demande ${res["data"]["@id"]} transmitted`);
        console.log(res["data"]);
        //send notification
        Socket.emit("PROPOSITION", res["data"]);
        navigate('/');

      })
      .catch((err) => console.log(demande.transmitter["@id"]));
  };

  React.useEffect(() => {
    getDemande();
  }, [id]);
  return (
    <Grid container sx={styles.mainContainer}>

      {/* USER CARD */}
      <Grid item xs={4}>
        <Grid container>
          <Grid item xs={12} sx={{ textAlign: "left" }}>
            <Card sx={{ width: "80%", height: "100%" }}>
              <CardContent>
                <Box>
                  <Avatar
                    sx={{ width: "100%", height: "100%" }}
                    alt="avatar"
                    src={transmitter.avatar}
                  />
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <CustomLink to={`${navRoutes.CONSULTUSER}/${transmitter.id}`}>{transmitter.displayName}</CustomLink>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Grid>

          {/* DEMANDE DATA SECTION */}
          <Grid item xs={4}>
            <Grid container sx={{mt:"30%"}}>
              <Grid item xs={6}>
                <Typography variant="h4" color={"secondary.main"}>quantité:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{demande.quantity}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" color={"secondary.main"}>description:</Typography>
              </Grid>
              <Grid item xs={6} mt={0.5}>
                <Typography>
                  {demande.descriptionArticle}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

      
      <Grid item xs={4}>
        {/* TODO: add the option to reject and an "are you sure dialog" */}
        <Box sx={{mt:"30%"}}>
        <Typography>proposez un enchère pour le transmetteur</Typography>
        {/* search */}
        <Autocomplete
          id="seachBar"
          sx={{ width: "95%", mt:"1%" }}
          filterOptions={(x) => x}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          isOptionEqualToValue={(option, value) => true}
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            );
          }}
          options={options}
          loading={loading}
          onChange={(event, option) => {
            setEnchere(option.enchere);
            console.log(option);
            setEnchere(option.enchere);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="cherchez"
              value={input}
              onChange={handleInput}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        <Button onClick={handleSubmit} sx={styles.submitButton}>
          Sousmettre
        </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Demande;

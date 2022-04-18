import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { apiRoutes, navRoutes } from "../../config/routes";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Api from "../../AxiosInstance";
import { Button, Grid, Typography } from "@mui/material";
import { ButtonStyles } from "../base/customComponents/general";
import Socket from "../base/customComponents/Socket";

let cancelToken;
const Demande = () => {
  const myUser = useSelector((state) => state.user);
  let { id } = useParams();

  //get demande and set it to state
  const [demande, setDemande] = React.useState({});
  async function getDemande() {
    try {
      const response = await axios.get(`${apiRoutes.API}/demande_devis/${id}`);
      console.log(response["data"])
      setDemande(response["data"]);
    } catch (error) {
      console.error(error);
    }
  }
  //#region form data state
  const [enchere, setEnchere] = React.useState("");
  //#endregion

  // search
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

  //TODO add custom passowrd put
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
      })
      .catch((err) => console.log(demande.transmitter["@id"]));
  };

  React.useEffect(() => {
    getDemande();
  }, [id]);
  return (
    <Grid container>
      <Grid item xs={6}>
        <Grid container>
          <Grid item xs={12}>
          {/* TODO fix the fact that demande.transmitter.displayName is undefinedfor some reason */}
            {/* <Typography variant="h2">{demande.transmitter.displayName}</Typography> */}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h4">quantity:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">{demande.quantity}</Typography>
          </Grid>
          <Grid item xs={6}>
          <Typography variant="h4">description:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">{demande.descriptionArticle}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
          {/* TODO: add the option to reject and an "are you sure dialog" */}
        <Typography>proposez!</Typography>
        {/* search */}
        <Autocomplete
          id="seachBar"
          sx={{ width: 300 }}
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
          onChange={(event,option) => {
            setEnchere(option.enchere);
            console.log(option)
            setEnchere(option.enchere)
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
        <Button onClick={handleSubmit} sx={ButtonStyles}>submit</Button>
      </Grid>
    </Grid>
  );
};

export default Demande;

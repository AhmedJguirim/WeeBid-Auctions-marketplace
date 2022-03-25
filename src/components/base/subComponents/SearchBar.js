import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { apiRoutes, navRoutes } from "../../../config/routes";
import axios from "axios";
import { useNavigate } from "react-router-dom";


let cancelToken;
export default function SearchBar({ type }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  

  let navigate = useNavigate();
  
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
        const response = await axios.get(
          `${apiRoutes.API}${type}/search`, {
            params: {
              page: "1",
              "article.name": input,
            },
            cancelToken: cancelToken.token,
          }
        );
        console.log("requested");
        preparation(response["data"]["hydra:member"]);
      } catch (error) {
        console.log(error);
      }
    };


  function preparation(data) {
    let searchResult = [];

    data.map((value, index) => {
      if (type === "/enchere_inverses")
        searchResult.push({
          id: value.id,
          link: `${navRoutes.ENCHEREINVERSE}/${value.id}`,
          name: value.article.name,
        });
      else {
        searchResult.push({
          id: value.id,
          link: `${navRoutes.ENCHERE}/${value.id}`,
          name: value.article.name,
        });
      }
      
    });

    setOptions(searchResult);
    setLoading(false);
  }

  return (
    // TODO: adjust the height of the input
    <Autocomplete
      id="seachBar"
      sx={{ width: 300 , marginTop:0}}
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
        console.log(option.link);
        navigate(option.link);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{mt:0}}
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
  );
        
        }
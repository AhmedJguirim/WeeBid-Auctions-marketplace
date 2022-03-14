import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { search } from '../customComponents/Utils';
import { apiRoutes , navRoutes } from '../../../config/routes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function SearchBar({type}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [data, setData] = React.useState({})
  const [input, setInput]= React.useState("");
  const [loading, setLoading]= React.useState(false)
  let source = axios.CancelToken.source();

  let navigate = useNavigate();

  const handleInput = async (event)=>{

        setOptions([])
        setInput(event.target.value);
        setLoading(true)
        getOptions()

  }

    //#region getting encheres ou encheres inverses

      
      function getOptions() {
          setLoading(true)
          setOptions([])
        axios.get(`${apiRoutes.API}${type}/search`, {
          params: {
            page: "1",
            "article.name": input
          },
          cancelToken: source.token
        })
        .then(function (response) {
          console.log(response)
          console.log("requested")
          preparation(response["data"]["hydra:member"]);
        }).catch(error=>console.log(error))
      }
      //#endregion

      function preparation(data){
        let searchResult = [];
        
        data.map((value, index)=>{
          if(type==="/enchere_inverses")
            searchResult.push({
                id: value.id,
                link: `${navRoutes.ENCHEREINVERSE}/${value.id}`,
                name: value.article.name,
            })
          else{
            searchResult.push({
              id: value.id,
              link: `${navRoutes.ENCHERE}/${value.id}`,
              name: value.article.name,
          })
          }

        })
        
        setOptions(searchResult)
        console.log(options)
        setLoading(false)
      }


  return (
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
      isOptionEqualToValue={(option, value) => option.id === value.id}
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
        console.log(option.link)
        navigate(option.link);
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
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

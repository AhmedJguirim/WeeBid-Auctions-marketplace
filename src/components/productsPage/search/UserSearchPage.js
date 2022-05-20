import { Avatar, Card, CardContent, Checkbox, Grid, Pagination, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../../generalComponents/ProductsListing';
import axios from 'axios';
import { apiRoutes, navRoutes } from '../../../config/routes';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import { CategoryLink } from '../../base/customComponents/TopNavLink';

const UserSearchPage = () => {
  const [users, setUsers] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [pagesNumber, setPageNumber] = React.useState(1);

  const styles = {
    usersGrid: { 
      backgroundColor: "primary.main" , 
      padding: 3,
      mt: 2
    },
  }

  let { search } = useParams();
  function getPagesNumber() {
      axios
      .get(`${apiRoutes.API}/users/pages`, {
        params: {
            "displayName": search,
          "endDate[after]": new Date(),
        },
      })
      .then((res) => {
        if (res["data"]["hydra:member"].length / 12 < 1) {
          setPageNumber(1);
        } else {
          setPageNumber(Math.ceil(res["data"]["hydra:member"].length / 12));
        }
      });}
  
  function getUsers() {

    axios.get(`${apiRoutes.API}/users`, {
      params: {
        "displayName": search,
        page: page,
        "endDate[after]": new Date(),
      }
    })
    .then(function (response) {
      setUsers(response["data"]["hydra:member"]);
    }).catch(error=>console.log(error))

  }

  const handlePagination = (event, value) => {
    setPage(value);
  };


  React.useEffect(()=>{
    getUsers()
    getPagesNumber();
  },[])
  React.useEffect(() => {
    getUsers();
  }, [page]);

      return (
        <Grid container>
          <Grid container>
        <Grid item xs={7}>
        <Typography variant='h3'>resultat de recherche "{search}"</Typography>
        </Grid>
        
      </Grid>
      <Grid container spacing={3} sx={styles.usersGrid}>
      {Object.keys(users).map((key, index) => (<Grid item xs={2.4} sx={{ textAlign: "left"}}>
        <Card >
              <CardContent>
                <Box >
              <Avatar sx={{ width: "100%", height: "100%" }} alt="avatar" src={`http://127.0.0.1:8000/user/${users[key].image}`}/>
              </Box>
               <Box sx={{ textAlign: "center"}}><CategoryLink to={`${navRoutes.CONSULTUSER}/${users[key].id}`}>{users[key].displayName}</CategoryLink>{" "}</Box>
                
              </CardContent></Card>
        </Grid>))}
        </Grid>

            <Pagination
        count={pagesNumber}
        onChange={handlePagination}
        color="secondary"
      />
        </Grid>
      )
}

export default UserSearchPage
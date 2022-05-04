import { Button, Container, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ButtonStyles } from './general'

const NotFound = () => {

    let navigate = useNavigate();
    const home = ()=>{
        navigate('/')
    }
  return (
      <Container sx={{textAlign: "center",}}>
    <Typography sx={{fontSize:300}}>404</Typography>
    <Typography variant='h4'>oops ..</Typography>
    <Typography variant='h6'>page non trouvé</Typography>
    <Button variant="contained" sx={ButtonStyles} onClick={home}>page de guarde</Button>
    </Container>
  )
}

export default NotFound
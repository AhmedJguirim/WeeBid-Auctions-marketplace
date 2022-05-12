import { Box, Typography } from '@mui/material'
import React from 'react'
import { pinkish } from './general'

const NoListing = ({text}) => {
  return (
    <Box sx={{...pinkish, width:"98%",pt:"3%",pb:"3%", textAlign:"center"}}  > <Typography variant="h2">{text}</Typography></Box>
  )
}

export default NoListing
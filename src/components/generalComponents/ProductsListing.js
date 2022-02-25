import { Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import demoListImage from "../../media/images/demoListImage.png";

const styles = {
    productsTypography:{
        mt:3
    },
    productsGrid: { 
        backgroundColor: "primary.main" , 
        padding: 3,
        mt: 2
      }
}
const ProductsListing = ({ventes ,elemsPerLine}) => {
    
  return (
    <Grid container sx={{...styles.productsGrid, textAlign: "center"}} spacing={3}>
          {Object.keys(ventes).map((key, index) => (
            <Grid item xs={12/elemsPerLine} key={key}>
            <Card key={index} >
              <CardContent>
                <img src={demoListImage} className="cardImage" />
                  <Typography sx={styles.productsTypography} variant="h5">{ventes[key].nom}</Typography>
                    <Typography sx={styles.productsTypography}>
                    {ventes[key].vendeur}
                  </Typography>
                  <Typography sx={styles.productsTypography}>
                    {ventes[key].prix}
                  </Typography>
                
              </CardContent>
            </Card>
            </Grid>
          ))}
        </Grid>
  )
}

export default ProductsListing
import { Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';
import demoListImage from "../../media/images/demoListImage.png";



const styles = {
    productsTypography:{
        mt:3
    },
    productsGrid: { 
        backgroundColor: "primary.main" , 
        padding: 3,
        mt: 2
      },
    productLink:{
      textDecoration: "none",
      fontSize:20,
      fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
    }
}
const ProductsListing = ({ventes ,elemsPerLine}) => {
    // TODO: create links that don't get invisible in small screens like topnav ones

  return (
    <Grid container sx={{...styles.productsGrid, textAlign: "center"}} spacing={3}>
          {Object.keys(ventes).map((key, index) => (
            <Grid item xs={12/elemsPerLine} key={key}>
            <Card key={index} >
              <CardContent>
                <img src={demoListImage} className="cardImage" />
                <br />
                  <Link style={styles.productLink} to={`/enchere/${ventes[key].id}`} >{ventes[key].article.name}</Link>
                  <Typography sx={styles.productsTypography}>
                    quantité: {ventes[key].quantity}
                  </Typography>
                    <Typography sx={styles.productsTypography}>
                      {/* TODO: make a link to user profile */}
                    par: {ventes[key].user.displayName}
                  </Typography>
                  <Typography sx={styles.productsTypography}>
                    {ventes[key].currentPrice} TND
                  </Typography>
                  <Typography sx={styles.productsTypography}>
                    {ventes[key].endDate.substring(0,10)}
                  </Typography>
                
              </CardContent>
            </Card>
            </Grid>
          ))}
        </Grid>
  )
}

export default ProductsListing
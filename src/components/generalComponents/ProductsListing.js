import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';
import { navRoutes } from '../../config/routes';
import demoListImage from "../../media/images/demoListImage.png";
import Countdown from '../base/customComponents/Countdown';
import NoListing from '../base/customComponents/NoListing';





const ProductsListing = ({ventes ,elemsPerLine , type}) => {
    // TODO: create links that don't get invisible in small screens like topnav ones
    const styles = {
      productsTypography:{
        fontSize:15
      },
      cardImage:{maxWidth:"90%" ,maxHeight:"90%" , display:"blocks", ml:"auto", mr:"auto", mt:"5%"},
        productsGrid: { 
            backgroundColor: "primary.main" , 
            padding: 3,
            mt: 2
          },
        productLink:{
          marginTop:"25%",
          textDecoration: "none",
          fontWeight: "bold",
          color: "secondary.main",
          fontSize:15,
          fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
        }
    }
  return (
    <Grid container sx={{...styles.productsGrid, textAlign:"center"}} spacing={3}>
          {Object.keys(ventes).map((key, index) => (
            <Grid item xs={12/elemsPerLine} key={key}>
            <Card key={index}  >
            
              
              {ventes[key].article.documents[0]?(
              <CardMedia 
              component="img"
              sx={styles.cardImage}
              image={`http://127.0.0.1:8000${ventes[key].article.documents[0].contentUrl}`}
              />)
              :  (<CardMedia 
              component="img"
              sx={styles.cardImage}
              image={demoListImage}
              />)}
              <CardContent>
                
                
                <br />
                  <Link style={styles.productLink} to={`${type}/${ventes[key].id}`} >{ventes[key].article.name}</Link>
                  <Typography sx={{...styles.productsTypography,mt:"2%"}}>
                    quantité: {ventes[key].quantity}
                  </Typography> 
                  <Typography sx={{...styles.productsTypography,mt:"10%"}}>
                    {ventes[key].currentPrice} TND
                  </Typography>
                    <Typography sx={{...styles.productsTypography}}>
                      {/* TODO: make a link to user profile */}
                    par:<Link style={styles.productLink} to={`${navRoutes.CONSULTUSER}/${ventes[key].user.id}`} >{ventes[key].user.displayName}</Link> 
                  </Typography>
                  
                  
                    <Countdown endDate={ventes[key].endDate} startDate={ventes[key].startDate} />

                
              </CardContent>
            </Card>
            </Grid>
          ))}
          {!ventes[0] && <NoListing text={`il n y a pas d'articles disponibles pour le moment`}/>}
        </Grid>
  )
}

export default ProductsListing
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import image from "../../media/images/homepageTopImage.jpg";
import Api from "../../AxiosInstance";
import HomePageList from "../generalComponents/ProductsListing";




const styles = {
  subDiv: {
    maxWidth: "100%",
    minHeight: 500,
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  generalText: {
    textAlign: "center",
  },
  textDiv: {
    width: "60%",
  },
  servicesHr: {
    margin: "auto",
    width: 70,
    position: "relative",
    borderTop: "2px solid info.main",
    marginTop: 5,
  },
  mainDiv: {
    backgroundColor: "primary.main",
    padding: 0,
  },
  servicesGrid: {
    justifyContent: "space-between",
    width: "70%",
    margin: "auto",
  },
  sectionBox:{
    mt: "10%", textAlign: "center" ,
  }
};

const Homepage = () => {
  //#region get encheres inverses 
const [encheresInverses, setEnchereInverses] = React.useState({});

  
function getEnchereInverses() {
  Api.get('/enchere_inverses', {
    params: {
      page: "1",
    }
  })
  .then(function (response) {
    setEnchereInverses(response["data"]["hydra:member"].slice(0,4));
  }).catch(error=>console.log(error))
}
//#endregion

//#region get encheres
const [encheres, setEncheres] = React.useState({});

  
  function getEncheres() {
    Api.get('/encheres', {
      params: {
        page: "1",
      }
    })
    .then(function (response) {
      setEncheres(response["data"]["hydra:member"].slice(0,4));
    }).catch(error=>console.log(error))
  }
//#endregion

//TODO: get ventes
React.useEffect(()=>{
  getEncheres()
  getEnchereInverses()
},[])

  return (
    <Box sx={styles.mainDiv}>
      {/* section #1 */}
      <Box sx={styles.subDiv}>
        <Container sx={styles.textDiv}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{ ...styles.generalText, fontWeight: "bolder" }}
          >
            bienvenu a notre marketplace
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ ...styles.generalText, mt: "30%" }}
          >
            ici vous pouvez trouver les produits rares et communs, et vous
            pouvez aussi deposer votre produit dans un enchère pour un benefice
            maximal, et on a beaucoup plus a offrir !
          </Typography>
        </Container>
      </Box>

      {/* section #2 */}
      <Box sx={styles.sectionBox}>
        <Container>
          <Typography variant="h2">NOS SERVICES</Typography>
          <hr style={styles.servicesHr} />
        </Container>
        <br />
        <br />

        <Grid container sx={styles.servicesGrid}>
          <Grid item xs={3}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5">enchères</Typography>
                <Typography>
                  enchérer competetivement pour acheter un produit
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5">enchères inversés</Typography>
                <Typography>
                  enchérer competetivement pour vendre un produit
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5">demande de devis</Typography>
                <Typography>
                  demander d'un fournisseur une proposition sur un produit
                  specifique
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      {/* section #3 */}
      <Box sx={{...styles.sectionBox, backgroundColor:"primary.main" }}>
        {/* put ventes here */}
        {/* <Typography variant="h4" color='secondary.main'>nos produits</Typography>
        <HomePageList ventes={ventes} elemsPerLine={8} /> */}
        <Grid container >
          <Grid item xs={5.5}>
            <Typography variant="h4" color='secondary.main'>nos enchères</Typography>
            <HomePageList ventes={encheres} elemsPerLine={4} />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={5.5}>
            <Typography variant="h4" color='secondary.main'>nos enchères inverses</Typography>
            <HomePageList ventes={encheresInverses} elemsPerLine={4} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Homepage;

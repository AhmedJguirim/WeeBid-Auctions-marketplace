import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import image from "../../media/images/auction.jpg";
import axios from "axios";
import HomePageList from "../generalComponents/ProductsListing";
import { apiRoutes, navRoutes } from "../../config/routes";
import StorefrontTwoToneIcon from "@mui/icons-material/StorefrontTwoTone";
import LocalMallTwoToneIcon from "@mui/icons-material/LocalMallTwoTone";
import RequestQuoteTwoToneIcon from "@mui/icons-material/RequestQuoteTwoTone";
import logo from "../../media/images/dotItLogo.png"
// import { pinkish } from "../base/customComponents/general";
import { CategoryLink } from "../base/customComponents/TopNavLink";
// import NoListing from "../base/customComponents/NoListing";

const styles = {
  subDiv: {
    maxWidth: "100%",
    paddingTop: "5%",
    backgroundColor: "secondary.main",
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
    backgroundColor:  "#f4ebf5"
  },
  sectionBox: {
    marginTop: "5%",
    paddingTop: "5%",
    textAlign: "center",
    
  },
};

const Homepage = () => {

  //#region get encheres inverses
  const [encheresInverses, setEnchereInverses] = React.useState({});
  const [count, setCount] = React.useState({})
var today = new Date();

  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  function getEnchereInverses() {
    axios
      .get(`${apiRoutes.API}/enchere_inverses/getEight`, {
        params: {
          page: "1",
          "endDate[after]": date,
        },
      })
      .then(function (response) {
        console.log(date)
        setEnchereInverses(response["data"]["hydra:member"]);
        console.log(response["data"]["hydra:member"]);
      })
      .catch((error) => console.log(error));
  }

  //#endregion

  function getCount() {
    axios
      .get(`${apiRoutes.API}/count`)
      .then(function (response) {
        setCount({'enchere': response["data"]["hydra:member"][0],'enchereInverse': response["data"]["hydra:member"][1],'user': response["data"]["hydra:member"][2]})
      })
      .catch((error) => console.log(error));
  }
  //#region get encheres
  const [encheres, setEncheres] = React.useState({});

  function getEncheres() {
    axios
      .get(`${apiRoutes.API}/encheres/getEight`, {
        params: {
          page: "1",
          "endDate[after]": date,
        },
      })
      .then(function (response) {
        setEncheres(response["data"]["hydra:member"]);
        console.log(response["data"]["hydra:member"])
      })
      .catch((error) => console.log(error));
  }
  //#endregion

  
  React.useEffect(() => {
    getEncheres();
    getEnchereInverses();
    getCount();
  }, []);

  return (
    <Box sx={styles.mainDiv}>
      {/* section #1 */}
      {/* TODO don't keep your style thrown everywhere */}
      <Box sx={styles.subDiv}>
        <Container sx={styles.textDiv}>
          <Grid item xs={12}>
            <Typography
              color="secondary"
              variant="h2"
              gutterBottom
              sx={{
                ...styles.generalText,
                fontWeight: "bolder",
                color: "primary.main",
              }}
            >
              bienvenue a notre marketplace
            </Typography>
            <Typography
              color="secondary"
              variant="h6"
              gutterBottom
              sx={{ ...styles.generalText, mt: "5%", color: "primary.main" }}
            >
              ici vous pouvez trouver les produits rares et communs, et vous
              pouvez aussi deposer votre produit dans un enchère pour un
              benefice maximal, et on a beaucoup plus a offrir !
            </Typography>
          </Grid>
        </Container>
        {/* SECTION: 2 */}
        <Grid
        container
        sx={{
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <Grid item xs={3} sx={{ minWidth: 300 }}>
          <Typography
            sx={{ textAlign: "center", fontSize: 200, color: "primary.main" }}
          >
            {count.enchere}
          </Typography>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", color: "primary.main" }}
          >
            encheres
          </Typography>
          <br />
          <br />
        </Grid>
        <Grid item xs={3} sx={{ minWidth: 300 }}>
          <Typography
            sx={{ textAlign: "center", fontSize: 200, color: "primary.main" }}
          >
            {count.enchereInverse}
          </Typography>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", color: "primary.main" }}
          >
            encheres inversés
          </Typography>
          <br />
          <br />
        </Grid>
        <Grid item xs={3} sx={{ minWidth: 300 }}>
          <Typography
            sx={{ textAlign: "center", fontSize: 200, color: "primary.main" }}
          >
            {count.user}
          </Typography>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", color: "primary.main" }}
          >
            membres
          </Typography>
          <br />
          <br />
        </Grid>
      </Grid>
      </Box>

 {/* section #3 */}
 <Box sx={{marginTop: "5%", ml:"2%", backgroundColor: "primary.main"}}>

        <Grid container>
          <Grid item xs={12}>
          <Grid container>
            <Grid item xs={7}>
            <Typography variant="h4">
              nos enchères
            </Typography>
            </Grid>
            <Grid item xs={3}>
            </Grid>
            <CategoryLink to={`${navRoutes.ENCHERES}`} >
              voir tous
            </CategoryLink>
            </Grid>

              <HomePageList
              ventes={encheres}
              type={navRoutes.ENCHERE}
              elemsPerLine={6}
            />
          </Grid>

          <Grid item xs={12}>
          <Grid container>
            <Grid item xs={7}>
            <Typography variant="h4">
              nos enchères inversées
            </Typography>
            </Grid>
            <Grid item xs={3}>
            </Grid>
            <CategoryLink to={`${navRoutes.ENCHERESINVERSES}`} >
              voir tous
            </CategoryLink>
            </Grid>

              <HomePageList
              ventes={encheresInverses}
              type={navRoutes.ENCHEREINVERSE}
              elemsPerLine={6}
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* section #4 */}
      <Box sx={{...styles.sectionBox ,backgroundColor: "#f4ebf5" }}>
        <Container>
          <Typography variant="h2">NOS SERVICES</Typography>
          <hr style={styles.servicesHr} />
        </Container>
        <br />
        <br />

        <Grid container sx={styles.servicesGrid}>
          <Grid item xs={3}>
            <Card sx={{ minWidth: 275, height: 185 }} variant="outlined">
              <CardContent>
                <StorefrontTwoToneIcon fontSize="large" />
                <Typography variant="h5" color="secondary">
                  enchères
                </Typography>
                <Typography>
                  enchérer competetivement pour acheter un produit
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ minWidth: 275, height: 185 }} variant="outlined">
              <CardContent>
                <LocalMallTwoToneIcon fontSize="large" />
                <Typography variant="h5" color="secondary">
                  enchères inversés
                </Typography>
                <Typography>
                  enchérer competetivement pour vendre un produit
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ minWidth: 275, height: 185 }} variant="outlined">
              <CardContent>
                <RequestQuoteTwoToneIcon fontSize="large"/>
                <Typography variant="h5" color="secondary">
                  demande de devis
                </Typography>
                <Typography>
                  demander d'un fournisseur une proposition sur un produit
                  specifique
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
        </Grid>
        <br /><br />
      </Box>
     {/* SECTION 3 */}

     <Box sx={{ backgroundColor: "primary.main" }}>
        <Container sx={{...styles.sectionBox}}>
        <Typography variant="h2" >QUI SOMMES NOUS</Typography>
          <hr style={styles.servicesHr} />
        </Container>
        <Grid container sx={{mt:4, justifyContent:"space-around"}}>
        <Grid item xs={6} >
          <img src={logo} className="dotIt" alt="" />
        </Grid>
        <Grid item xs={6}>
          <Typography>"DOT IT" est une entreprise tunisienne spécialisée dans l’ingénierie
          logicielle et l’intégrationde solutions de gestion pour les
          entreprises. Elle crée la mise en œuvre de méthodologies degestion de
          projet et d’expertise à partir des normes de l’industrie logicielle
          (ISO, CMMI, UP,RUP, XP, Méthodologies Agiles. . . ).Annoncé en tant
          que membre du programme Microsoft Certified Partner, DOT IT travaille
          enpartenariat avec BPA SOLUTIONS - société suisse développant des
          applications commerciales.Elle a contribué à la réalisation de projets
          majeurs et stratégiques pour de nombreux clientstels que Hacks House,
          Royal Kenz Hotel, Itac Tunisie, Forest Tunisia, Comet, Carthage
          Land,Ooredoo ...</Typography>
          
        </Grid>
      </Grid>
      </Box>
    </Box>
  );
};

export default Homepage;

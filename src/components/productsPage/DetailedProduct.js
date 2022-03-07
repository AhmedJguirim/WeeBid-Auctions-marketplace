import { Grid, Typography, Button, TextField } from "@mui/material";
import { Box, minHeight } from "@mui/system";
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import { ButtonStyles, lightContainer } from "../base/customComponents/general";
import Api from "../../AxiosInstance";
import { useParams } from "react-router-dom";
// import img1 from "../../media/images/demosToBeReplaced/pc1.jpg"
// import img2 from "../../media/images/demosToBeReplaced/pc2.jpg"
// import img3 from "../../media/images/demosToBeReplaced/pc3.jpg"
// import img4 from "../../media/images/demosToBeReplaced/pc4.jpg"

const DetailedProduct = () => {
  const [enchere, setEnchere] = React.useState({});
  const [article, setArticle] = React.useState({});
  const [description, setDescription] = React.useState("");
  const [seller, setSeller] = React.useState({});
  // TODO: check why use params returns undefined then replace the hardcoded Id
  const { enchereId } = useParams();
  function getEnchere() {
    Api.get(`/encheres/26`)
      .then(function (response) {
        const data = response["data"]
        setEnchere(data);
        setSeller({
          ["nom d'utilisateur"]: data.user.displayName,
          localistation: "TODO: change this to the user's city"
        })
        //get the articme as well
    Api.get(`articles/${response["data"]["article"]["id"]}`)
    .then(function (response) {
      const data = response["data"]
      console.log(response)
      setArticle({
        nom: data.name,
        etat: data.state,
        localisation: data.localisation,
        marque: data.brand,
        ["code a barre"]: data.codebar,
        ["date de fabrication"]: data.fabrication_date.substring(0,10)
      });
      setDescription(data.description);

    })
    .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }

   React.useEffect(() => {
    getEnchere();
  }, []);



  // TODO:replace these with paths of documents
  const myImg = require("../../media/images/demosToBeReplaced/pc1.jpg");
  const myImgss = {
    1: {
      path: "../../media/images/demosToBeReplaced/pc2.jpg",
    },
    2: {
      path: "../../media/images/demosToBeReplaced/pc3.jpg",
    },
    3: {
      path: "../../media/images/demosToBeReplaced/pc4.jpg",
    },
  };
  //#region states
  const [augmentation, setAugmentation] = React.useState(0.1);
  const [prixActuel, setPrixActuel] = React.useState(1000);
  //#endregion

  //#region state handlers
  const handleAugmentation = (event) => {
    setAugmentation(parseFloat(event.target.value));
  };
  //#endregion

  return (
    <Grid container sx={{ mt: 10 }}>
      {/* could be used for anything */}
      <Grid item xs={2}></Grid>

      <Grid
        container
        sx={{
          backgroundColor: "secondary.main",
          padding: 5,
          color: "secondary.main",
          borderRadius: 10,
        }}
        spacing={2}
      >
        <Grid item xs={12}>
          <Typography variant="h3" color="primary.main">
            {article.name}
          </Typography>
        </Grid>

        {/* first section */}
        <Grid item xs={5.8}>
          <Grid item></Grid>
          {/* documents */}
          <Grid item>
            <img src={myImg} alt="" />
          </Grid>
          <Grid container spacing={2}>
            {/* TODO: map throught your documents here */}
            {/* {Object.keys(myImgss).map((key, index) => (
              <Grid
                item
                xs={4}
                key={index}
                sx={{ height: 100, backgroundColor: "green" }}
              ></Grid>
            ))} */}
          </Grid>
          {/* seller userdata subsection */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* title */}
            <Grid item xs={12} sx={lightContainer}>
              <Typography variant="h3">
                <PersonIcon fontSize="large" sx={{ mr: 2 }} />
                le vendeur
              </Typography>
              {/* seller data details */}
              <Grid item sx={{ mt: 2 }}>
                {Object.keys(seller).map((key, index) => (
                  <Grid container key={index} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="h6">{key}: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{seller[key]} </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={0.4}></Grid>
        {/* second section */}
        <Grid item xs={5.8} sx={{ color: "secondary.main" }}>
          {/* selling section */}
          <Box sx={lightContainer}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="h6">prix immediat:</Typography>{" "}
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" color="info.main">
                  {enchere.immediatePrice}TND
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Button sx={ButtonStyles}> acheter maintenant</Button>
              </Grid>
            </Grid>
            <hr style={{ width: "60%" }} />

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="h6">encherir:</Typography>{" "}
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" color="info.main">
                  prix actuel: {enchere.currentPrice}TND
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h8">
                  prix apres l'augmentation:{" "}
                  {enchere.currentPrice + augmentation} TND
                </Typography>
              </Grid>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                <TextField
                  required
                  type="number"
                  id="augmentation"
                  label="augmentation"
                  value={augmentation}
                  onChange={handleAugmentation}
                />
              </Grid>

              <Grid item xs={4}>
                <Button sx={ButtonStyles}> encherir</Button>
              </Grid>
            </Grid>
          </Box>
          {/* sale details section*/}
          <Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {/* title */}
              <Grid
                item
                xs={12}
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: 10,
                  padding: 4,
                  mt: 5,
                }}
              >
                <Typography variant="h3">
                  <PersonIcon fontSize="large" sx={{ mr: 2 }} />
                  details sur produit
                </Typography>
                {/* article details section */}
                <Grid item sx={{ mt: 2 }}>
                  {Object.keys(article).map((key, index) => (
                    <Grid container key={index} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="h6">{key}: </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">
                          {article[key]}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DetailedProduct;

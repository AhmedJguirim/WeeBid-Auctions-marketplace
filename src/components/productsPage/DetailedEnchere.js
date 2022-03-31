import {
  Grid,
  Typography,
  Button,
  TextField,
  DialogContentText,
  DialogContent,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { Box, minHeight } from "@mui/system";
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import { ButtonStyles, lightContainer, ArticleImage, ArticleSubImage } from "../base/customComponents/general";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiRoutes } from "../../config/routes";
import Api from "../../AxiosInstance";
import { useSelector } from "react-redux";
import {io} from "socket.io-client"

let socket = io("http://127.0.0.1:8081");
const DetailedEnchere = () => {
  //#region states
  // TODO: display the augmentationList
  const [augmentationList, setAugmentationList] = React.useState({});
  const [enchere, setEnchere] = React.useState({});
  const [article, setArticle] = React.useState({});
  const [description, setDescription] = React.useState("");
  const [seller, setSeller] = React.useState({});
  const [images, setImages] = React.useState([]);
  const [currentPrice, setCurrentPrice] = React.useState(0);
  const [augmentation, setAugmentation] = React.useState(0.1);
  const [newAugment, setNewAugment] = React.useState({});
  //#endregion

  //#region state handlers
  const handleAugmentation = (event) => {
    setAugmentation(parseFloat(event.target.value));
  };
  //#endregion
  //gets current user data from redux store
  const user = useSelector((state) => state.user);

  //gets enchere id from url
  let { id } = useParams();
  //socket code
  
  socket.on("connect",()=>{
  console.log(`you're connected to socket.io from product`)
  
  socket.on("NEW_PRICE", (enchere, user)=>{
    console.log('hi')
    alert(`${user} has updated the price of ${enchere}`)
    getCurrentPrice(enchere.initPrice,id)})
})

  //gets the value given in the latest augmentation
  function getCurrentPrice(initPrice, myId) {
    axios
      .get(`${apiRoutes.API}/augmentationHighest`, {
        params: {
          page: 1,
          enchere: `/api/encheres/${myId}`,
          "order[date]" : "desc"
        },
      })
      .then((response) => {
        //sets the result (augmentation) in the state
        if (response["data"]["hydra:member"]["0"] != undefined) {
          setNewAugment(response["data"]["hydra:member"]["0"]);
        } else {
          setCurrentPrice(initPrice);
        }
      })
      .catch((error) => console.log(error));
  }

  //gets the actual enchere
  function getEnchere() {
    axios
      .get(`${apiRoutes.API}/encheres/${id}`)
      .then(function (response) {
        const data = response["data"];
        console.log(response["data"]["@id"], "retrieved successfully!");
        setEnchere(data);
        //gets the current augmentation from the latest augmentation
        getCurrentPrice(response["data"].initPrice, id);
        //sets seller details
        setSeller({
          ["nom d'utilisateur"]: data.user.displayName,
          localistation: data.user.adresse.ville,
        });
        socket.emit('join-rooms', [response["data"]["@id"]])
        //get the article
        axios
          .get(`${apiRoutes.API}/articles/${response["data"]["article"]["id"]}`)
          .then(function (response) {
            const data = response["data"];
            // TODO: fix documents
            axios.get(`${apiRoutes.API}/documents`,
            {
              params: {
                page:1,
                article: response["data"]["@id"],
              },
              headers:{
                "Content-Type": "multipart/form-data",
              }
            }).then(response=>{getImages(response["data"]["hydra:member"])})
              .catch(error=>console.log(error))
            setArticle({
              nom: data.name,
              etat: data.state,
              localisation: data.localisation,
              marque: data.brand,
              ["code a barre"]: data.codebar,
              ["date de fabrication"]: data.fabrication_date.substring(0, 10),
            });
            setDescription(data.description);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }
  //#region augmentation zone
  function augmenter() {
    const newPrice = currentPrice + augmentation;

    Api.post("/augmentations", {
      user: `/api/users/${user.id}`,
      enchere: `/api/encheres/${id}`,
      value: newPrice,
      date: new Date(),
    })
      .then((response) => {
        console.log(response["data"]["@id"], "created successfully!");
        getCurrentPrice(enchere.initPrice, id);
        socket.emit("AUGMENT", enchere["@id"], user.displayName)
      })
      .catch((error) => console.log(error));
  }
//not currently used
  function getAugmentations() {
    axios
      .get(`${apiRoutes.API}/augmentations`, {
        params: {
          page: 1,
          enchere: `/api/encheres/${id}`,
          "order[date]": "desc",
        },
      })
      .then((response) => {
        console.log(response["data"]["@id"], "retrieved successfully!");
        setAugmentationList(response["data"]["hydra:member"]);
      })
      .catch((error) => console.log(error));
  }
  //#endregion

  
  
  
  
  React.useEffect(() => {
    getEnchere();
  }, [augmentationList, id]);
  React.useEffect(() => {
    console.log("getting the new value!!")    
    setCurrentPrice(newAugment.value);
  }, [newAugment]);

  const getImages = (rawImages)=>{
    let tempImages = []
    let path = "http://127.0.0.1:8000"
    rawImages.map((image)=>{
      const myImg = path.concat(image.contentUrl);
      tempImages.push(myImg)
    });
    setImages(tempImages);
    console.log(tempImages) 
  }
  //#region concerning verification popup
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //#endregion

  return (
    <Grid container sx={{ mt: 10 }}>
      {/* could be used for anything */}
      {/* this is just a verification popUp */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">verification</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            are you sure ? if the seller complains about you not paying the
            given amount we will add your cin to the blackList and you'll be
            banned permanently
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={ButtonStyles}
            onClick={() => {
              handleClose();
            }}
          >
            Disagree
          </Button>
          <Button
            sx={ButtonStyles}
            onClick={() => {
              augmenter();
              handleClose();
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
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
            <ArticleImage src={images[0]} alt=""/>
          </Grid>
          <Grid container spacing={2}>
            {/* TODO: map throught your documents here */}
            {images.map((image) => (
              <Grid
                item
                xs={4}
                key={Math.random()}
                sx={{ height: 100}}
              >
               <ArticleSubImage src={image} alt={image} />
              </Grid>
            ))}
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
                  prix actuel: {currentPrice}TND
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h8">
                  prix apres l'augmentation: {currentPrice + augmentation} TND
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
                <Button sx={ButtonStyles} onClick={handleClickOpen}>
                  {" "}
                  encherir
                </Button>
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
                        <Typography variant="h6">{article[key]} </Typography>
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

export default DetailedEnchere;

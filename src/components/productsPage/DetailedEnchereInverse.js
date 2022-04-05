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
import { Box} from "@mui/system";
import React, { useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { ArticleImage, ArticleSubImage, ButtonStyles, lightContainer } from "../base/customComponents/general";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiRoutes } from "../../config/routes";
import Api from "../../AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Socket from "../base/customComponents/Socket";
import {fetchWatchList} from '../../redux/actions';


const DetailedEnchereInverse = () => {

  const dispatch = useDispatch();  
  //GET DATA FROM STORE/PARAMS
  const watchList = useSelector((state) => state.watchList)
  const thePrice = useSelector((state) => state.currentPrice)
  const user = useSelector((state) => state.user);
  let { id } = useParams();
  //#region states

  const [enchere, setEnchere] = React.useState({});
  const [article, setArticle] = React.useState({});
  const [description, setDescription] = React.useState("");
  const [seller, setSeller] = React.useState({});
  const [images, setImages] = React.useState([]);
  const [reduction, setReduction] = React.useState(0.1);
  const [followable, setFollowable] = React.useState(true);
  const [watched, setWatched] = React.useState(false);
  const [watchButton, setWatchButton] = React.useState("surveiller");
  //#endregion

  //#region state handlers
  const handleReduction = (event) => {
    setReduction(parseFloat(event.target.value));
  };
  //#endregion
  //REMOVES SUBSCRIPTION TO SOCKET ROOM IF NOT WATCHED
  const mounted = useRef(false);
  React.useEffect(() => {
      mounted.current = true;
      return () => {
          mounted.current = false;
            Socket.emit("leave-room", `/api/enchere_inverses/${id}`)
      };
  }, []);

    //socket code
    Socket.on("connect",()=>{
      console.log(`you're connected to Socket.io from product`)
        
          Socket.on("NEW_PRICE", (myEnchere, user, newPrice, initPrice)=>{
            dispatch({type:"SETPRICE",newPrice});
            getCurrentPrice(initPrice,id)
            alert(`${user} has updated the price of ${myEnchere} to ${newPrice}`)
            })   
        
      })
  //gets the value given in the latest reduction
  function getCurrentPrice(initPrice, myId) {
    axios
      .get(`${apiRoutes.API}/reductionLowest`, {
        params: {
          page: 1,
          enchereInverse: `/api/enchere_inverses/${myId}`,
          "order[date]" : "desc"
        },
      })
      .then((response) => {
        //sets the result (reduction) in the state
        if (response["data"]["hydra:member"]["0"] != undefined) {
          dispatch({type:"SETPRICE",price:response["data"]["hydra:member"]["0"].value});
        } else {
          dispatch({type:"SETPRICE",price: initPrice});
        }
      })
      .catch((error) => console.log(error));
  }

  //gets the actual enchere
  function getEnchere() {
    axios
      .get(`${apiRoutes.API}/enchere_inverses/${id}`)
      .then(function (response) {
        const data = response["data"];
        console.log(response["data"]["@id"], "retrieved successfully!");
        setEnchere(data);
        //gets the current reduction from the latest reduction
        getCurrentPrice(response["data"].initPrice, id);
        //sets seller details
        setSeller({
          id:data.user.id,
          ["nom d'utilisateur"]: data.user.displayName,
          localistation: data.user.adresse.ville,
        });
        Socket.emit('join-rooms', [response["data"]["@id"].concat("LOCAL")])
        console.log([response["data"]["@id"].concat("LOCAL")])
        //get the article
        axios
          .get(`${apiRoutes.API}/articles/${response["data"]["article"]["id"]}`)
          .then(function (response) {
            const data = response["data"];
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
  
const handleWatch = ()=>{
  if(watched=== false && user!=={}){
    Api.post("/surveilles",{
      user: `/api/users/${user.id}`,
      enchereInverse: `/api/enchere_inverses/${enchere.id}`
    }).then(response=>{
      console.log(response["data"]["@id"]+ " created")
      dispatch(fetchWatchList(user.id))
      setWatched(true)
      setWatchButton("unsurveiller")
      
    }).catch(err=>console.log("oops something went wrong"))
  }else if(watched === true){
    const surveille =watchList.filter(e=>e.enchereInverse===`/api/enchere_inverses/${id}`);
    Api.delete(surveille.surveille).then(res=>console.log("successfully unwatched")).catch(err=>console.log("smtng went wrong"))
    setWatchButton("surveiller")
}
}
  

  //#region augmentation zone
  function reduire() {
    const newPrice = thePrice - reduction;
    Api.post("/reductions", {
      user: `/api/users/${user.id}`,
      enchereInverse: `/api/enchere_inverses/${id}`,
      value: newPrice,
      date: new Date(),
    })
      .then((response) => {
        console.log(response["data"]["@id"], "created successfully!");
        getCurrentPrice(enchere.initPrice, id);
        Socket.emit("REDUCT", enchere["@id"], user.displayName, newPrice, enchere.initPrice)
      })
      .catch((error) => console.log(error));
  }
    //#endregion

  //MAKES IMAGES READY FOR USE
const getImages = (rawImages)=>{
  let tempImages = []
  let path = "http://127.0.0.1:8000"
  rawImages.map((image)=>{
    const myImg = path.concat(image.contentUrl);
    tempImages.push(myImg)
  });
  setImages(tempImages);
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

  React.useEffect(() => {
    getEnchere();

  }, [mounted, id]);
  React.useEffect(() => {
    if(user==={}||user.id === seller.id){
      setFollowable(false)
    }else{
      setFollowable(true)
    }
    console.log(user,seller)
  }, [seller,user]);


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
              reduire();
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
        {followable === true &&
          <Grid item><Button onClick={handleWatch} sx={{...ButtonStyles, backgroundColor:"primary.main"}}> {watchButton} </Button></Grid>}
          {/* documents */}
          <Grid item>
            <ArticleImage src={images[0]} alt=""/>
          </Grid>
          <Grid container spacing={2}>
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

                  <Grid container sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="h6">nom d'utilisateur: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{seller["nom d'utilisateur"]} </Typography>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="h6">localisation: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{seller["localisation"]===undefined ? "":seller["localisation"]} </Typography>
                    </Grid>
                  </Grid>
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
                  prix actuel: {thePrice}TND
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h8">
                  prix apres l'augmentation: {thePrice - reduction} TND
                </Typography>
              </Grid>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                <TextField
                  required
                  type="number"
                  id="reduction"
                  label="reduction"
                  value={reduction}
                  onChange={handleReduction}
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
                  {/* TODO: GIVE DESCRIPTION A SEPERATED SECTION */}
                  <Grid container sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="h6">description: </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">{description} </Typography>
                      </Grid>
                    </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DetailedEnchereInverse;

import { Grid, Typography, Button } from "@mui/material";
import { minHeight } from "@mui/system";
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
// import img1 from "../../media/images/demosToBeReplaced/pc1.jpg"
// import img2 from "../../media/images/demosToBeReplaced/pc2.jpg"
// import img3 from "../../media/images/demosToBeReplaced/pc3.jpg"
// import img4 from "../../media/images/demosToBeReplaced/pc4.jpg"

const DetailedProduct = () => {
  // replace these with a real product
  const articleData = {
    name: "name",
    state: "state",
    localisation: "localisation",
    codeBar: "codeBar",
    marque: "marque",
    description: "description",
  };

  const enchereData = {
    quantity: "quantity",
    initPrice: "initPrice",
    immediatePrice: "immediatePrice",
    startDate: "startDate",
    endDate: "endDate",
    category: "category",
  };
  //replace this with the actual user data
  const user = {
    displayName: "user1",
    email: "exemple@gmail.com",
  };
  // replace these with paths of documents
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

  return (
    <Grid container>
      {/* could be used for anything */}
      <Grid item xs={2}></Grid>
      {/* first section */}
      <Grid container xs={10}>
        <Grid item xs={5}>
          <Grid item>
            <Typography variant="h3">{articleData.name}</Typography>
          </Grid>
          {/* documents */}
          <Grid item>
            <img src={myImg} alt="" />
          </Grid>
          <Grid container sx={{ mt: 2 }} spacing={2}>
            {/* TODO: map throught your documents here */}
            {Object.keys(myImgss).map((key, index) => (
              <Grid
                item
                xs={4}
                key={index}
                sx={{ height: 100, backgroundColor: "green" }}
              ></Grid>
            ))}
          </Grid>
        </Grid>
        {/* seller userdata subsection */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* title */}
          <Grid item xs={12}>
            <Typography variant="h3">
              <PersonIcon fontSize="large" sx={{ mr: 2 }} />
              le vendeur
            </Typography>
          </Grid>
          {/* seller data details */}
          <Grid item xs={5}>
          {Object.keys(user).map((key, index) => (
            <Grid container key={index}>
              <Grid item xs={6}>
                <Typography variant="h6">{key} </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{user[key]} </Typography>
              </Grid>
            </Grid>
          ))}
          </Grid>
          
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DetailedProduct;

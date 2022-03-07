import { Grid, Typography } from '@mui/material';
import React from 'react'
import ProductsListing from '../generalComponents/ProductsListing';

const ventesParCategory = ({category}) => {
    const ventes = {
        1: { nom: "pc", vendeur: "exemple123", prix: 80 },
        2: { nom: "pc", vendeur: "exemple123", prix: 80 },
        3: { nom: "pc", vendeur: "exemple123", prix: 80 },
        4: { nom: "pc", vendeur: "exemple123", prix: 80 },
        5: { nom: "pc", vendeur: "exemple123", prix: 80 },
        6: { nom: "pc", vendeur: "exemple123", prix: 80 },
        7: { nom: "pc", vendeur: "exemple123", prix: 80 },
        8: { nom: "pc", vendeur: "exemple123", prix: 80 },
      };
      return (
        <Grid container>
            <Typography variant='h2'>nos ventes</Typography>
            {/* <ProductsListing elemsPerLine={6} ventes={ventes}>
            </ProductsListing> */}
        </Grid>
      )
}

export default ventesParCategory
import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import { lightContainer } from "../base/customComponents/general";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import API from "../../AxiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CategoryLink, CustomLink } from "../base/customComponents/TopNavLink";
import { navRoutes } from "../../config/routes";

function createData(id,transmitterId,transmitter, article, enchereId, date) {
  return { id,transmitterId,transmitter, article, enchereId, date };
}



const PropositionsListing = () => {
    const [propositions, setPropositions] = React.useState([])
    const [loadedPage, setLoadedPage] = React.useState(1)
    const myUser = useSelector((state) => state.user);
    const navigate = useNavigate();


    function getNotification(){
        console.log(loadedPage)
        API.get(`/propositionsTable`,{
            params:{
                page:loadedPage,
                transmittedTo: `/api/users/${myUser.id}`,
                "order[date]": "desc"
            }
        }).then(res=>{
            console.log(res)
            fill(res["data"]["hydra:member"]);
        }).catch(err=>console.log(err))
    }


    const fill = (res)=>{
        let rows = [];
        if(propositions[0]){
            rows.push(...propositions)
        }

        res.forEach(proposition=>{
            rows.push(createData(proposition.id,proposition.transmitter.id,proposition.transmitter.displayName,proposition.enchere.article.name
                , proposition.enchere.id,proposition.date),)
        })
        setPropositions(rows)
        console.log(rows)
    }


    const handleAddMore = ()=>{
        setLoadedPage(loadedPage +1);
    }
    React.useEffect(()=>{
        getNotification()
    },[myUser, loadedPage])
  return (
    <Box sx={lightContainer}>
        <Typography variant="h3" >propositions reçues</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>transmetteur </TableCell>
              <TableCell align="right">Enchère proposé&nbsp;</TableCell>
              <TableCell align="right">Date&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {propositions.map((proposition) => (
              <TableRow
                key={proposition.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row">
                  <CategoryLink to={`${navRoutes.CONSULTUSER}/${proposition.transmitterId}`}>{proposition.transmitter}</CategoryLink>
                </TableCell>
                <TableCell align="right"><CategoryLink to={`${navRoutes.ENCHERE}/${proposition.enchereId}`}>{proposition.article}</CategoryLink></TableCell>
                <TableCell align="right">{proposition.date.slice(0,10)}</TableCell>
              </TableRow>
            ))}


                

          </TableBody>
          
        </Table>
        {propositions.length === loadedPage*15 && <div> <Divider/>
        <Typography onClick={handleAddMore} sx={{textAlign:"center", fontSize:20,margin:"10px 0"}}>afficher plus de notifications</Typography></div>}
        
      </TableContainer>
    </Box>
  );
};

export default PropositionsListing;

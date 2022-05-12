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
import { CustomLink } from "../base/customComponents/TopNavLink";

function createData(id,transmitter, date) {
  return { id,transmitter, date };
}



const DemandesListing = () => {
    const [demandes, setDemandes] = React.useState([])
    const [loadedPage, setLoadedPage] = React.useState(1)
    const myUser = useSelector((state) => state.user);
    const navigate = useNavigate();


    function getNotification(){
        console.log(loadedPage)
        API.get(`/demandesTable`,{
            params:{
                page:loadedPage,
                user: `/api/users/${myUser.id}`,
                "order[date]": "desc"
            }
        }).then(res=>{
            console.log(res)
            fill(res["data"]["hydra:member"]);
        }).catch(err=>console.log(err))
    }


    const fill = (res)=>{
        let rows = [];
        if(demandes[0]){
            rows.push(...demandes)
        }

        res.forEach(demande=>{
            rows.push(createData(demande.id,demande.transmitter,demande.date),)
        })
        setDemandes(rows)
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
        <Typography ></Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>titre</TableCell>
              <TableCell align="right">description&nbsp;</TableCell>
              <TableCell align="right">date&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {demandes.map((notification) => (
              <TableRow
                key={notification.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <CustomLink to={`${notification.route}`}>{notification.title}</CustomLink>
                </TableCell>
                <TableCell align="right">{notification.description}</TableCell>
                <TableCell align="right">{notification.date}</TableCell>
              </TableRow>
            ))}


                

          </TableBody>
          
        </Table>
        {demandes.length === loadedPage*15 && <div> <Divider/>
        <Typography onClick={handleAddMore} sx={{textAlign:"center", fontSize:20,margin:"10px 0"}}>afficher plus de notifications</Typography></div>}
        
      </TableContainer>
    </Box>
  );
};

export default DemandesListing;

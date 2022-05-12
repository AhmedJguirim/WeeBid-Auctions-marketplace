import { Box, Typography } from "@mui/material";
import React from "react";
import { lightContainer } from "../base/customComponents/general";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(name, quantity, finalPrice, creator, won, endDate) {
  return { name, quantity, finalPrice, creator, won, endDate };
}
const rows = [
  createData("pc", 1, 1000, "exemple123", false, "02/02/2022"),
  createData("telephone", 1, 1000, "exemple123", false, "02/02/2022"),
  createData("machine a laver", 1, 1000, "exemple123", false, "02/02/2022"),
  createData("Cupcake", 5, 30.6, "exemple123", true, "02/02/2022"),
  createData("tableau", 1, 1000.8, "exemple123", false, "02/02/2022"),
];
rows.map((row)=>{
    if(row.won === false){
        row.won = "non"
    }
    else{
        row.won = "oui"
    }
})
const EncheresHistory = () => {
  return (
    <Box sx={lightContainer}>
        <Typography ></Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>nom</TableCell>
              <TableCell align="right">quantité&nbsp;</TableCell>
              <TableCell align="right">prix final&nbsp;</TableCell>
              <TableCell align="right">createur&nbsp;</TableCell>
              <TableCell align="right">gagné?&nbsp;</TableCell>
              <TableCell align="right">date de fin&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{row.finalPrice}</TableCell>
                <TableCell align="right">{row.creator}</TableCell>
                <TableCell align="right">{row.won}</TableCell>
                <TableCell align="right">{row.endDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EncheresHistory;

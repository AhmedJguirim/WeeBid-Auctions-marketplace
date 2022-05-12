import { Typography } from '@mui/material';
import React from 'react'

const Countdown = (props) => {
    const [time,setTime]=React.useState("")
        const getTimer = (distance)=>{
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          return days + "d " + hours + "h " + minutes + "m " + seconds + "s "
      
        }
        var countDownDate = new Date(props.startDate).getTime();
        var endDate = new Date(props.endDate).getTime();
        // Update the count down every 1 second
        var x = setInterval(function () {
          // Get today's date and time
          var now = new Date().getTime();
      
          // Find the distance between now and the count down date
          var distance = countDownDate - now;
          var expiration = endDate - now;
          // Time calculations for days, hours, minutes and seconds
          
          // Display the result in the element with id="demo"
          if(distance < 0 && expiration > 0){
            const timer = getTimer(expiration)
            if(timer[0]!='N'){
              setTime(timer)
            }

          }
          else if(expiration < 0){
            setTime("EXPIRÉ");
          }
          else{
            const timer = getTimer(distance)
            if(timer[0]!='N'){
              setTime(timer)
            }
          }

            
      
          // If the count down is finished, write some text
          
        }, 1000);

      
  return (
    <Typography variant={props.variant} sx={{mt:3, textAlign:"center"}}>{time}</Typography>
  )
}

export default Countdown



const currentPrice = (state= 0 , action)=>{
    switch(action.type){
        case "SETPRICE":
            const price = action.price
            if(price){
                return price
            }
            else{
                return 0
            }
        default:
            return state
    }
}
export default currentPrice
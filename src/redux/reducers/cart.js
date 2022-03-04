
const getCart= ()=>{
    //TODO: get cart from session
    return null
}

const cartReducer = (state= {} , action)=>{
    switch(action.type){
        case 'GETCART':
            return getCart();
        // case 'ADDTOKART':
        //     count++
        //     return {...state , count:action.payload}
        // case 'REMOVEFROMCART':
            
        //     return {...state , count:action.payload}
        default:
            return state
    }
}
export default cartReducer
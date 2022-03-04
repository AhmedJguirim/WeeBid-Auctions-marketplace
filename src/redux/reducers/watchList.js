const getWatchList = ()=>{
    //TODO: get all watched products
    return null
}

const watchListReducer = (state= {} , action)=>{
    switch(action.type){
        case 'GETWATCHLIST':
            return getWatchList();
        default:
            return state
    }
}
export default watchListReducer
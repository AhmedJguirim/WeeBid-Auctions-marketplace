const getWatchList = ()=>{
    //TODO: get all watched products
    return null
}

const watchListReducer = (state= [] , action)=>{
    switch(action.type){
        case 'GETWATCHLIST':
            const rawData = action.payload;
            let watchList = [];
            rawData.map(elem=>{
                if(elem.enchere!==null){
                    watchList.push(elem.enchere["@id"])
                }else if(elem.enchereInverse!==null){
                    watchList.push(elem.enchereInverse["@id"])
                }
                
            })
            if(watchList){
                return watchList;
            }
            else{
                return {}
            }
        default:
            return state
    }
}
export default watchListReducer
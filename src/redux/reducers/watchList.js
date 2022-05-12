
const watchListReducer = (state= [] , action)=>{
    switch(action.type){
        case 'GETWATCHLIST':
            const rawData = action.payload;
            let watchList = [];
            rawData.map(elem=>{
                if(elem.enchere!==null){
                    watchList.push({enchere:elem.enchere["@id"],surveille:elem["@id"]})
                }else if(elem.enchereInverse!==null){
                    watchList.push({enchereInverse:elem.enchereInverse["@id"],surveille:elem["@id"]})
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
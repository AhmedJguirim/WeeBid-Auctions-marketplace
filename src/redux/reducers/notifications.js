const notificationsReducer = (state= [] , action)=>{
    switch(action.type){
        case 'GETNOTIFICATIONS':
            return action.payload
        case 'ADDNOTIFICATIONS':
            return [action.payload,...state.slice(-4)]
        default:
            return state
    }
}
export default notificationsReducer
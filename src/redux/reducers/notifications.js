const notificationsReducer = (state= [] , action)=>{
    switch(action.type){
        case 'GETNOTIFICATIONS':
            return action.payload
        default:
            return state
    }
}
export default notificationsReducer
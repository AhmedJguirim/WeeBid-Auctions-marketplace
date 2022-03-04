// import { initialState } from "../store";


const userReducer = (state = {} , action)=>{
    switch(action.type){
        
        case 'CHECKUSER':          
            const user = action.payload
            console.log(user)
            if(user){
                return {
                    id: user.id,
                    displayName: user.displayName,
                    roles: user.roles,
                    avatar: user.avatar
                }
            }
            else{
                return {}
            }
        case 'LOGOUT':
            return {}
        default:
            return state
    }
}
export default userReducer
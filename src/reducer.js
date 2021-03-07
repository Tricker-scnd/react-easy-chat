const red = (state, action) => {
    switch (action.type) {
        case 'JOINED':
            return {...state, 
                joined:true, 
                roomId:action.payload.roomId,
                user:action.payload.user}


        case 'DISCONNECT':
            return {...state, 
                joined:false,
                roomId:null,
                user:null}

        case 'SET_USERS':
            return {...state,
                 users:action.payload   
            }

        case 'SET_MESSAGES':
            return {...state,
                    messages:[...state.messages,action.payload]  
            }
        default:
        return state
    }
}
export default red
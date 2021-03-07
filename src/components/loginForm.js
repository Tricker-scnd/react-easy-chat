import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {objToStrMap} from '../utils/helper'


export function LoginForm({onLogin}) {

    
    const [roomId, setRoomId] = useState('')
    const [user, setUser] = useState('')
    const [errors, setErrors] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [effectTrigger, setEffectTrigger] = useState(false)
    
        

    useEffect(()=>{

        let isMounted = true; 

        if(effectTrigger)
        {
            const connectToChat = async() => {
           
                if(roomId && user){
                    if (isMounted) setIsLoading(true)
                    const obj = {roomId,user}
                    try {
                        const response = await  axios.post('/rooms',obj)
                        const chatData = objToStrMap(JSON.parse(response.data));
                        if(chatData){
                            console.log(chatData);
                            onLogin(obj)
                            if (isMounted) setIsLoading(false)
                        }
        
                      } catch (e) {
        
                        console.log(` Axios request failed: ${e}`);
                    }
        
                    if (isMounted) setErrors('')
                }else{
                    if(!roomId) if (isMounted) setErrors('fill room id field')
                    else if(!user) if (isMounted) setErrors('fill nickname field')
                }
                // connectSocket()
            }

            connectToChat()
        }

        return () => { isMounted = false };

    },[effectTrigger,onLogin,roomId,user])


    

    function triggerEff(e){
        console.log('work');
        e.preventDefault()
        setEffectTrigger(true)
    }
    

  return (
    <form className="login-form" onSubmit={triggerEff}>
        <div className="login-form__wrapper">
            <h3>login to chat</h3>
            <div className="error-block">{errors}</div>
            <input className={isLoading?'disabled':''} type="text" placeholder="Room" value={roomId} onChange={e=>setRoomId(e.target.value)}/>
            <input className={isLoading?'disabled':''} type="text" placeholder="your nickname" value={user} onChange={e=>setUser(e.target.value)} />
            <button type="submit" className={isLoading?'disabled':''} disabled={isLoading}>
                {!isLoading?'Start chatting':'Loading...'}
            </button>
        </div>
    </form>
  );
}


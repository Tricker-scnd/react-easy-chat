import React, {  useEffect, useReducer } from 'react'
import axios from 'axios';
import Chat from './components/Chat';
import { LoginForm } from './components/loginForm';
import reducer from './reducer';
import socket from './socket'


function App() {

  const [state, dispatch] = useReducer(reducer, {
    joined:false,
    roomId:null,
    user:null,
    users:[],
    messages:[]
  })

  const onLogin = (obj) =>{
    dispatch({
      type: 'JOINED',
      payload: obj
    })
    socket.emit('ROOM:JOIN',obj)

    axios.get(`rooms/?id=${obj.roomId}`).then(data=>{
      setUsers(data.data.users)
    })
  }

  const logOut = () =>{
    dispatch({
      type: 'DISCONNECT'
    })
  }

  
  const setUsers = users =>{
    dispatch({
      type: 'SET_USERS',
      payload:users
    })
  }
  const setMessages = messages =>{
    dispatch({
      type: 'SET_MESSAGES',
      payload:messages
    })
  }

  const sendMessage = (roomId,user,message) =>{
    socket.emit('MESSAGE:SENDING',{roomId,user,message})
  }

  useEffect(()=>{
    socket.on('ROOM:JOINED',(info)=>setUsers(JSON.parse(info).users))

    socket.on('ROOM:LEAVE',(info)=>setUsers(JSON.parse(info).users))

    socket.on('MESSAGE:SENT',(info)=>setMessages(JSON.parse(info)))

  },[])

  console.log(state);

  return (
    <div className="base-wrapper">
      
      {!state.joined&&<LoginForm onLogin={onLogin}/>}
      {state.joined&&<Chat 
        info={state}
        active={state.joined}
        logout={logOut}
        sendMessage={sendMessage}
        />}
    </div>
  );
}

export default App;

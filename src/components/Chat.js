import React, { useEffect, useRef, useState } from 'react';


function Chat({active,logout,info, sendMessage}) {

    const [messageValue, setMessageValue] = useState('')
    const messageRef = useRef(null)


    const chatSendMessage = (e) =>{
        e.preventDefault()
        if(messageValue)
        {
            sendMessage(info.roomId,info.user,messageValue)
      
        }

        setMessageValue('')

    }

    useEffect(()=>{
        messageRef.current.scrollTo(0,99999)
    },[info.messages])
    const chatClass = active?'':'disabled'
    return (
        <>
        <div className={chatClass+" chat"}>
            <div className="chat__panel">
                <div className="room__id"> room:{info.roomId}</div>
                <ul className="chat-user-list">
                    {   info.users?
                            info.users.map((user,i)=>(<li className="chat-user-list__item" key={i}>{user}</li>))
                            :''
                    }
                </ul>
            </div>
            <div className="chat__window">
                <div ref={messageRef} className="chat-messages">

                        {info.messages.map((m,i)=>

                                <div className={m.user==info.user?"own-message chat-messages__item":"chat-messages__item"} key={m.user + i}>
                                    <p className="chat-messages__item-text"><b>{m.user} : </b>{m.message}</p>
                                    <span>{m.time}</span>
                                </div>
                        )}

                        
                        
                </div>
                <form className="chat__input-block" onSubmit={chatSendMessage}>
                    <div className="chat__current-user">{info.user}:</div>
                    <input type="text" placeholder="type your message" value={messageValue} onChange={e=>setMessageValue(e.target.value)}/>
                    <button type="submit">send</button>
                </form>
            </div>
        </div>
        <button onClick={logout} className="chat-exit-btn">exit</button>
        </>
      );
}

export default Chat;
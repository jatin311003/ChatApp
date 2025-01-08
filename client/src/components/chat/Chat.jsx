import React, { useEffect, useState } from 'react'
import {user} from '../join/Join'
import { IoMdSend } from "react-icons/io";
import socketIO from 'socket.io-client';
import './Chat.css';
import Message from '../message/Message';
import ReactScrollToBottom from "react-scroll-to-bottom"
import closeicon from '../../images/closeIcon.png'
let socket;
const ENDPOINT="http://localhost:3000"
const Chat = () => {
    const [id,setid]=useState("");
    const [messages,setmessages]=useState([]);
    const send=()=>{
        const message=document.getElementById('chat-input').value;
        socket.emit('message',{message,id});
        document.getElementById('chat-input').value='';
    }
    
    useEffect(()=>{
        socket=socketIO(ENDPOINT,{transports:['websocket']});
        socket.on('connect',()=>{
            // alert("connected");
            setid(socket.id);
        })
        console.log(socket);
        socket.emit('joined',{user});
        socket.on('welcome',(data)=>{
            setmessages([...messages,data])
            console.log(data.user,data.message);
        })
        socket.on('userjoined',(data)=>{
            setmessages([...messages,data])
            console.log(data.user,data.message)
        })
        socket.on('leave',(data)=>{
            setmessages([...messages,data])
            console.log(data.user,data.message)
        })


        return ()=>{
            // socket.emit('disconnect');
            socket.off();
        }
    },[]);

    useEffect(() => {
      socket.on('send-message',(data)=>{
        setmessages([...messages,data])
        console.log(data.user,data.message,data.id)
      })
    
      return () => {
        socket.off();
      }
    }, [messages])
    


  return (
    <div className='chatpage'>
      <div className="chatcontainer">
        <div className="header">
            <h2>C Chat</h2>
            <a href='/'><img src={closeicon} alt="Close" /></a>
            </div>
        <ReactScrollToBottom className="chat-box">
            {messages.map((item,i)=>
                <Message user={item.id===id?'':item.user} message={item.message} classs={item.id===id?'right':'left'}/>
            )}
        </ReactScrollToBottom>
        <div className="input-box">
            <input onKeyPress={(e)=>e.key==='Enter'? send(): null} type="text" name="" id="chat-input" />
            <button onClick={send} id='send-btn'><IoMdSend id='send-icon'/></button>
        </div>
      </div>
    </div>
  )
}

export default Chat

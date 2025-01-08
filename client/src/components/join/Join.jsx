import {React} from 'react'
import './Join.css'
import logo from '../../images/logo.png'
import { Link } from 'react-router-dom'
import { useState } from 'react'
let user;
const senduser=()=>{
    user=document.getElementById("join-input").value;
    document.getElementById("join-input").value="";
}


const Join = () => {
    const [name, setname] = useState("")
    console.log(name);  
  return (
    <div className='join-page'>
      <div className="join-container">
            <img src={logo} alt="" />
            <h1>C Chat</h1>
            <input onChange={(e)=>setname(e.target.value)} type="text" placeholder='Enter your name' name="" id="join-input" />
            <Link onClick={(event)=>!name?event.preventDefault():null} to={'/chat'}>
            <button onClick={senduser} className='join-btn'>Login </button>
            </Link>
      </div>
    </div>
  )
}

export default Join;
export {user}

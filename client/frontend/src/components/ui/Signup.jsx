import React, { useState } from 'react'
import {Input} from './input'
import {Button} from './button'
import axios from 'axios'
import {Toaster} from './sonner';

function Signup() {
  const [input,setInput] = useState({
    username : "",
    email : "",
    password : "",
  })
  const changeEventHandler = (e) => {
    setInput({...input,[e.target.name]:e.target.value});
  }

  const signUpHandler = async (e) => {
     e.preventDefault();
     console.log(input);
     try{
        const response = fetch('http://localhost:5000/api/v1/user/register',{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify(input),
        })
     }
     catch(error){
        console.log(error);
     }
  }
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit={signUpHandler} className='shadow-lg flex flex-col gap-5 p-8'>

            <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>Logo</h1>
                <p className='text-sm text-center'>Signup</p>
            </div>

            <div>
                <span className='py-1 font-medium'>Username</span>
                <Input type="text" className="focus-visible:ring-transparent my-2" name="username" value={input.username} onChange={changeEventHandler}></Input>
            </div>

            <div>
                <span className='py-1 font-medium'>Email</span>
                <Input type="email" className="focus-visible:ring-transparent my-2" name="email" value={input.email} onChange={changeEventHandler}></Input>
            </div>

            <div>
                <span className='py-1 font-medium'>Password</span>
                <Input type="password" className="focus-visible:ring-transparent my-2" name="password" value={input.password} onChange={changeEventHandler}></Input>
            </div>

            <Button type="submit">Signup</Button>
        </form>
    </div>
  )
}

export default Signup
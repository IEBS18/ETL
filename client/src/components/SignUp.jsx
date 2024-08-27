import React, { useState } from 'react'

const SignUp = () => {
    const [userName,setUserName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
  return (
    <div className='flex flex-col w-2/5 m-auto mt-40'>
        <div>Create an account</div>
        <form className='flex flex-col gap-4'>
            <label htmlFor="userName"></label>
            <input type="text" name="userName" id="userName" value={userName} placeholder='John' onChange={e => setUserName(e.target.vaule)}/>
            <label htmlFor="email"></label>
            <input type="email" name="email" id="email" value={email} placeholder='John@example.com' onChange={e => setEmail(e.target.value)}/>
            <label htmlFor="password"></label>
            <input type="password" name="password" id="password" value={password} placeholder='Password' onChange={e => setPassword(e.target.value)}/>
            <button type="submit">SignUp</button>
            <div>
                <p>Already have an account?</p>
                <a href="/login">Login</a>
            </div>
        </form>
    </div>
  )
}

export default SignUp
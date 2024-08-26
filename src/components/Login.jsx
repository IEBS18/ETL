import React, { useState } from 'react'

const Login = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
  return (
    <div className='flex flex-col gap-4 w-2/5 m-auto mt-40'>
        <div>Login</div>
        <form className='flex flex-col gap-8'>
            <label htmlFor="email"></label>
            <input id='email' type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='John@example.com' />
            <label htmlFor="password"></label>
            <input id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
            <button type='submit'>Login</button>
        </form>
    </div>
  )
}

export default Login
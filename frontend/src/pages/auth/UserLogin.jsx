import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/global.css'

import axios from 'axios'

const submitLogin = async (e, url, navigate) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  try {
    const res = await axios.post(url, { email, password });
    // handle response (token, etc.)
    navigate('/');
  } catch (err) {
    console.error(err);
  }
}

const UserLogin = () => {
  const navigate = useNavigate();
  const handleRegister = (e) => submitLogin(e, '/api/auth/user/login', navigate);

  return (
    <div className="auth-page">
      <div className="auth-container">
      <div className="auth-header">
        <div className="brand">U</div>
        <div>
          <div className="title">Welcome back</div>
          <div className="subtitle">Sign in to continue to your account</div>
        </div>
      </div>

  <form onSubmit={handleRegister}>
        <div className="form-row">
          <label>Email</label>
          <input name="email" type="email" placeholder="you@example.com" />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input name="password" type="password" placeholder="Your password" />
        </div>

        <div className="actions">
          <div></div>
          <button type="submit" className="btn btn-primary">Sign in</button>
        </div>
      </form>

      <div style={{display:'flex', justifyContent:'center', gap:12, marginTop:12}}>
        <div className="helper">Sign in as</div>
        <Link to="/food-partner/login" className="nav-link">Food Partner</Link>
      </div>
      </div>
    </div>
  )
}

export default UserLogin

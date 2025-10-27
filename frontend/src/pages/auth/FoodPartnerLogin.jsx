import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/global.css'
import axios from 'axios'

const submitPartnerLogin = async (e, navigate) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  try {
    await axios.post('/api/auth/foodPatner/login', { email, password });
    navigate('/create-food');
  } catch (err) {
    console.error(err);
  }
}

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const handleRegister = (e) => submitPartnerLogin(e, navigate);

  return (
    <div className="auth-page">
      <div className="auth-container">
      <div className="auth-header">
        <div className="brand">FP</div>
        <div>
          <div className="title">Partner sign in</div>
          <div className="subtitle">Manage your menu and orders</div>
        </div>
      </div>

      <form onSubmit={handleRegister}>
          <div className="form-row">
            <label>Email</label>
            <input name="email" type="email" placeholder="owner@acme.com" />
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
        <Link to="/user/login" className="nav-link">User</Link>
      </div>
      <div className="footer-note">Secure access for food partners.</div>
      </div>
    </div>
  )
}

export default FoodPartnerLogin

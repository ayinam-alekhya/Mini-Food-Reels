import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/global.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserRegister = () => {
    const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post('/api/auth/user/register', {
        fullName: name,
        email,
        password
      },{withCredentials: true});
      // on success navigate to login or home as needed
      navigate('/user/login');
    } catch (err) {
      console.error(err);
    }
    };
  return (
    <div className="auth-page">
      <div className="auth-container">
      <div className="auth-header">
        <div className="brand">U</div>
        <div>
          <div className="title">Create account</div>
          <div className="subtitle">Sign up as a user to discover meals</div>
        </div>
      </div>

  <form onSubmit={handleRegister}>
        <div className="form-row">
          <label>Full name</label>
          <input name="name" type="text" placeholder="Jane Doe" />
        </div>

        <div className="form-row">
          <label>Email</label>
          <input name="email" type="email" placeholder="you@example.com" />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input name="password" type="password" placeholder="At least 8 characters" />
        </div>

        <div className="actions">
          <Link to="/user/login" className="nav-link" style={{alignSelf:'center'}}>Already have an account?</Link>
          <button type="submit" className="btn btn-primary">Create account</button>
        </div>
      </form>

      <div style={{display:'flex', justifyContent:'center', gap:12, marginTop:12}}>
        <div className="helper">Register as</div>
        <Link to="/food-partner/register" className="nav-link">Food Partner</Link>
      </div>
      <div className="footer-note">By continuing you agree to our terms and privacy.</div>
      </div>
    </div>
  )
}

export default UserRegister

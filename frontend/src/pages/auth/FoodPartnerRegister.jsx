import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/global.css'
import axios from 'axios'

const submitPartnerRegister = async (e, navigate) => {
  e.preventDefault();
  const businessName = e.target.name.value;
  const email = e.target.email.value;
  const contactName = e.target.contactName.value;
  const phone = e.target.phone.value;
  const address = e.target.address.value;
  const password = e.target.password.value;
  try {
    await axios.post('/api/auth/foodPatner/register', {
      name: businessName,
      email,
      contactName,
      phoneNumber: phone,
      address,
      password
    }, {withCredentials: true});
    navigate('/food-partner/login');
  } catch (err) {
    console.error(err);
  }
}

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const handleRegister = (e) => submitPartnerRegister(e, navigate);

  return (
    <div className="auth-page">
      <div className="auth-container">
      <div className="auth-header">
        <div className="brand">FP</div>
        <div>
          <div className="title">Partner sign up</div>
          <div className="subtitle">Create an account to manage your meals</div>
        </div>
      </div>

  <form onSubmit={handleRegister}>
    <div className="form-row">
      <label>Business name</label>
      <input name="name" type="text" placeholder="Acme Kitchen" />
    </div>

    <div className="form-row">
      <label>Contact email</label>
      <input name="email" type="email" placeholder="owner@acme.com" />
    </div>

    <div className="form-row">
      <label>Contact name</label>
      <input name="contactName" type="text" placeholder="Full name (e.g., Sam Smith)" />
    </div>

    <div className="form-row">
      <label>Phone number</label>
      <input name="phone" type="text" placeholder="+1 (555) 555-5555" />
    </div>

    <div className="form-row">
      <label>Address</label>
      <textarea name="address" placeholder="Street address, city, state" rows={3} />
    </div>

    <div className="form-row">
      <label>Password</label>
      <input name="password" type="password" placeholder="Create a password" />
    </div>

    <div className="actions">
      <Link to="/food-partner/login" className="nav-link" style={{alignSelf:'center'}}>Already have an account?</Link>
      <button type="submit" className="btn btn-primary">Create account</button>
    </div>
  </form>


      <div style={{display:'flex', justifyContent:'center', gap:12, marginTop:12}}>
        <div className="helper">Register as</div>
        <Link to="/user/register" className="nav-link">User</Link>
      </div>
      <div className="footer-note">We’ll review partners before they go live.</div>
      </div>
    </div>
  )
}

export default FoodPartnerRegister

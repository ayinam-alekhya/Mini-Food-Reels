import React, { useState, useEffect } from 'react';
import '../../styles/profile.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [ profile, setProfile ] = useState(null)
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:3000/api/foodPatner/${id}`, { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
    }, [ id ])


    return (
        <main data-profile-v2 className="profile-page profile-v2">
            <section className="profile-header">
                <div className="profile-meta">

                    <img className="profile-avatar" src="https://images.pexels.com/photos/2479923/pexels-photo-2479923.jpeg" alt="" />

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address}
                        </p>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total meals</span>
                        <span className="profile-stat-value">{profile?.totalMeals}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed}</span>
                    </div>
                </div>
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
              {(videos || []).map((v, idx) => (
                    <div
                        key={v?._id || v?.id || `${v?.video || 'video'}-${idx}`}
                        className="profile-grid-item"
                          onClick={() => {
                                navigate(`/food-partner/${id}/reels?start=${idx}`);
                            }}
                    >

                        <video
                            className="profile-grid-video"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            src={v.video} muted ></video>


                    </div>
                ))}
            </section>
        </main>
    )
}

export default Profile

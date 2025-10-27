import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/reels.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [savedSet, setSavedSet] = useState(new Set());
  const [likedSet, setLikedSet] = useState(new Set());
  const videoRefs = useRef(new Map());
  const observerRef = useRef(null);

  // Ensure cookies are sent on every request from this file
  axios.defaults.withCredentials = true;

  // Create the observer once
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (!(el instanceof HTMLVideoElement)) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            el.play().catch(() => {});
          } else {
            el.pause();
            el.currentTime = 0;
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );

    videoRefs.current.forEach((el) => observerRef.current.observe(el));

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      videoRefs.current.clear();
    };
  }, []);

  // Fetch videos
  useEffect(() => {
    axios
      .get('/api/food')
      .then((res) => {
        setVideos(res.data.foodItem || []);
      })
      .catch((e) => {
        console.error('Failed to load videos', e);
        setVideos([]);
      });
  }, []);

  // Fetch saved list once
  useEffect(() => {
    axios
      .get('/api/food/saved')
      .then((res) => {
        const savedFoods = res.data?.saved || [];
        setSavedSet(new Set(savedFoods.map((f) => f._id)));
      })
      .catch(() => setSavedSet(new Set()));
  }, []);

  const setVideoRef = (id) => (el) => {
    const obs = observerRef.current;
    const prev = videoRefs.current.get(id);
    if (prev && obs) obs.unobserve(prev);

    if (!el) {
      videoRefs.current.delete(id);
      return;
    }
    videoRefs.current.set(id, el);
    if (obs) obs.observe(el);
  };

  const toggleSave = async (foodId) => {
    const wasSaved = savedSet.has(foodId);
    // optimistic
    setSavedSet((prev) => {
      const next = new Set(prev);
      if (wasSaved) next.delete(foodId);
      else next.add(foodId);
      return next;
    });

    try {
      await axios.post('/api/food/save', { foodId }, { withCredentials: true });
    } catch (err) {
      console.error('toggleSave error:', err);
      // rollback
      setSavedSet((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.add(foodId);
        else next.delete(foodId);
        return next;
      });
      alert('Please login as a user to save posts.');
    }
  };

  async function handleLike(foodId) {
  const wasLiked = likedSet.has(foodId);

  // Optimistic UI update
  setLikedSet(prev => {
    const next = new Set(prev);
    if (wasLiked) next.delete(foodId);
    else next.add(foodId);
    return next;
  });

  setVideos(prev =>
    prev.map(v =>
      v._id === foodId
        ? { ...v, likeCount: wasLiked ? (v.likeCount || 1) - 1 : (v.likeCount || 0) + 1 }
        : v
    )
  );

  try {
    await axios.post('/api/food/like', { foodId }, { withCredentials: true });
  } catch (err) {
    console.error("like error:", err);

    // rollback if error
    setLikedSet(prev => {
      const next = new Set(prev);
      if (wasLiked) next.add(foodId);
      else next.delete(foodId);
      return next;
    });
  }
}


  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {videos.map((item) => {
          const isSaved = savedSet.has(item._id);

          return (
            <section key={item._id} className="reel" role="listitem">
              <video
                ref={setVideoRef(item._id)}
                className="reel-video"
                muted
                playsInline
                loop
                preload="metadata"
              >
                <source src={item.video} type="video/mp4" />
              </video>

              <div className="reel-overlay">
                <div className="reel-content">
                  <p className="reel-description">{item.description}</p>
                  <Link to={`/food-partner/${item.foodPatner}`} className="reel-btn">
                    Visit store
                  </Link>
                </div>
              </div>

             <div className="reel-actions" >
                  <div className="reel-action">
                    <button
                      type="button"
                      aria-label="Like"
                      onClick={() => handleLike(item._id)}
                      className={likedSet.has(item._id) ? "liked" : ""}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill={likedSet.has(item._id) ? "#ED2647" : "none"}
                        stroke={likedSet.has(item._id) ? "#ED2647" : "currentColor"}
                        strokeWidth="1.6"
                      >
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
                      </svg>
                    </button>
                    <div className="count">Likes: {item.likeCount ?? 0}</div>
                  </div>


                <div className="reel-action">
                  <button
                    type="button"
                    aria-label={isSaved ? 'Unsave' : 'Save'}
                    onClick={() => toggleSave(item._id)}
                    className={isSaved ? 'is-saved' : ''}
                    title={isSaved ? 'Unsave' : 'Save'}
                  >
                    {isSaved ? (
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M6 2h12v18l-6-4-6 4V2z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                        <path d="M6 2h12v18l-6-4-6 4V2z" />
                      </svg>
                    )}
                  </button>
                  <div className="count">{isSaved ? 'Saved' : 'Save'} : {item.saveCount ?? 0}</div>
                </div>

                <div className="reel-action">
                  <button type="button" aria-label="Comment">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                  <div className="count">Comment: {item.comments ?? 0}</div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Home;

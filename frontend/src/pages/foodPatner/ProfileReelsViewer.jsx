import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/profileReels.css';

const ProfileReelsViewer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const startIndex = Number(searchParams.get('start')) || 0;

  const [videos, setVideos] = useState([]);
  const [savedSet, setSavedSet] = useState(new Set());
  const nav = useNavigate();

  // IO
  const observerRef = useRef(null);
  const videoEls = useRef(new Map());

  // always send cookies
  axios.defaults.withCredentials = true;

  // Load profile videos
  useEffect(() => {
    axios
      .get(`/api/foodPatner/${id}`, { withCredentials: true })
      .then((res) => {
        const items = res.data?.foodPartner?.foodItems || [];
        setVideos(items);
      })
      .catch(() => setVideos([]));
  }, [id]);

  // Prefill saved items for this user
  useEffect(() => {
    axios
      .get('/api/food/saved')
      .then((res) => {
        const savedFoods = res.data?.saved || [];
        setSavedSet(new Set(savedFoods.map((f) => (f._id ? f._id : f.foodId?._id))));
      })
      .catch(() => setSavedSet(new Set()));
  }, []);

  // Build a stable ref setter per id
  const setVideoRef = (vid) => (el) => {
    const obs = observerRef.current;
    const prev = videoEls.current.get(vid);
    if (prev && obs) obs.unobserve(prev);

    if (!el) {
      videoEls.current.delete(vid);
      return;
    }
    videoEls.current.set(vid, el);
    if (obs) obs.observe(el);
  };

  // IntersectionObserver → auto play/pause
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

    // Observe anything already mounted
    videoEls.current.forEach((el) => observerRef.current.observe(el));

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      videoEls.current.clear();
    };
  }, []);

  // On first paint after videos load, jump to startIndex
  useEffect(() => {
    if (!videos.length) return;
    const container = document.querySelector('.profile-reels-feed');
    const target = container?.children?.[startIndex];
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [videos, startIndex]);

  // Like
  async function handleLike(foodId) {
    try {
      const res = await axios.post('/api/food/like', { foodId }, { withCredentials: true });
      // optimistic UI using server hint: if res.data.unliked present, decrement; else increment
      const unliked = !!res.data?.unliked;
      setVideos((prev) =>
        prev.map((v) =>
          (v._id || v.id) === foodId
            ? {
                ...v,
                likeCount: Math.max(0, (v.likeCount || 0) + (unliked ? -1 : 1)),
              }
            : v
        )
      );
    } catch (e) {
      alert('Please login as a user to like posts.');
    }
  }

  // Save/Unsave
  async function toggleSave(foodId) {
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
    } catch (e) {
      // rollback
      setSavedSet((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.add(foodId);
        else next.delete(foodId);
        return next;
      });
      alert('Please login as a user to save posts.');
    }
  }

  return (
    <div className="profile-reels-page">
      {/* Back */}
      <button
        type="button"
        className="viewer-back"
        onClick={() => nav(-1)}
        aria-label="Back"
      >
        ← Back
      </button>

      {/* Vertical feed */}
      <div className="profile-reels-feed" role="list">
        {videos.map((item) => {
          const vid = item._id || item.id;
          const isSaved = savedSet.has(vid);

          return (
            <section key={vid} className="profile-reel" role="listitem">
              <video
                ref={setVideoRef(vid)}
                className="profile-reel-video"
                muted
                playsInline
                loop
                preload="metadata"
              >
                <source src={item.video} type="video/mp4" />
              </video>

              {/* Overlay content (desc + visit store) */}
              <div className="reel-overlay">
                <div className="reel-content">
                  {!!item.description && (
                    <p className="reel-description">{item.description}</p>
                  )}
                  {!!item.foodPatner && (
                    <Link to={`/food-partner/${item.foodPatner}`} className="reel-btn">
                      Visit store
                    </Link>
                  )}
                </div>
              </div>

              {/* Actions (right stack) */}
              <div className="reel-actions">
                <div className="reel-action">
                  <button type="button" aria-label="Like" onClick={() => handleLike(vid)} className="like-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path
                        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  <div className="count">likes : {item.likeCount ?? item.likes ?? 0}</div>
                </div>

                <div className="reel-action">
                  <button
                    type="button"
                    aria-label={isSaved ? 'Unsave' : 'Save'}
                    onClick={() => toggleSave(vid)}
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
                  <div className="count">{isSaved ? 'Saved' : 'Save'}</div>
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

export default ProfileReelsViewer;

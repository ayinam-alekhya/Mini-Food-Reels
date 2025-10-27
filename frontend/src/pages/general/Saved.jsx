import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/saved.css';

const Saved = () => {
  const [items, setItems] = useState([]);       // saved videos (normalized)
  const [savedSet, setSavedSet] = useState(new Set()); // which foodIds are saved
  const videoRefs = useRef(new Map());
  const observerRef = useRef(null);
  const nav = useNavigate();

  // always send cookies
  axios.defaults.withCredentials = true;

  // Build a ref setter so IO can observe/unobserve correctly
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

  // IntersectionObserver once
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

    // observe any pre-set elements
    videoRefs.current.forEach((el) => observerRef.current.observe(el));

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      videoRefs.current.clear();
    };
  }, []);

  // Fetch saved items
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/food/saved'); // requires authUserMiddleware
        const raw = res.data?.saved || [];

        // Normalize shape (works whether API returned populated objects or direct foods)
        const normalized = raw.map((r) => {
          const f = r.video ? r : r.foodId || {};
          return {
            _id: f._id || r._id,                      // food id
            video: f.video,
            description: f.description || '',
            foodPatner: f.foodPatner,
            likeCount: typeof f.likeCount === 'number' ? f.likeCount : (f.likes ?? 0),
            saveCount: typeof f.saveCount === 'number' ? f.saveCount : (f.saves ?? 0),
          };
        });

        setItems(normalized);
        // Everything on this page is “saved” by definition
        setSavedSet(new Set(normalized.map((n) => n._id)));
      } catch (e) {
        console.error('Failed to load saved items', e);
        setItems([]);
        setSavedSet(new Set());
      }
    })();
  }, []);

  // Toggle Save (same behavior as Home, optimistic update)
  const toggleSave = async (foodId) => {
    const wasSaved = savedSet.has(foodId);

    // Optimistic UI on both count and savedSet
    setItems((prev) =>
      prev.map((it) =>
        it._id === foodId
          ? { ...it, saveCount: Math.max(0, (it.saveCount || 0) + (wasSaved ? -1 : 1)) }
          : it
      )
    );
    setSavedSet((prev) => {
      const next = new Set(prev);
      if (wasSaved) next.delete(foodId);
      else next.add(foodId);
      return next;
    });

    try {
      await axios.post('/api/food/save', { foodId }, { withCredentials: true });
      // Optional: if user unsaved on the Saved page, you can remove the card:
      // if (wasSaved) setItems(prev => prev.filter(it => it._id !== foodId));
    } catch (err) {
      console.error('toggleSave error:', err);
      // rollback
      setItems((prev) =>
        prev.map((it) =>
          it._id === foodId
            ? { ...it, saveCount: Math.max(0, (it.saveCount || 0) + (wasSaved ? 1 : -1)) }
            : it
        )
      );
      setSavedSet((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.add(foodId);
        else next.delete(foodId);
        return next;
      });
      alert('Please login as a user to save/unsave.');
    }
  };

  // Toggle Like (same as Home logic—your backend returns { like } when liked)
  const toggleLike = async (foodId) => {
    try {
      const res = await axios.post('/api/food/like', { foodId }, { withCredentials: true });
      const didLike = !!res.data?.like;

      setItems((prev) =>
        prev.map((it) =>
          it._id === foodId
            ? {
                ...it,
                likeCount: Math.max(0, (it.likeCount || 0) + (didLike ? 1 : -1)),
              }
            : it
        )
      );
    } catch (err) {
      console.error('toggleLike error:', err);
      alert('Please login as a user to like/unlike.');
    }
  };

  return (
    <div className="saved-reels-page">
      <div className="saved-reels-feed" role="list">
        {items.map((it) => {
          const isSaved = savedSet.has(it._id);
          return (
            <section key={it._id} className="saved-reel" role="listitem">
              <video
                ref={setVideoRef(it._id)}
                className="saved-reel-video"
                muted
                playsInline
                loop
                preload="metadata"
              >
                <source src={it.video} type="video/mp4" />
              </video>

              {/* Overlay (bottom meta + actions on right) */}
              <div className="saved-reel-overlay">
                {/* Back to previous page */}
                <button
                  type="button"
                  className="saved-back"
                  onClick={() => nav(-1)}
                  aria-label="Back"
                >
                  ← Back
                </button>

                <div className="saved-meta">
                  {it.description && (
                    <p className="saved-desc">{it.description}</p>
                  )}
                  {it.foodPatner && (
                    <Link className="saved-btn" to={`/food-partner/${it.foodPatner}`}>
                      Visit store
                    </Link>
                  )}
                </div>
              </div>

              {/* Actions (right side), same pattern as Home */}
              <div className="saved-actions">
                <div className="saved-action">
                  <button type="button" aria-label="Like" onClick={() => toggleLike(it._id)}>
                    {/* outline heart */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="20" height="20">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                  </button>
                  <div className="count">likes : {it.likeCount ?? 0}</div>
                </div>

                <div className="saved-action">
                  <button
                    type="button"
                    aria-label={isSaved ? 'Unsave' : 'Save'}
                    onClick={() => toggleSave(it._id)}
                    className={isSaved ? 'is-saved' : ''}
                    title={isSaved ? 'Unsave' : 'Save'}
                  >
                    {isSaved ? (
                      // filled bookmark
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M6 2h12v18l-6-4-6 4V2z" fill="currentColor" />
                      </svg>
                    ) : (
                      // outline bookmark
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                        <path d="M6 2h12v18l-6-4-6 4V2z" />
                      </svg>
                    )}
                  </button>
                  <div className="count">saved : {it.saveCount ?? 0}</div>
                </div>

                <div className="saved-action">
                  <button type="button" aria-label="Comment">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                  <div className="count">Comment: {it.comments ?? 0}</div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Saved;

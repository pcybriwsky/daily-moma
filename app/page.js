"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [artwork1, setArtwork1] = useState(null);
  const [artwork2, setArtwork2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [cacheInfo, setCacheInfo] = useState(null);

  useEffect(() => {
    async function fetchArtwork() {
      try {
        setLoading(true);
        
        // Fetch from our API route with date parameter
        const res = await fetch(`/api/artwork?date=${selectedDate}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        setArtwork1(data.artwork1);
        setArtwork2(data.artwork2);
        setCacheInfo(data.cacheInfo);
        
        // Set error message if using sample data
        if (data.source === 'sample') {
          setError(`Using sample data (${data.error})`);
        } else {
          setError(null);
        }
        
      } catch (err) {
        console.error('Error fetching artwork:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArtwork();
  }, [selectedDate]);

  if (loading) {
    return (
      <main className="container">
        <div className="loading">
          <h1>Daily MoMA Art</h1>
          <p>Loading today's artwork...</p>
        </div>
      </main>
    );
  }

  if (error && !artwork1) {
    return (
      <main className="container">
        <div className="error">
          <h1>Daily MoMA Art</h1>
          <p>Sorry, we couldn't load today's artwork.</p>
          <p className="error-message">{error}</p>
        </div>
      </main>
    );
  }

  if (!artwork1) {
    return (
      <main className="container">
        <div className="error">
          <h1>Daily MoMA Art</h1>
          <p>No artwork found for today.</p>
        </div>
      </main>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDisplayDate = (selectedDate) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  };

  const navigateDate = (direction) => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    
    // Don't allow dates before September 1st, 2024
    const minDate = new Date('2024-09-01');
    if (newDate < minDate) return;
    
    // Don't allow future dates
    const today = new Date();
    if (newDate > today) return;
    
    setSelectedDate(newDate.toISOString().slice(0, 10));
  };

  const isToday = selectedDate === new Date().toISOString().slice(0, 10);
  const isMinDate = selectedDate === '2024-09-01';

  return (
    <main className="container">
      <header>
        <h1>Daily MoMA Art</h1>
        <p className="subtitle">Discover a new piece of art from MoMA's collection every day</p>
        
        <div className="date-navigation">
          <button 
            onClick={() => navigateDate(-1)} 
            disabled={isMinDate}
            className="nav-button"
          >
            ← Previous
          </button>
          
          <div className="date-display">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min="2024-09-01"
              max={new Date().toISOString().slice(0, 10)}
              className="date-input"
            />
            <p className="date-text">{formatDate(getDisplayDate(selectedDate))}</p>
          </div>
          
          <button 
            onClick={() => navigateDate(1)} 
            disabled={isToday}
            className="nav-button"
          >
            Next →
          </button>
        </div>
      </header>
      
      {error && (
        <div className="notice">
          <p>⚠️ {error}</p>
        </div>
      )}
      
      <div className="artworks-container">
        <article className="artwork">
          <h2 className="artwork-title">{artwork1.Title}</h2>
          <h3 className="artist-name">{Array.isArray(artwork1.Artist) ? artwork1.Artist.join(', ') : artwork1.Artist}</h3>
          <div className="artwork-details">
            <p><strong>Date:</strong> {artwork1.Date}</p>
            <p><strong>Medium:</strong> {artwork1.Medium}</p>
            {artwork1.Department && <p><strong>Department:</strong> {artwork1.Department}</p>}
            {artwork1.Classification && <p><strong>Classification:</strong> {artwork1.Classification}</p>}
          </div>
          
          <a
            href={`https://www.moma.org/collection/works/${artwork1.ObjectID}`}
            target="_blank"
            rel="noreferrer"
            className="moma-link"
          >
            View on MoMA →
          </a>
        </article>

        <div className="artwork-divider">
          <span>+</span>
        </div>

        <article className="artwork">
          <h2 className="artwork-title">{artwork2.Title}</h2>
          <h3 className="artist-name">{Array.isArray(artwork2.Artist) ? artwork2.Artist.join(', ') : artwork2.Artist}</h3>
          <div className="artwork-details">
            <p><strong>Date:</strong> {artwork2.Date}</p>
            <p><strong>Medium:</strong> {artwork2.Medium}</p>
            {artwork2.Department && <p><strong>Department:</strong> {artwork2.Department}</p>}
            {artwork2.Classification && <p><strong>Classification:</strong> {artwork2.Classification}</p>}
          </div>
          
          <a
            href={`https://www.moma.org/collection/works/${artwork2.ObjectID}`}
            target="_blank"
            rel="noreferrer"
            className="moma-link"
          >
            View on MoMA →
          </a>
        </article>
      </div>
      
      <footer>
        <p>Artwork changes daily • Data from <a href="https://github.com/MuseumofModernArt/collection" target="_blank" rel="noreferrer">MoMA Collection</a></p>
        {cacheInfo && (
          <p className="cache-info">
            {cacheInfo.cached ? `📦 Cached data (${cacheInfo.cacheAge} min old)` : '🔄 Fresh data'}
          </p>
        )}
      </footer>
    </main>
  );
}

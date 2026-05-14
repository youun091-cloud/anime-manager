'use client';

import React, { useState, useEffect } from 'react';

export default function AnimeManager() {
  const [animes, setAnimes] = useState([]);
  const [newAnimeName, setNewAnimeName] = useState('');
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const loadData = () => {
      try {
        const saved = localStorage.getItem('anime-collection');
        if (saved) {
          const data = JSON.parse(saved);
          setAnimes(data.animes || []);
          setDocuments(data.documents || []);
          setVideos(data.videos || []);
          if (data.animes.length > 0) {
            setSelectedAnimeId(data.animes[0].id);
          }
        }
      } catch (e) {
        console.log('No saved data yet');
      }
    };
    loadData();
  }, []);

  const saveData = (newAnimes, newDocs, newVids) => {
    try {
      localStorage.setItem('anime-collection', JSON.stringify({
        animes: newAnimes,
        documents: newDocs,
        videos: newVids
      }));
    } catch (e) {
      console.error('Failed to save:', e);
    }
  };

  const addAnime = () => {
    if (newAnimeName.trim()) {
      const newAnime = {
        id: Date.now(),
        name: newAnimeName,
        dateAdded: new Date().toLocaleDateString('ar-IQ')
      };
      const updated = [...animes, newAnime];
      setAnimes(updated);
      setSelectedAnimeId(newAnime.id);
      setNewAnimeName('');
      saveData(updated, documents, videos);
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newDoc = {
          id: Date.now() + Math.random(),
          animeId: selectedAnimeId,
          name: file.name,
          type: file.type,
          size: (file.size / 1024).toFixed(2) + ' KB',
          dateAdded: new Date().toLocaleDateString('ar-IQ'),
          dataUrl: event.target.result
        };
        const updated = [...documents, newDoc];
        setDocuments(updated);
        saveData(animes, updated, videos);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newVideo = {
          id: Date.now() + Math.random(),
          animeId: selectedAnimeId,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          dateAdded: new Date().toLocaleDateString('ar-IQ'),
          dataUrl: event.target.result
        };
        const updated = [...videos, newVideo];
        setVideos(updated);
        saveData(animes, documents, updated);
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteAnime = (id) => {
    const updated = animes.filter(a => a.id !== id);
    setAnimes(updated);
    const newDocs = documents.filter(d => d.animeId !== id);
    const newVids = videos.filter(v => v.animeId !== id);
    setDocuments(newDocs);
    setVideos(newVids);
    if (selectedAnimeId === id) {
      setSelectedAnimeId(updated.length > 0 ? updated[0].id : null);
    }
    saveData(updated, newDocs, newVids);
  };

  const deleteDocument = (id) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    saveData(animes, updated, videos);
  };

  const deleteVideo = (id) => {
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    saveData(animes, documents, updated);
  };

  const selectedAnimeFiles = {
    docs: documents.filter(d => d.animeId === selectedAnimeId),
    videos: videos.filter(v => v.animeId === selectedAnimeId)
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9f7f4', padding: '2rem', direction: 'rtl' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>مدير مجموعة الأنمي</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 0.5rem', color: '#333' }}>إضافة أنمي جديد</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text"
                  placeholder="اسم الأنمي"
                  value={newAnimeName}
                  onChange={(e) => setNewAnimeName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAnime()}
                  style={{ flex: 1, padding: '10px 12px', fontSize: '14px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                <button 
                  onClick={addAnime}
                  style={{ padding: '10px 16px', background: '#007AFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                >
                  ➕ إضافة
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '1rem 0 0.5rem', color: '#666' }}>مجموعتي ({animes.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '400px', overflowY: 'auto' }}>
              {animes.map(anime => (
                <div
                  key={anime.id}
                  onClick={() => setSelectedAnimeId(anime.id)}
                  style={{
                    padding: '10px 12px',
                    background: selectedAnimeId === anime.id ? '#f0f0f0' : 'transparent',
                    border: '1px solid ' + (selectedAnimeId === anime.id ? '#ddd' : 'transparent'),
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px'
                  }}
                >
                  <span>{anime.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAnime(anime.id);
                    }}
                    style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '16px' }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {selectedAnimeId && animes.find(a => a.id === selectedAnimeId) ? (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 1.5rem', color: '#333' }}>
                  {animes.find(a => a.id === selectedAnimeId)?.name}
                </h2>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 1rem', color: '#333' }}>📄 المستندات</h3>
                  <div style={{
                    border: '2px dashed #ddd',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.xlsx"
                      onChange={handleDocumentUpload}
                      style={{ display: 'none' }}
                      id="doc-upload"
                    />
                    <label htmlFor="doc-upload" style={{ cursor: 'pointer', display: 'block' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>اسحب المستندات هنا أو اضغط للرفع</p>
                    </label>
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {selectedAnimeFiles.docs.map(doc => (
                      <div key={doc.id} style={{
                        background: '#f9f9f9',
                        padding: '12px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        border: '1px solid #eee'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <span>📄</span>
                          <div>
                            <p style={{ margin: '0', fontWeight: '500', color: '#333' }}>{doc.name}</p>
                            <p style={{ margin: '0', color: '#999' }}>{doc.size} • {doc.dateAdded}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 1rem', color: '#333' }}>🎬 الفيديوهات</h3>
                  <div style={{
                    border: '2px dashed #ddd',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoUpload}
                      style={{ display: 'none' }}
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" style={{ cursor: 'pointer', display: 'block' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎥</div>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>اسحب الفيديوهات هنا أو اضغط للرفع</p>
                    </label>
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {selectedAnimeFiles.videos.map(video => (
                      <div key={video.id} style={{
                        background: '#f9f9f9',
                        padding: '12px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        border: '1px solid #eee'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <span>🎬</span>
                          <div>
                            <p style={{ margin: '0', fontWeight: '500', color: '#333' }}>{video.name}</p>
                            <p style={{ margin: '0', color: '#999' }}>{video.size} • {video.dateAdded}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteVideo(video.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#999', paddingTop: '2rem' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
                <p>اختر أنمي من الجهة اليسرى أو أضف أنمي جديد</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

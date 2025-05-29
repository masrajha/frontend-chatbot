import React from 'react';

const SearchResults = ({ results }) => {
  // Fungsi untuk memformat waktu kuliah
  const formatWaktuKuliah = (waktu) => {
    if (!waktu) return '';
    
    // Handle format dengan dan tanpa dash
    if (waktu.includes('-')) {
      return waktu;
    }
    
    // Format waktu tanpa dash (contoh: "09151055")
    if (waktu.length === 8) {
      return `${waktu.substring(0,2)}:${waktu.substring(2,4)}-${waktu.substring(4,6)}:${waktu.substring(6,8)}`;
    }
    
    return waktu;
  };

  // Fungsi untuk memformat waktu seminar
  const formatWaktuSeminar = (tanggal, jam) => {
    if (!tanggal || !jam) return '';
    
    // Format tanggal (YYYY-MM-DD -> DD/MM/YYYY)
    const [tahun, bulan, hari] = tanggal.split('-');
    const formattedDate = `${hari}/${bulan}/${tahun}`;
    
    // Format jam (HH:MM:SS -> HH:MM)
    const formattedTime = jam.substring(0, 5);
    
    return `${formattedDate} ${formattedTime}`;
  };

  // Gabungkan semua dosen pembimbing untuk seminar
  const getDosenPembimbing = (seminar) => {
    const dosens = [];
    
    // Loop dari Dosen 1 hingga Dosen 3
    for (let i = 1; i <= 3; i++) {
      const key = `Dosen ${i}`;
      if (seminar[key] && seminar[key].trim() !== "") {
        dosens.push(seminar[key]);
      }
    }
    
    return dosens.join(', ');
  };

  const renderLecture = (lecture) => {
    // Gabungkan dosen PJ dan anggota jika ada
    let dosenText = lecture["Dosen PJ"] || '';
    if (lecture["Dosen Anggota"] && lecture["Dosen Anggota"].trim() !== "") {
      dosenText += dosenText ? `, ${lecture["Dosen Anggota"]}` : lecture["Dosen Anggota"];
    }

    return (
      <div className="result-card lecture">
        <div className="result-header">
          <h3>{lecture["NAMA MK"] || 'Mata Kuliah Tidak Tersedia'}</h3>
          <span className="result-type">Kuliah</span>
        </div>
        
        <div className="result-details">
          <p><strong>Kode:</strong> {lecture["KODE MK"] || '-'}</p>
          <p><strong>Dosen:</strong> {dosenText || '-'}</p>
          <p><strong>Hari:</strong> {lecture.Hari || '-'}</p>
          <p><strong>Waktu:</strong> {formatWaktuKuliah(lecture.Waktu) || '-'}</p>
          <p><strong>Ruang:</strong> {lecture.Ruang || '-'}</p>
          <p><strong>Kelas:</strong> {lecture["NAMA KELAS"] || '-'}</p>
          <p><strong>Program Studi:</strong> {lecture.PS || '-'}</p>
          <p><strong>Semester:</strong> {lecture.SEM || '-'}</p>
          
          {/* Tampilkan informasi normalisasi jika ada */}
          {Object.keys(lecture).filter(k => k.startsWith('norm_')).length > 0 && (
            <div className="normalized-info">
              <h5>Informasi Normalisasi:</h5>
              <div className="normalized-grid">
                {Object.entries(lecture)
                  .filter(([key]) => key.startsWith('norm_'))
                  .map(([key, value], i) => (
                    <div key={i} className="normalized-item">
                      <span className="normalized-key">{key.replace('norm_', '')}:</span>
                      <span className="normalized-value">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSeminar = (seminar) => {
    return (
      <div className="result-card seminar">
        <div className="result-header">
          <h3>{seminar.Judul || 'Judul Tidak Tersedia'}</h3>
          <span className="result-type">Seminar</span>
        </div>
        
        <div className="result-details">
          <p><strong>Mahasiswa:</strong> {seminar["Nama Mahasiswa"] || '-'}</p>
          <p><strong>NPM:</strong> {seminar.NPM || '-'}</p>
          <p><strong>Waktu:</strong> {formatWaktuSeminar(seminar.Tanggal, seminar.Jam) || '-'}</p>
          <p><strong>Pembimbing:</strong> {getDosenPembimbing(seminar) || '-'}</p>
          <p><strong>Jenis Seminar:</strong> {seminar.Seminar || '-'}</p>
          
          {/* Tampilkan informasi normalisasi jika ada */}
          {Object.keys(seminar).filter(k => k.startsWith('norm_')).length > 0 && (
            <div className="normalized-info">
              <h5>Informasi Normalisasi:</h5>
              <div className="normalized-grid">
                {Object.entries(seminar)
                  .filter(([key]) => key.startsWith('norm_'))
                  .map(([key, value], i) => (
                    <div key={i} className="normalized-item">
                      <span className="normalized-key">{key.replace('norm_', '')}:</span>
                      <span className="normalized-value">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="search-results">
      <div className="results-header">
        <h4>Hasil Pencarian:</h4>
      </div>
      
      <div className="results-container">
        {results.map((item, index) => {
          // Pastikan item memiliki jenis_data
          if (!item.jenis_data) {
            console.warn("Item tanpa jenis_data:", item);
            return null;
          }
          
          return (
            <div key={index}>
              {item.jenis_data === 'kuliah' && renderLecture(item)}
              {item.jenis_data === 'seminar' && renderSeminar(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
export const searchAcademicData = async (query) => {
  try {
    // const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.100.130:5000/search';
    const response = await fetch('https://a0c8-125-165-192-155.ngrok-free.app/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: query })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    
    return {
      data: responseData.data || [],
      entities: responseData.entities || {},
      search_types: responseData.search_types || [],
      message: responseData.message || 'Berhasil'
    };
    
  } catch (error) {
    console.error('API Error:', error);
    
    let errorMessage = 'Terjadi kesalahan saat memproses permintaan';
    if (error.name === 'TypeError') {
      errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi jaringan Anda.';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Server tidak merespons. Silakan coba lagi nanti.';
    }
    
    throw new Error(errorMessage);
  }
};
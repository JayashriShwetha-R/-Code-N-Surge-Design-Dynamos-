import React, { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi'; 
import { WiCloud } from 'react-icons/wi'; 

const API_KEY = '3818339adf67406d95f9a7818d784b54'; 
const WEATHER_API_KEY = '8130f1fa9283c0fc42880d1858b6cf61'; 

const WeatherInfo = ({ menuOpen }) => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`;
      const response = await fetch(weatherUrl);
      const data = await response.json();
      setLocation(data.name);
      setWeather(data.weather[0].description);
      setTemperature(data.main.temp);
      setIcon(data.weather[0].icon); 
    });
  }, []);

  
  if (menuOpen) return null;

  return (
    <div className="absolute top-0 right-0 p-4 flex items-center">
      <WiCloud size={30} className="mr-2" /> 
      <div>
        <p>{location}</p>
        <p>{weather}</p>
        <p>{temperature}°C</p>
      </div>
    </div>
  );
};


const SideNavBar = ({ setPage, isOpen, toggleMenu }) => (
  <div
    className={`bg-blue-500 w-64 min-h-screen fixed p-6 transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } transition-transform duration-300 ease-in-out`}
  >
    <button onClick={toggleMenu} className="text-white mb-4 text-2xl">
      ✕
    </button>
    <ul className="space-y-4">
      <li><button onClick={() => setPage('TIMES OF INDIA 24')} className="text-white hover:underline w-full text-left">Home</button></li>
      <li><button onClick={() => setPage('sports')} className="text-white hover:underline w-full text-left">Sports</button></li>
      <li><button onClick={() => setPage('politics')} className="text-white hover:underline w-full text-left">Politics</button></li>
      <li><button onClick={() => setPage('technology')} className="text-white hover:underline w-full text-left">Technology</button></li>
      <li><button onClick={() => setPage('research')} className="text-white hover:underline w-full text-left">Research</button></li>
      <li><button onClick={() => setPage('entertainment')} className="text-white hover:underline w-full text-left">Entertainment</button></li>
    </ul>
  </div>
);

const NewsPage = ({ category }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    const url = category === 'TIMES OF INDIA 24'
      ? `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
      : `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      setArticles(data.articles);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    const intervalId = setInterval(() => {
      fetchNews();
    }, 300000); 

    return () => clearInterval(intervalId); 
  }, [category]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className={`container mx-auto px-4 py-8 ${category ? 'ml-50' : ''}`}>
      <h1 className="text-4xl font-bold mb-8 text-center capitalize">{category} News</h1>
      <div className="grid grid-cols-0 md:grid-cols-1 lg:grid-cols-2 gap-5">
        {articles.map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('TIMES OF INDIA 24');
  const [menuOpen, setMenuOpen] = useState(false); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-20 text-3xl bg-blue-500 text-white p-2 rounded-md"
      >
        <FiMenu />
      </button>
      <SideNavBar setPage={setCurrentPage} isOpen={menuOpen} toggleMenu={toggleMenu} />
      <div className={`flex-1 transition-all duration-300 ${menuOpen ? 'ml-64' : 'ml-0'}`}>
        <WeatherInfo menuOpen={menuOpen} /> 
        <NewsPage category={currentPage} />
      </div>
    </div>
  );
};

export default App;


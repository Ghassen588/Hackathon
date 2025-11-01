"use client"

// This is 'full_smart_farm_app.jsx', modified to work with the Flask API

const { useState, useEffect } = React;

// --- Authentication Page Component ---
// Now calls the API instead of using localStorage
function AuthPage({ onLoginSuccess, error, clearError }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [cin, setCin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setLocalError(error); // Show errors from the main app
  }, [error]);

  // Clear errors when switching modes or typing
  const handleModeChange = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setLocalError('');
    clearError();
  }
  const handleCinChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (val.length <= 8) {
      setCin(val);
    }
    setLocalError('');
    clearError();
  };
   const handlePassChange = (e) => {
    setPassword(e.target.value);
    setLocalError('');
    clearError();
  };
   const handleUserChange = (e) => {
    setUsername(e.target.value);
    setLocalError('');
    clearError();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cin || !password || (mode === 'signup' && !username)) {
      setLocalError("Please fill in all fields.");
      return;
    }
    if (cin.length !== 8) {
      setLocalError("Code (CIN) must be 8 digits.");
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    
    setLoading(true);
    setLocalError('');
    clearError();

    const url = mode === 'login' ? '/api/login' : '/api/signup';
    const payload = mode === 'login' 
      ? { cin, password } 
      : { username, cin, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data); // Pass user data up to App
      } else {
        setLocalError(data.error || 'An error occurred.');
      }
    } catch (err) {
      setLocalError('Could not connect to the server.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <h1 className="text-5xl text-center mb-6">
          {mode === 'login' ? '👋' : '🌱'}
        </h1>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="relative">
              <label htmlFor="username" className="absolute -top-3 left-4 bg-white px-2 text-2xl">👤</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleUserChange}
                placeholder="Your Name"
                required
                className="w-full px-5 py-4 text-lg text-gray-700 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          )}
          
          <div className="relative">
            <label htmlFor="cin" className="absolute -top-3 left-4 bg-white px-2 text-2xl">🔢</label>
            <input
              id="cin"
              type="password"
              value={cin}
              onChange={handleCinChange}
              placeholder="8-Digit Code (CIN)"
              required
              pattern="\d{8}"
              title="Must be 8 digits"
              className="w-full px-5 py-4 text-lg text-gray-700 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="absolute -top-3 left-4 bg-white px-2 text-2xl">🔒</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePassChange}
              placeholder="Password"
              required
              minLength={6}
              className="w-full px-5 py-4 text-lg text-gray-700 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          {localError && (
            <p className="text-red-500 text-center">{localError}</p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full text-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? '⏳' : (mode === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={handleModeChange}
            className="text-gray-600 hover:text-blue-500 text-lg transition"
          >
            {mode === 'login' ? (
              <span className="text-lg">Need an account? <strong>Sign Up</strong></span>
            ) : (
              <span className="text-lg">Already have an account? <strong>Login</strong></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


// --- Irrigation Dashboard Component ---
// This component is now "dumb" - it just receives data and handlers
function IrrigationDashboard({ mapData}) {
  
  const { soil: slimmyZoneSoil, pumps: slimmyZonePumps } = mapData;

  // If data isn't loaded yet, show a loader
  if (!slimmyZoneSoil || !slimmyZonePumps) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center">
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-2xl border-2 border-gray-100 max-w-6xl w-full text-center">
          <span className="text-4xl">Loading Map Data...</span>
        </div>
      </div>
    );
  }

  // --- SVG Paths and Positions (unchanged) ---
  const tomatoSlimmyPaths = [
    "M 50 50 L 300 50 L 320 150 L 50 150 Z",
    "M 50 150 L 320 150 L 290 250 L 50 250 Z",
    "M 50 250 L 290 250 L 280 350 L 50 350 Z",
    "M 50 350 L 280 350 L 290 450 L 50 450 Z",
    "M 50 450 L 290 450 L 300 550 L 50 550 Z"
  ];
  const tomatoPumpPositions = [
    { x: 175, y: 100 }, { x: 180, y: 200 }, { x: 170, y: 300 }, { x: 170, y: 400 }, { x: 175, y: 500 }
  ];
  const tomatoEmojiPositions = [
    { x: 65, y: 75 }, { x: 65, y: 175 }, { x: 65, y: 275 }, { x: 65, y: 375 }, { x: 65, y: 475 }
  ];

  const onionSlimmyPaths = [
    "M 300 50 L 375 50 L 375 255 L 320 250 L 320 150 Z",
    "M 375 50 L 450 50 L 450 260 L 375 255 Z",
    "M 450 50 L 525 50 L 525 265 L 450 260 Z",
    "M 525 50 L 600 50 L 600 270 L 525 265 Z",
    "M 600 50 L 675 50 L 675 275 L 600 270 Z",
    "M 675 50 L 750 50 L 730 280 L 675 275 Z"
  ];
  const onionPumpPositions = [
    { x: 340, y: 150 }, { x: 412, y: 155 }, { x: 487, y: 155 }, { x: 562, y: 160 }, { x: 637, y: 160 }, { x: 710, y: 165 }
  ];
  const onionEmojiPositions = [
    { x: 315, y: 75 }, { x: 390, y: 75 }, { x: 465, y: 75 }, { x: 540, y: 75 }, { x: 615, y: 75 }, { x: 690, y: 75 }
  ];

  const mintSlimmyPaths = [
    "M 280 350 L 320 250 L 425 260 L 425 550 L 300 550 Z",
    "M 425 260 L 550 270 L 550 550 L 425 550 Z",
    "M 550 270 L 675 275 L 675 550 L 550 550 Z",
    "M 675 275 L 730 280 L 750 550 L 675 550 Z"
  ];
  const mintPumpPositions = [
    { x: 360, y: 400 }, { x: 487, y: 410 }, { x: 612, y: 410 }, { x: 710, y: 415 }
  ];
  const mintEmojiPositions = [
    { x: 300, y: 375 }, { x: 440, y: 300 }, { x: 565, y: 300 }, { x: 690, y: 300 }
  ];
  
  const getPumpStatusColor = (status) => {
    if (status) return "#22c55e"; // green
    return "#ef4444"; // red
  }
  
  // --- Component Render ---
  return (
    <div className="p-4 md:p-8 flex items-center justify-center">
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-2xl border-2 border-gray-100 max-w-6xl w-full">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <span className="text-xl">🗺️</span>
            Land Map - Field Layout
          </h2>

          <div className="bg-stone-50 rounded-xl p-4 border border-gray-200">
            <svg viewBox="0 0 800 600" className="w-full h-auto">
              <rect width="800" height="600" fill="#f7f3e8" />
              <path
                d="M 50 50 L 750 50 L 750 550 L 50 550 Z"
                fill="none"
                stroke="black"
                strokeWidth="3"
                strokeDasharray="8,4"
              />

              {/* Tomatoes Zone */}
              <g id="tomatoes-zone">
                <path
                  d="M 50 50 L 300 50 L 320 150 L 280 350 L 300 550 L 50 550 Z"
                  fill="none"
                  stroke="black"
                  strokeWidth="3"
                  opacity="1"
                />
                <g>
                  {tomatoSlimmyPaths.map((path, index) => (
                    <g key={`tomato-slim-group-${index}`}>
                      <path
                        d={path}
                        fill={slimmyZoneSoil.tomatoes[index] ? "#eab308" : "#3b82f6"}
                        stroke="black"
                        strokeWidth="2"
                        opacity="0.8"
                        onClick={() => onZoneClick('tomatoes', index, !slimmyZoneSoil.tomatoes[index])}
                        style={{ cursor: "pointer" }}
                        title={slimmyZoneSoil.tomatoes[index] ? "Soil: Needs Water (Click to change)" : "Soil: Watered (Click to change)"}
                      />
                       <text x={tomatoEmojiPositions[index].x} y={tomatoEmojiPositions[index].y} fontSize="24" pointerEvents="none">🍅</text>
                    </g>
                  ))}
                </g>
                <g>
                  {tomatoPumpPositions.map((pos, index) => (
                    <circle
                      key={`tomato-pump-${index}`}
                      cx={pos.x} cy={pos.y} r="12"
                      fill={getPumpStatusColor(slimmyZonePumps.tomatoes[index])}
                      stroke="white" strokeWidth="2"
                      onClick={(e) => onPumpClick(e, 'tomatoes', index, !slimmyZonePumps.tomatoes[index])}
                      style={{ cursor: "pointer" }}
                      title={slimmyZonePumps.tomatoes[index] ? "Pump: ON (Click to turn OFF)" : "Pump: OFF (Click to turn ON)"}
                    >
                      {slimmyZonePumps.tomatoes[index] && <animate attributeName="r" values="12;14;12" dur="1s" repeatCount="indefinite" />}
                    </circle>
                  ))}
                </g>
              </g>

              {/* Onions Zone */}
              <g id="onions-zone">
                <path
                  d="M 300 50 L 750 50 L 730 280 L 320 250 L 320 150 Z"
                  fill="none"
                  stroke="black"
                  strokeWidth="3"
                  opacity="1"
                />
                <g>
                  {onionSlimmyPaths.map((path, index) => (
                    <g key={`onion-slim-group-${index}`}>
                      <path
                        d={path}
                        fill={slimmyZoneSoil.onions[index] ? "#eab308" : "#3b82f6"}
                        stroke="black"
                        strokeWidth="2"
                        opacity="0.8"
                        onClick={() => onZoneClick('onions', index, !slimmyZoneSoil.onions[index])}
                        style={{ cursor: "pointer" }}
                        title={slimmyZoneSoil.onions[index] ? "Soil: Needs Water (Click to change)" : "Soil: Watered (Click to change)"}
                      />
                      <text x={onionEmojiPositions[index].x} y={onionEmojiPositions[index].y} fontSize="24" pointerEvents="none">🧅</text>
                    </g>
                  ))}
                </g>
                <g>
                  {onionPumpPositions.map((pos, index) => (
                    <circle
                      key={`onion-pump-${index}`}
                      cx={pos.x} cy={pos.y} r="12"
                      fill={getPumpStatusColor(slimmyZonePumps.onions[index])}
                      stroke="white" strokeWidth="2"
                      onClick={(e) => onPumpClick(e, 'onions', index, !slimmyZonePumps.onions[index])}
                      style={{ cursor: "pointer" }}
                      title={slimmyZonePumps.onions[index] ? "Pump: ON (Click to turn OFF)" : "Pump: OFF (Click to turn ON)"}
                    >
                      {slimmyZonePumps.onions[index] && <animate attributeName="r" values="12;14;12" dur="1s" repeatCount="indefinite" />}
                    </circle>
                  ))}
                </g>
              </g>

              {/* Mint Zone */}
              <g id="mint-zone">
                <path
                  d="M 280 350 L 320 250 L 730 280 L 750 550 L 300 550 Z"
                  fill="none"
                  stroke="black"
                  strokeWidth="3"
                  opacity="1"
                />
                <g>
                  {mintSlimmyPaths.map((path, index) => (
                    <g key={`mint-slim-group-${index}`}>
                      <path
                        d={path}
                        fill={slimmyZoneSoil.mint[index] ? "#eab308" : "#3b82f6"}
                        stroke="black"
                        strokeWidth="2"
                        opacity="0.8"
                        onClick={() => onZoneClick('mint', index, !slimmyZoneSoil.mint[index])}
                        style={{ cursor: "pointer" }}
                        title={slimmyZoneSoil.mint[index] ? "Soil: Needs Water (Click to change)" : "Soil: Watered (Click to change)"}
                      />
                       <text x={mintEmojiPositions[index].x} y={mintEmojiPositions[index].y} fontSize="24" pointerEvents="none">🌿</text>
                    </g>
                  ))}
                </g>
                <g>
                  {mintPumpPositions.map((pos, index) => (
                    <circle
                      key={`mint-pump-${index}`}
                      cx={pos.x} cy={pos.y} r="12"
                      fill={getPumpStatusColor(slimmyZonePumps.mint[index])}
                      stroke="white" strokeWidth="2"
                      onClick={(e) => onPumpClick(e, 'mint', index, !slimmyZonePumps.mint[index])}
                      style={{ cursor: "pointer" }}
                      title={slimmyZonePumps.mint[index] ? "Pump: ON (Click to turn OFF)" : "Pump: OFF (Click to turn ON)"}
                    >
                      {slimmyZonePumps.mint[index] && <animate attributeName="r" values="12;14;12" dur="1s" repeatCount="indefinite" />}
                    </circle>
                  ))}
                </g>
              </g>

              <text x="400" y="30" fontSize="16" fontWeight="600" textAnchor="middle" fill="#374151">
                Field Layout
              </text>
            </svg>
          </div>

          {/* Map Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200 bg-slate-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-semibold text-gray-700 text-sm mb-2">Zones:</div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded" style={{backgroundColor: "#fee2e2", border: "2px solid #ef4444"}}></div>
                  <span>Zone A - Tomatoes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded" style={{backgroundColor: "#f3e8ff", border: "2px solid #a855f7"}}></div>
                  <span>Zone B - Onions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded" style={{backgroundColor: "#d1fae5", border: "2px solid #10b981"}}></div>
                  <span>Zone C - Mint</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-gray-700 text-sm mb-2">Slimmy Zone Soil:</div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3b82f6" }}></div>
                  <span>Watered (Click zone to change)</span>
                </div>
                 <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#eab308" }}></div>
                  <span>Needs Water (Click zone to change)</span>
                </div>

                <div className="font-semibold text-gray-700 text-sm mb-2 mt-2">Slimmy Zone Pump:</div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#22c55e" }}></div>
                  <span>Pump ON (Click pump to change)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ef4444" }}></div>
                  <span>Pump OFF (Click pump to change)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

// --- Weather Page Component ---
// Fetches data from the API
function WeatherPage() {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        if (response.ok) {
          const data = await response.json();
          setForecastData(data);
        }
      } catch (e) {
        console.error("Failed to fetch weather", e);
      }
      setLoading(false);
    };
    fetchWeather();
  }, []); // Runs once on component mount

  if (loading) {
    return (
       <div className="p-4 md:p-8 flex items-center justify-center">
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-2xl border-2 border-gray-100 max-w-6xl w-full text-center">
          <span className="text-4xl">Loading Weather...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex items-center justify-center">
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-2xl border-2 border-gray-100 max-w-6xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
          <span className="text-4xl">🌦️</span>
          7-Day Forecast
        </h2>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-4 p-4">
            {forecastData.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 bg-slate-50 rounded-2xl p-6 shadow-lg border border-gray-200 text-center transition duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="text-xl font-semibold text-gray-700 mb-2">{item.day}</div>
                <div className="text-6xl mb-4">{item.emoji}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{item.high}</div>
                <div className="text-2xl text-gray-500">{item.low}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Notifications Page Component ---
// Reads data from the mapData prop
function NotificationsPage({ mapData }) {
  const [dismissed, setDismissed] = useState([]);

  const slimmyZoneSoil = mapData.soil;
  
  // 1. Generate notifications based on soil state
  const allNotifications = [];
  
  if (slimmyZoneSoil) {
    if (slimmyZoneSoil.tomatoes.some(needsWater => needsWater === true)) {
      allNotifications.push({ id: 'tomatoes', plantName: 'Tomatoes', emoji: '🍅' });
    }
    if (slimmyZoneSoil.onions.some(needsWater => needsWater === true)) {
      allNotifications.push({ id: 'onions', plantName: 'Onions', emoji: '🧅' });
    }
    if (slimmyZoneSoil.mint.some(needsWater => needsWater === true)) {
      allNotifications.push({ id: 'mint', plantName: 'Mint', emoji: '🌿' });
    }
  }

  // 2. Filter out any notifications that have been dismissed
  const activeNotifications = allNotifications.filter(
    (notif) => !dismissed.includes(notif.id)
  );

  // 3. Handle clicking a notification
  const handleNotificationClick = (notification) => {
    try {
      const utterance = new SpeechSynthesisUtterance(`Water the ${notification.plantName}`);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis failed:", e);
    }
    setDismissed((prevDismissed) => [...prevDismissed, notification.id]);
  };

  return (
    <div className="p-4 md:p-8 flex items-center justify-center">
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-2xl border-2 border-gray-100 max-w-6xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
          <span className="text-4xl">🔔</span>
          Notifications
        </h2>
        
        <div className="space-y-4">
          {!slimmyZoneSoil ? (
             <div className="text-center p-10 bg-gray-50 rounded-lg">
              <p className="text-3xl font-semibold text-gray-700 mt-4">Loading notifications...</p>
            </div>
          ) : activeNotifications.length === 0 ? (
            <div className="text-center p-10 bg-green-50 rounded-lg">
              <span className="text-7xl">✅</span>
              <p className="text-3xl font-semibold text-green-700 mt-4">All good!</p>
              <p className="text-xl text-gray-600">No plants need watering right now.</p>
            </div>
          ) : (
            activeNotifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className="w-full flex items-center justify-between p-6 bg-yellow-100 border-l-8 border-yellow-500 rounded-lg shadow-lg transition transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <div className="flex items-center gap-5">
                  <span className="text-6xl">{notif.emoji}</span>
                  <div>
                    <p className="text-3xl font-bold text-yellow-800">{notif.plantName} Needs Water</p>
                    <p className="text-lg text-yellow-700 text-left">Click to hear alert and dismiss</p>
                  </div>
                </div>
                <span className="text-5xl text-yellow-600 animate-pulse">💧</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


// --- Main Application Component ---
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [currentPage, setCurrentPage] = useState('map');
  const [appLoading, setAppLoading] = useState(true); // Loading state for session check

  // --- Map Data State ---
  const [mapData, setMapData] = useState({ soil: null, pumps: null });

  // --- Check session on app load ---
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (e) {
        console.error("Session check failed", e);
      }
      setAppLoading(false);
    };
    checkSession();
  }, []);

  // --- Fetch map data when user logs in ---
  useEffect(() => {
    const fetchMapData = async () => {
      if (currentUser) {
        try {
          const response = await fetch('/api/map_data');
          if (response.ok) {
            const data = await response.json();
            setMapData({ soil: data.soil, pumps: data.pumps });
          } else {
            // Handle error, e.g., session expired
            handleLogout(); 
          }
        } catch (e) {
          console.error("Failed to fetch map data", e);
        }
      }
    };
    fetchMapData();
  }, [currentUser]); // Run this effect when currentUser changes

  // --- API Handlers ---

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentPage('map');
    setAuthError('');
  };
  
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setCurrentUser(null);
    setMapData({ soil: null, pumps: null }); // Clear data
    setAuthError('');
  };

  // --- Map Click Handlers ---
  // These now update state optimistically and call the API
  
  const handleSlimmyZoneClick = async (plant_type, zone_index, new_state) => {
    // 1. Optimistic local update
    setMapData(prevData => ({
      ...prevData,
      soil: {
        ...prevData.soil,
        [plant_type]: prevData.soil[plant_type].map((s, i) => i === zone_index ? new_state : s)
      }
    }));
    
    // 2. Send update to server
    try {
      await fetch('/api/update_soil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_type, zone_index, new_state })
      });
      // In a real app, you'd handle errors here
    } catch (e) {
      console.error("Failed to update soil", e);
      // TODO: Revert optimistic update on failure
    }
  };
  
  const handleSlimmyPumpClick = async (e, plant_type, zone_index, new_state) => {
    e.stopPropagation();
    // 1. Optimistic local update
    setMapData(prevData => ({
      ...prevData,
      pumps: {
        ...prevData.pumps,
        [plant_type]: prevData.pumps[plant_type].map((p, i) => i === zone_index ? new_state : p)
      }
    }));
    
    // 2. Send update to server
    try {
      await fetch('/api/update_pump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_type, zone_index, new_state })
      });
    } catch (e) {
      console.error("Failed to update pump", e);
      // TODO: Revert optimistic update on failure
    }
  };

  // --- UI Rendering ---

  // Helper for nav button style
  const getNavButtonClass = (pageName) => {
    const baseClass = "text-2xl font-medium py-3 px-6 rounded-lg shadow transition transform hover:scale-105";
    if (currentPage === pageName) {
      return `${baseClass} bg-blue-500 text-white`;
    }
    return `${baseClass} bg-white text-gray-700 hover:bg-gray-50`;
  };

  // Notification Badge Logic
  const hasNotifications = mapData.soil && 
    (mapData.soil.tomatoes.some(s => s === true) ||
     mapData.soil.onions.some(s => s === true) ||
     mapData.soil.mint.some(s => s === true));

  // Show a full-page loader while checking session
  if (appLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <span className="text-4xl">Loading App...</span>
      </div>
    );
  }

  // --- Main Render ---
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <header className="bg-white/80 backdrop-blur-sm p-4 shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            🌱 Welcome, {currentUser.username}!
          </h1>
          <button
            onClick={handleLogout}
            className="text-lg font-medium bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-lg shadow transition"
          >
            Logout
          </button>
        </header>

        <nav className="flex justify-center items-center gap-4 p-4">
          <button
            onClick={() => setCurrentPage('map')}
            className={getNavButtonClass('map')}
          >
            🗺️ Map
          </button>
          <button
            onClick={() => setCurrentPage('weather')}
            className={getNavButtonClass('weather')}
          >
            🌦️ Weather
          </button>
          <button
            onClick={() => setCurrentPage('notifications')}
            className={`${getNavButtonClass('notifications')} relative`}
          >
            🔔 Notifications
            {hasNotifications && currentPage !== 'notifications' && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                !
              </span>
            )}
          </button>
        </nav>

        <main>
          {currentPage === 'map' && (
            <IrrigationDashboard 
              mapData={mapData}
            />
          )}
          {currentPage === 'weather' && <WeatherPage />}
          {currentPage === 'notifications' && (
            <NotificationsPage 
              mapData={mapData}
            />
          )}
        </main>
      </div>
    );
  }

  // User is not logged in
  return (
    <AuthPage 
      onLoginSuccess={handleLoginSuccess} 
      error={authError}
      clearError={() => setAuthError('')}
    />
  );
}

// --- Mount the App ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


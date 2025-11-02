import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import WeatherPage from "./pages/WeatherPage";
import NotificationsPage from "./pages/NotificationsPage";
import HelpButton from "./components/HelpButton";
import { useSession } from "./hooks/useSession";
import PricingPage from "./pages/PricingPage";
import { useTranslation } from "react-i18next";
// @ts-nocheck
// --- SVG Paths and Positions (unchanged) ---
const tomatoSlimmyPaths = [
  "M 50 50 L 300 50 L 320 150 L 50 150 Z",
  "M 50 150 L 320 150 L 290 250 L 50 250 Z",
  "M 50 250 L 290 250 L 280 350 L 50 350 Z",
  "M 50 350 L 280 350 L 290 450 L 50 450 Z",
  "M 50 450 L 290 450 L 300 550 L 50 550 Z",
];
const tomatoPumpPositions = [
  { x: 175, y: 100 },
  { x: 180, y: 200 },
  { x: 170, y: 300 },
  { x: 170, y: 400 },
  { x: 175, y: 500 },
];
const tomatoEmojiPositions = [
  { x: 65, y: 75 },
  { x: 65, y: 175 },
  { x: 65, y: 275 },
  { x: 65, y: 375 },
  { x: 65, y: 475 },
];

const onionSlimmyPaths = [
  "M 300 50 L 375 50 L 375 255 L 320 250 L 320 150 Z",
  "M 375 50 L 450 50 L 450 260 L 375 255 Z",
  "M 450 50 L 525 50 L 525 265 L 450 260 Z",
  "M 525 50 L 600 50 L 600 270 L 525 265 Z",
  "M 600 50 L 675 50 L 675 275 L 600 270 Z",
  "M 675 50 L 750 50 L 730 280 L 675 275 Z",
];
const onionPumpPositions = [
  { x: 340, y: 150 },
  { x: 412, y: 155 },
  { x: 487, y: 155 },
  { x: 562, y: 160 },
  { x: 637, y: 160 },
  { x: 710, y: 165 },
];
const onionEmojiPositions = [
  { x: 315, y: 75 },
  { x: 390, y: 75 },
  { x: 465, y: 75 },
  { x: 540, y: 75 },
  { x: 615, y: 75 },
  { x: 690, y: 75 },
];

const mintSlimmyPaths = [
  "M 280 350 L 320 250 L 425 260 L 425 550 L 300 550 Z",
  "M 425 260 L 550 270 L 550 550 L 425 550 Z",
  "M 550 270 L 675 275 L 675 550 L 550 550 Z",
  "M 675 275 L 730 280 L 750 550 L 675 550 Z",
];
const mintPumpPositions = [
  { x: 360, y: 400 },
  { x: 487, y: 410 },
  { x: 612, y: 410 },
  { x: 710, y: 415 },
];
const mintEmojiPositions = [
  { x: 300, y: 375 },
  { x: 440, y: 300 },
  { x: 565, y: 300 },
  { x: 690, y: 300 },
];

function App() {
  const {
    currentUser,
    authError,
    setAuthError,
    setCurrentUser,
    appLoading,
    checkSession,
    logout,
  } = useSession();

  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState("map");

  // centralized map data
  const [mapData, setMapData] = useState<any | null>(null);

  useEffect(() => {
    // hook already checks session on mount, but calling again is harmless
    checkSession();
  }, [checkSession]);

  // fetch map when user is present
  useEffect(() => {
    const fetchMap = async () => {
      if (!currentUser) {
        setMapData(null);
        return;
      }
      try {
        const res = await fetch("/api/map_data");
        if (res.ok) {
          const data = await res.json();
          // ensure shape
          setMapData({
            soil: data.soil ?? { tomatoes: [], onions: [], mint: [] },
            pumps: data.pumps ?? { tomatoes: [], onions: [], mint: [] },
          });
          return;
        }
      } catch (e) {
        console.warn("/api/map not available", e);
      }
      // fallback
      setMapData({
        soil: { tomatoes: [], onions: [], mint: [] },
        pumps: { tomatoes: [], onions: [], mint: [] },
      });
    };
    fetchMap();
  }, [currentUser]);

  // --- normalize names used in JSX (was slimmyZoneSoil / slimmyZonePumps) ---
  const soil = mapData?.soil ?? {
    tomatoes: Array(tomatoSlimmyPaths.length).fill(false),
    onions: Array(onionSlimmyPaths.length).fill(false),
    mint: Array(mintSlimmyPaths.length).fill(false),
  };

  const pumps = mapData?.pumps ?? {
    tomatoes: Array(tomatoPumpPositions.length).fill(false),
    onions: Array(onionPumpPositions.length).fill(false),
    mint: Array(mintPumpPositions.length).fill(false),
  };

  const getPumpStatusColor = (status: boolean) =>
    status ? "#10B981" : "#cf3232ff";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setMapData(null);
    }
  };

  if (appLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <span className="text-4xl">{t("common.loadingApp")}</span>
      </div>
    );
  }

  // compute notification badge
  const hasNotifications =
    !!mapData &&
    (mapData.soil?.tomatoes?.some((s: boolean) => s === true) ||
      mapData.soil?.onions?.some((s: boolean) => s === true) ||
      mapData.soil?.mint?.some((s: boolean) => s === true));

  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <header className="bg-white/80 backdrop-blur-sm p-4 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {t("common.welcome", { name: currentUser.username })}
          </h1>
          {/* keep header logout only on sm+ screens */}
          <button
            onClick={handleLogout}
            style={{ touchAction: "manipulation" }}
            className="hidden sm:inline-flex text-base sm:text-lg font-medium bg-red-500 hover:bg-red-600 text-white py-2 px-4 sm:py-2 sm:px-5 rounded-lg shadow transition"
          >
            {t("common.logout")}
          </button>
        </header>

        <nav className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 p-4">
          <button
            onClick={() => setCurrentPage("map")}
            style={{ touchAction: "manipulation" }}
            className={`text-lg sm:text-2xl font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow transition transform hover:scale-105 ${
              currentPage === "map"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("common.mapTitle")}
          </button>
          <button
            onClick={() => setCurrentPage("weather")}
            style={{ touchAction: "manipulation" }}
            className={`text-lg sm:text-2xl font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow transition transform hover:scale-105 ${
              currentPage === "weather"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("common.weatherTitle")}
          </button>
          <button
            onClick={() => setCurrentPage("notifications")}
            style={{ touchAction: "manipulation" }}
            className={`text-lg sm:text-2xl font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow transition transform hover:scale-105 relative ${
              currentPage === "notifications"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("common.notificationsTitle")}
            {hasNotifications && currentPage !== "notifications" && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                !
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentPage("pricing")}
            style={{ touchAction: "manipulation" }}
            className={`text-lg sm:text-2xl font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow transition transform hover:scale-105 ${
              currentPage === "pricing"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("common.pricingTitle")}
          </button>
        </nav>

        <main className="px-3 sm:px-6 pb-8">
          {currentPage === "map" && (
            <div className="bg-stone-50 rounded-xl p-3 sm:p-4 border border-gray-200 max-w-[900px] mx-auto w-full">
              <svg
                viewBox="0 0 800 600"
                // slightly smaller on mobile, keep readable on larger screens
                className="w-full h-auto transform scale-90 sm:scale-95"
                style={{ touchAction: "manipulation" }}
              >
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
                          fill={soil.tomatoes[index] ? "#eab308" : "#3b82f6"}
                          stroke="black"
                          strokeWidth="2"
                          opacity="0.8"
                          style={{ cursor: "pointer" }}
                        >
                          <title>
                            {soil.tomatoes[index]
                              ? t("map.soilNeeds")
                              : t("map.soilWatered")}
                          </title>
                        </path>
                        <text
                          x={tomatoEmojiPositions[index].x}
                          y={tomatoEmojiPositions[index].y}
                          fontSize="24"
                          pointerEvents="none"
                        >
                          🍅
                        </text>
                      </g>
                    ))}
                  </g>
                  <g>
                    {tomatoPumpPositions.map((pos, index) => (
                      <circle
                        key={`tomato-pump-${index}`}
                        cx={pos.x}
                        cy={pos.y}
                        r="12"
                        fill={getPumpStatusColor(pumps.tomatoes[index])}
                        stroke="white"
                        strokeWidth="2"
                        style={{ cursor: "pointer" }}
                      >
                        <title>
                          {pumps.tomatoes[index]
                            ? t("map.pumpOn")
                            : t("map.pumpOff")}
                        </title>
                        {pumps.tomatoes[index] && (
                          <animate
                            attributeName="r"
                            values="12;14;12"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        )}
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
                          fill={soil.onions[index] ? "#eab308" : "#3b82f6"}
                          stroke="black"
                          strokeWidth="2"
                          opacity="0.8"
                          style={{ cursor: "pointer" }}
                        >
                          <title>
                            {soil.onions[index]
                              ? t("map.soilNeeds")
                              : t("map.soilWatered")}
                          </title>
                        </path>
                        <text
                          x={onionEmojiPositions[index].x}
                          y={onionEmojiPositions[index].y}
                          fontSize="24"
                          pointerEvents="none"
                        >
                          🧅
                        </text>
                      </g>
                    ))}
                  </g>
                  <g>
                    {onionPumpPositions.map((pos, index) => (
                      <circle
                        key={`onion-pump-${index}`}
                        cx={pos.x}
                        cy={pos.y}
                        r="12"
                        fill={getPumpStatusColor(pumps.onions[index])}
                        stroke="white"
                        strokeWidth="2"
                        style={{ cursor: "pointer" }}
                      >
                        <title>
                          {pumps.onions[index]
                            ? t("map.pumpOn")
                            : t("map.pumpOff")}
                        </title>
                        {pumps.onions[index] && (
                          <animate
                            attributeName="r"
                            values="12;14;12"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        )}
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
                          fill={soil.mint[index] ? "#eab308" : "#3b82f6"}
                          stroke="black"
                          strokeWidth="2"
                          opacity="0.8"
                          style={{ cursor: "pointer" }}
                        >
                          <title>
                            {soil.mint[index]
                              ? t("map.soilNeeds")
                              : t("map.soilWatered")}
                          </title>
                        </path>
                        <text
                          x={mintEmojiPositions[index].x}
                          y={mintEmojiPositions[index].y}
                          fontSize="24"
                          pointerEvents="none"
                        >
                          🌿
                        </text>
                      </g>
                    ))}
                  </g>
                  <g>
                    {mintPumpPositions.map((pos, index) => (
                      <circle
                        key={`mint-pump-${index}`}
                        cx={pos.x}
                        cy={pos.y}
                        r="12"
                        fill={getPumpStatusColor(pumps.mint[index])}
                        stroke="white"
                        strokeWidth="2"
                        style={{ cursor: "pointer" }}
                      >
                        <title>
                          {pumps.mint[index]
                            ? t("map.pumpOn")
                            : t("map.pumpOff")}
                        </title>
                        {pumps.mint[index] && (
                          <animate
                            attributeName="r"
                            values="12;14;12"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        )}
                      </circle>
                    ))}
                  </g>
                </g>
              </svg>
            </div>
          )}
          {currentPage === "weather" && (
            <div
              className="max-w-[900px] mx-auto w-full px-3 sm:px-6 py-3 sm:py-6 text-sm sm:text-base"
              style={{
                // keep weather content scrollable vertically on mobile
                maxHeight: "calc(100vh - 160px)",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div className="sm:scale-100 scale-95">
                <WeatherPage />
              </div>
            </div>
          )}
          {currentPage === "notifications" && (
            <div className="max-w-[900px] mx-auto w-full px-3 sm:px-6 py-3 sm:py-6 text-sm sm:text-base">
              <div className="sm:scale-100 scale-95">
                <NotificationsPage mapData={mapData} />
              </div>
            </div>
          )}
          {currentPage === "pricing" && (
            <div className="max-w-[900px] mx-auto w-full px-3 sm:px-6 py-3 sm:py-6 text-sm sm:text-base">
              <div className="sm:scale-100 scale-95">
                <PricingPage />
              </div>
            </div>
          )}
        </main>

        {/* mobile fixed logout button (only visible on small screens) */}
        <button
          onClick={handleLogout}
          style={{ touchAction: "manipulation" }}
          className="sm:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 text-base font-medium bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-full shadow-lg"
        >
          Logout
        </button>

        <HelpButton />
      </div>
    );
  }

  return (
    <AuthPage
      onLoginSuccess={setCurrentUser}
      error={authError}
      clearError={() => setAuthError("")}
    />
  );
}

export default App;

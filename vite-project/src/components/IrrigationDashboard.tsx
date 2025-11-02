// @ts-nocheck
import PumpCircle from "./PumpCircle";

// Add simple path & position definitions for the SVG zones so the component can render them.
// Keep counts consistent between paths and position arrays.
const tomatoSlimmyPaths = [
  "M 60 60 L 200 60 L 200 140 L 60 140 Z",
  "M 210 60 L 300 60 L 300 140 L 210 140 Z",
  "M 60 150 L 140 150 L 140 240 L 60 240 Z",
  "M 150 150 L 300 150 L 300 240 L 150 240 Z",
];

const tomatoEmojiPositions = [
  { x: 120, y: 110 },
  { x: 255, y: 110 },
  { x: 100, y: 195 },
  { x: 225, y: 195 },
];

const tomatoPumpPositions = [
  { x: 90, y: 80 },
  { x: 270, y: 80 },
  { x: 120, y: 180 },
  { x: 240, y: 180 },
];

const onionSlimmyPaths = [
  "M 320 60 L 460 60 L 460 140 L 320 140 Z",
  "M 470 60 L 640 60 L 640 140 L 470 140 Z",
  "M 320 150 L 500 150 L 500 240 L 320 240 Z",
];

const onionEmojiPositions = [
  { x: 390, y: 110 },
  { x: 555, y: 110 },
  { x: 410, y: 195 },
];

const onionPumpPositions = [
  { x: 360, y: 80 },
  { x: 600, y: 80 },
  { x: 440, y: 180 },
];

const mintSlimmyPaths = [
  "M 320 250 L 460 250 L 460 340 L 320 340 Z",
  "M 470 250 L 640 250 L 640 340 L 470 340 Z",
  "M 320 350 L 460 350 L 460 460 L 320 460 Z",
  "M 470 350 L 640 350 L 640 460 L 470 460 Z",
];

const mintEmojiPositions = [
  { x: 390, y: 295 },
  { x: 555, y: 295 },
  { x: 390, y: 405 },
  { x: 555, y: 405 },
];

const mintPumpPositions = [
  { x: 360, y: 270 },
  { x: 600, y: 270 },
  { x: 360, y: 420 },
  { x: 600, y: 420 },
];

function IrrigationDashboard({ mapData, onZoneClick, onPumpClick }: any) {
  if (!mapData) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center">
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-2xl border-2 border-gray-100 max-w-6xl w-full text-center">
          <span className="text-4xl">Loading Map Data...</span>
        </div>
      </div>
    );
  }

  const slimmyZoneSoil = mapData.soil || { tomatoes: [], onions: [], mint: [] };
  const slimmyZonePumps = mapData.pumps || {
    tomatoes: [],
    onions: [],
    mint: [],
  };

  // normalize helpers: treat several encodings as "needs water"
  const isNeedsWater = (v: any) =>
    v === true ||
    v === 1 ||
    v === "1" ||
    v === "true" ||
    v === "needs_water" ||
    v === "needsWater" ||
    String(v).toLowerCase() === "true";

  const isPumpOn = (v: any) =>
    v === true || v === 1 || v === "1" || String(v).toLowerCase() === "true";

  const getPumpStatusColor = (status: boolean) => {
    if (isPumpOn(status)) return "#22c55e"; // green
    return "#ef4444"; // red
  };

  // --- Render SVG Map ---
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
                      fill={
                        isNeedsWater(slimmyZoneSoil?.tomatoes?.[index])
                          ? "#eab308"
                          : "#3b82f6"
                      }
                      stroke="black"
                      strokeWidth="2"
                      opacity="0.8"
                      onClick={() =>
                        onZoneClick &&
                        onZoneClick(
                          "tomatoes",
                          index,
                          !isNeedsWater(slimmyZoneSoil?.tomatoes?.[index])
                        )
                      }
                      style={{ cursor: "pointer" }}
                      title={
                        isNeedsWater(slimmyZoneSoil?.tomatoes?.[index])
                          ? "Soil: Needs Water (Click to change)"
                          : "Soil: Watered (Click to change)"
                      }
                    />
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
                  <g key={`tomato-pump-${index}`}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="12"
                      fill={getPumpStatusColor(
                        slimmyZonePumps?.tomatoes?.[index]
                      )}
                      stroke="white"
                      strokeWidth="2"
                      onClick={(e) =>
                        onPumpClick &&
                        onPumpClick(
                          e,
                          "tomatoes",
                          index,
                          !isPumpOn(slimmyZonePumps?.tomatoes?.[index])
                        )
                      }
                      style={{ cursor: "pointer" }}
                      title={
                        isPumpOn(slimmyZonePumps?.tomatoes?.[index])
                          ? "Pump: ON (Click to turn OFF)"
                          : "Pump: OFF (Click to turn ON)"
                      }
                    >
                      {isPumpOn(slimmyZonePumps?.tomatoes?.[index]) && (
                        <animate
                          attributeName="r"
                          values="12;14;12"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>
                  </g>
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
                      fill={
                        isNeedsWater(slimmyZoneSoil?.onions?.[index])
                          ? "#eab308"
                          : "#3b82f6"
                      }
                      stroke="black"
                      strokeWidth="2"
                      opacity="0.8"
                      onClick={() =>
                        onZoneClick &&
                        onZoneClick(
                          "onions",
                          index,
                          !isNeedsWater(slimmyZoneSoil?.onions?.[index])
                        )
                      }
                      style={{ cursor: "pointer" }}
                      title={
                        isNeedsWater(slimmyZoneSoil?.onions?.[index])
                          ? "Soil: Needs Water (Click to change)"
                          : "Soil: Watered (Click to change)"
                      }
                    />
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
                    fill={getPumpStatusColor(slimmyZonePumps?.onions?.[index])}
                    stroke="white"
                    strokeWidth="2"
                    onClick={(e) =>
                      onPumpClick &&
                      onPumpClick(
                        e,
                        "onions",
                        index,
                        !isPumpOn(slimmyZonePumps?.onions?.[index])
                      )
                    }
                    style={{ cursor: "pointer" }}
                    title={
                      isPumpOn(slimmyZonePumps?.onions?.[index])
                        ? "Pump: ON (Click to turn OFF)"
                        : "Pump: OFF (Click to turn ON)"
                    }
                  >
                    {isPumpOn(slimmyZonePumps?.onions?.[index]) && (
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
                      fill={
                        isNeedsWater(slimmyZoneSoil?.mint?.[index])
                          ? "#eab308"
                          : "#3b82f6"
                      }
                      stroke="black"
                      strokeWidth="2"
                      opacity="0.8"
                      onClick={() =>
                        onZoneClick &&
                        onZoneClick(
                          "mint",
                          index,
                          !isNeedsWater(slimmyZoneSoil?.mint?.[index])
                        )
                      }
                      style={{ cursor: "pointer" }}
                      title={
                        isNeedsWater(slimmyZoneSoil?.mint?.[index])
                          ? "Soil: Needs Water (Click to change)"
                          : "Soil: Watered (Click to change)"
                      }
                    />
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
                    fill={getPumpStatusColor(slimmyZonePumps?.mint?.[index])}
                    stroke="white"
                    strokeWidth="2"
                    onClick={(e) =>
                      onPumpClick &&
                      onPumpClick(
                        e,
                        "mint",
                        index,
                        !isPumpOn(slimmyZonePumps?.mint?.[index])
                      )
                    }
                    style={{ cursor: "pointer" }}
                    title={
                      isPumpOn(slimmyZonePumps?.mint?.[index])
                        ? "Pump: ON (Click to turn OFF)"
                        : "Pump: OFF (Click to turn ON)"
                    }
                  >
                    {isPumpOn(slimmyZonePumps?.mint?.[index]) && (
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
      </div>
    </div>
  );
}

export default IrrigationDashboard;

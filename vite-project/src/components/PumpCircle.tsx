type PumpCircleProps = {
  status: boolean;
  onClick?: (e?: any) => void;
};

const PumpCircle = ({ status, onClick }: PumpCircleProps) => {
  const getPumpStatusColor = (s: boolean) => (s ? "#22c55e" : "#ef4444");

  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      style={{ overflow: "visible" }}
    >
      <title>
        {status ? "Pump: ON (Click to toggle)" : "Pump: OFF (Click to toggle)"}
      </title>
      <circle
        cx={12}
        cy={12}
        r={12}
        fill={getPumpStatusColor(status)}
        stroke="white"
        strokeWidth={2}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      />
      {status && (
        <animate
          attributeName="r"
          values="12;14;12"
          dur="1s"
          repeatCount="indefinite"
        />
      )}
    </svg>
  );
};

export default PumpCircle;

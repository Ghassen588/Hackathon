type ZonePathProps = {
  pathData: string;
  onClick?: (e?: any) => void;
  fillColor?: string;
};

const ZonePath = ({
  pathData,
  onClick,
  fillColor = "#a7f3d0",
}: ZonePathProps) => {
  return (
    <path
      d={pathData}
      fill={fillColor}
      stroke="black"
      strokeWidth={2}
      opacity={0.8}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    />
  );
};

export default ZonePath;

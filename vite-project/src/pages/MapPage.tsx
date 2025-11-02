import IrrigationDashboard from "../components/IrrigationDashboard";

function MapPage({
  mapData,
  onZoneClick,
  onPumpClick,
}: {
  mapData: any | null;
  onZoneClick?: (plantType: string, idx: number, newVal: boolean) => void;
  onPumpClick?: (
    e: any,
    plantType: string,
    idx: number,
    newVal: boolean
  ) => void;
}) {
  return (
    <IrrigationDashboard
      mapData={mapData}
      onZoneClick={onZoneClick}
      onPumpClick={onPumpClick}
    />
  );
}

export default MapPage;

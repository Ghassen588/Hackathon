// navigation component
import { useTranslation } from "react-i18next";
const Nav = ({
  currentPage,
  setCurrentPage,
  hasNotifications,
}: {
  currentPage: string;
  setCurrentPage: (p: string) => void;
  hasNotifications?: boolean;
}) => {
  const getNavButtonClass = (pageName: string) => {
    const baseClass =
      "text-2xl font-medium py-3 px-6 rounded-lg shadow transition transform hover:scale-105";
    return currentPage === pageName
      ? `${baseClass} bg-blue-500 text-white`
      : `${baseClass} bg-white text-gray-700 hover:bg-gray-50`;
  };

  const { t } = useTranslation();

  return (
    <nav className="flex justify-center items-center gap-4 p-4">
      <button
        onClick={() => setCurrentPage("map")}
        className={getNavButtonClass("map")}
      >
        {t("common.mapTitle")}
      </button>
      <button
        onClick={() => setCurrentPage("weather")}
        className={getNavButtonClass("weather")}
      >
        {t("common.weatherTitle")}
      </button>
      <button
        onClick={() => setCurrentPage("notifications")}
        className={`${getNavButtonClass("notifications")} relative`}
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
        className={getNavButtonClass("pricing")}
      >
        {t("common.pricingTitle")}
      </button>
    </nav>
  );
};

export default Nav;

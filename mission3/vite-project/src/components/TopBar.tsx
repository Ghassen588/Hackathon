import { useTranslation } from "react-i18next";

//@ts-ignore
const TopBar = ({
  username,
  onLogout,
}: {
  username: string;
  onLogout: () => void;
}) => {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(next);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm p-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">
        {t("common.welcome", { name: username })}
      </h1>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLang}
          className="text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded-lg shadow-sm transition"
        >
          {i18n.language === "ar" ? "العربية" : "EN"}
        </button>
        <button
          onClick={onLogout}
          className="text-lg font-medium bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-lg shadow transition"
        >
          {t("common.logout")}
        </button>
      </div>
    </header>
  );
};

export default TopBar;

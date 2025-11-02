import { useState } from "react";
import { useTranslation } from "react-i18next";

function NotificationsPage({ mapData }: { mapData: any | null }) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState<string[]>([]);

  const slimmyZoneSoil = mapData?.soil;

  // helper matching IrrigationDashboard
  const isNeedsWater = (v: any) =>
    v === true ||
    v === 1 ||
    v === "1" ||
    v === "true" ||
    v === "needs_water" ||
    v === "needsWater" ||
    String(v).toLowerCase() === "true";

  const allNotifications: any[] = [];

  if (slimmyZoneSoil) {
    if (slimmyZoneSoil.tomatoes.some((n: any) => isNeedsWater(n))) {
      allNotifications.push({ id: "tomatoes", emoji: "🍅" });
    }
    if (slimmyZoneSoil.onions.some((n: any) => isNeedsWater(n))) {
      allNotifications.push({ id: "onions", emoji: "🧅" });
    }
    if (slimmyZoneSoil.mint.some((n: any) => isNeedsWater(n))) {
      allNotifications.push({ id: "mint", emoji: "🌿" });
    }
  }

  const activeNotifications = allNotifications.filter(
    (notif) => !dismissed.includes(notif.id)
  );

  const handleNotificationClick = (notification: any) => {
    try {
      const plant = t(`plants.${notification.id}`);
      const utterance = new SpeechSynthesisUtterance(
        t("notifications.speech", { plant })
      );
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
          {t("notifications.title")}
        </h2>

        <div className="space-y-4">
          {!slimmyZoneSoil ? (
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <p className="text-3xl font-semibold text-gray-700 mt-4">
                {t("notifications.loading")}
              </p>
            </div>
          ) : activeNotifications.length === 0 ? (
            <div className="text-center p-10 bg-green-50 rounded-lg">
              <span className="text-7xl">✅</span>
              <p className="text-3xl font-semibold text-green-700 mt-4">
                {t("notifications.allGood")}
              </p>
              <p className="text-xl text-gray-600">
                {t("notifications.noPlants")}
              </p>
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
                    <p className="text-3xl font-bold text-yellow-800">
                      {t("notifications.plantAlert", {
                        plant: t(`plants.${notif.id}`),
                      })}
                    </p>
                    <p className="text-lg text-yellow-700 text-left">
                      {t("notifications.clickToHear")}
                    </p>
                  </div>
                </div>
                <span className="text-5xl text-yellow-600 animate-pulse">
                  💧
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;

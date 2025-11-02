import { useState } from "react";
import { useTranslation } from "react-i18next";

function HelpButton() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { t } = useTranslation();

  const handleHelpClick = () => {
    const helpText = t("helpText.explanation");

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const audio = new Audio("/help.mp3");
      audio.playbackRate = 0.9;
      audio.volume = 1;
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      audio.play().catch(() => setIsSpeaking(false));
      return;
    } else {
      alert(t("helpText.help") + ":\n\n" + helpText);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleHelpClick}
        disabled={isSpeaking}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-full shadow-2xl transition duration-300 transform hover:scale-110 flex items-center gap-3 text-lg"
      >
        <span className="text-2xl">❓</span>
        {isSpeaking ? (
          <span className="flex items-center gap-2">
            <span className="animate-pulse">🔊</span>
            {t("helpText.speaking")}
          </span>
        ) : (
          t("helpText.help")
        )}
      </button>
    </div>
  );
}

export default HelpButton;

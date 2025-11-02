import { useState } from "react";

function HelpButton() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleHelpClick = () => {
    const helpText =
      "Blue color means that the area is watered. Yellow area means that the area needs to be watered. The green circle means that the pump is on. The red circle means that the pump is off.";

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(helpText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert(
        "Speech synthesis is not supported in your browser. Here are the instructions:\n\n" +
          helpText
      );
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
            Speaking...
          </span>
        ) : (
          "Help"
        )}
      </button>
    </div>
  );
}

export default HelpButton;

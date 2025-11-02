// import React from 'react'; // Removed unused import
//@ts-ignore
const TopBar = ({
  username,
  onLogout,
}: {
  username: string;
  onLogout: () => void;
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm p-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">
        🌱 Welcome, {username}!
      </h1>
      <button
        onClick={onLogout}
        className="text-lg font-medium bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-lg shadow transition"
      >
        Logout
      </button>
    </header>
  );
};

export default TopBar;

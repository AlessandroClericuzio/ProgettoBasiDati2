import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold text-indigo-700">European Soccer</h1>
      </div>
    </header>
  );
};

export default Header;

import React from "react";

const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-lg border-b border-indigo-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-sm">⚽</span>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              European Soccer
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

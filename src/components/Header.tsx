// Header.tsx - کامپوننت هدر ثابت
import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          فروشگاه قطعات کوروش
        </h1>
      </div>
    </header>
  );
};

export default Header;

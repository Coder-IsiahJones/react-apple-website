import React from "react";
import { appleImg, bagImg, searchImg } from "../utils";
import { navLists } from "../constants";

const Navbar = () => {
  return (
    <header className="flex w-full items-center justify-between p-5 sm:px-10">
      <nav className="screen-max-width flex w-full">
        {/* Logo */}
        <img src={appleImg} alt="Apple" width={14} height={18} />

        {/* Menu Items */}
        <div className="flex flex-1 justify-center max-sm:hidden">
          {navLists.map((nav) => (
            <div
              className="cursor-pointer px-5 text-sm text-gray transition-all hover:text-white"
              key={nav}
            >
              {nav}
            </div>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-baseline gap-7 max-sm:flex-1 max-sm:justify-end">
          <img src={searchImg} alt="search" width={18} height={18} />
          <img src={bagImg} alt="search" width={18} height={18} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

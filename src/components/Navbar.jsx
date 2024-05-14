import React from "react";
import { appleImg, bagImg, searchImg } from "../utils";

const Navbar = () => {
  return (
    <header className="flex w-full items-center justify-between px-5 py-5 sm:px-10">
      <nav className="screen-max-width flex w-full">
        {/* Logo */}
        <img src={appleImg} alt="Apple" width={14} height={18} />

        {/* Menu Items */}
        <div>
          {["Phones", "Macbooks", "Tablets"].map((nav) => (
            <div key={nav}>{nav}</div>
          ))}
        </div>

        {/* Icons */}
        <div>
          <img src={searchImg} alt="search" width={18} height={18} />
          <img src={bagImg} alt="search" width={18} height={18} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

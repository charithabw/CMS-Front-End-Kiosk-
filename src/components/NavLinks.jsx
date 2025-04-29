import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Links from "../utils/Links"; // Import links data from utils
import { FaCaretDown, FaCaretUp } from "react-icons/fa"; // Import up and down arrow icons

const NavLinks = ({ isBigSidebar, toggleSidebar }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);

  // Toggle the submenu visibility
  const handleSubMenuToggle = (e, index, hasSubLinks) => {
    // Only prevent default if there are sublinks
    if (hasSubLinks) {
      e.preventDefault();
      setOpenSubMenu(openSubMenu === index ? null : index);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {Links.map((link, index) => {
        const { text, path, icon, subLinks } = link;
        const hasSubLinks = subLinks && subLinks.length > 0;
        const isOpen = openSubMenu === index; // Check if submenu is open

        return (
          <div key={`${text}-${index}`} className="relative">
            {/* Main NavLink */}
            <NavLink
              to={path}
              className={({ isActive }) =>
                `flex items-center justify-between text-white py-2 px-4 hover:bg-gray-700 rounded-md cursor-pointer ${
                  isActive ? "bg-blue-900" : ""
                }`
              }
              onClick={(e) => handleSubMenuToggle(e, index, hasSubLinks)}
              end // This ensures exact matching for the parent link
            >
              <div className="flex items-center">
                <span className="icon text-xl">{icon}</span>
                <span className="ml-3">{text}</span>
              </div>
              {/* Show Up arrow when open, Down arrow when closed */}
              {hasSubLinks &&
                (isOpen ? (
                  <FaCaretUp className="text-sm" />
                ) : (
                  <FaCaretDown className="text-sm" />
                ))}
            </NavLink>

            {/* Submenu Items */}
            {isOpen && hasSubLinks && (
              <div className="ml-8 space-y-2 mt-2">
                {subLinks.map((subLink, subIndex) => (
                  <NavLink
                    key={`${subLink.text}-${subIndex}`}
                    to={subLink.path}
                    className={({ isActive }) =>
                      `text-white block py-2 px-4 hover:bg-gray-700 rounded-md ${
                        isActive ? "bg-blue-900" : ""
                      }`
                    }
                    onClick={isBigSidebar ? null : toggleSidebar}
                  >
                    {subLink.text}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NavLinks;

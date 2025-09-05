import React, { useState } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleToggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <motion.nav
            className="fixed top-0 left-0 w-full z-50 bg-white bg-opacity-70 backdrop-blur-md dark:bg-gray-900 dark:bg-opacity-70 transition-colors duration-500"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo/Name */}
                <a
                    key="Image-Resizer"
                    href="./"
                    className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-500"
                >
                    Image Resizer
                </a>

                {/* Desktop Dark Mode Toggle */}
                <div className="hidden md:flex space-x-6 items-center">
                    <button
                        onClick={handleToggleDarkMode}
                        className="p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300 focus:outline-none focus:ring-0 active:ring-0 hover:ring-0"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? "☀️" : "🌙"}
                    </button>
                </div>

                {/* Mobile Dark Mode Toggle */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={handleToggleDarkMode}
                        className="p-2 rounded-full text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-0 active:ring-0 hover:ring-0"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? "☀️" : "🌙"}
                    </button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;

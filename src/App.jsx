import React from "react";
import ImageResizer from "./ImageResizer";
import Navbar from "./Navbar";

export default function App() {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
            <Navbar />
            <ImageResizer />
        </div>
    );
}

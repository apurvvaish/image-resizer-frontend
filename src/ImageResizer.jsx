import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ImageResizer() {
    const [file, setFile] = useState(null);
    const [presets, setPresets] = useState([]);
    const [customSizes, setCustomSizes] = useState([{ width: "", height: "" }]);
    const [format, setFormat] = useState("image/jpeg");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

    const presetOptions = ["thumbnail", "medium", "large"];

    const showSnackbar = (message, type = "error") => {
        setSnackbar({ message, type });
        setTimeout(() => setSnackbar(null), 3000);
    };

    // ... (drag and drop handlers, file change, preset change, etc. stay unchanged)

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handlePresetChange = (preset) => {
        setPresets((prev) =>
            prev.includes(preset)
                ? prev.filter((p) => p !== preset)
                : [...prev, preset]
        );
    };

    const handleCustomSizeChange = (index, field, value) => {
        const newSizes = [...customSizes];
        newSizes[index][field] = value;
        setCustomSizes(newSizes);
    };

    const addSizeField = () =>
        setCustomSizes([...customSizes, { width: "", height: "" }]);

    const removeSizeField = (index) => {
        const updated = customSizes.filter((_, i) => i !== index);
        setCustomSizes(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            showSnackbar("Please upload an image.");
            return;
        }

        // Filter valid custom sizes (must be numeric and > 0)
        const validCustomSizes = customSizes
            .map((s) => ({
                width: Number(s.width),
                height: Number(s.height),
            }))
            .filter((s) => s.width > 0 && s.height > 0);

        if (presets.length === 0 && validCustomSizes.length === 0) {
            showSnackbar("Please select a preset or add a custom size.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        if (format) {
            formData.append("format", format);
        }

        if (presets.length > 0) {
            formData.append("sizes", JSON.stringify(presets));
        }

        if (validCustomSizes.length > 0) {
            formData.append("customSizes", JSON.stringify(validCustomSizes));
        }

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Server error:", errorText);
                throw new Error("Upload failed: " + errorText);
            }

            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error("Upload error:", err);
            showSnackbar("Upload failed. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = (src, name) => {
        const link = document.createElement("a");
        link.href = src;
        link.download = name;
        link.click();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
            <motion.div
                className="w-full max-w-3xl mx-auto p-6 text-gray-900 dark:text-gray-100"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 120 }}
            >
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Resize your images efficiently
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6 border border-gray-200 dark:border-gray-700"
                >
                    {/* Drag and Drop Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded p-6 mb-4 cursor-pointer text-center select-none ${
                            dragActive
                                ? "border-green-600 bg-green-50 dark:bg-green-900"
                                : "border-gray-300 dark:border-gray-600"
                        }`}
                        onClick={() =>
                            document.getElementById("fileInput").click()
                        }
                    >
                        {file ? (
                            <p className="text-green-700 dark:text-green-400">
                                Selected File: {file.name}
                            </p>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                Drag & drop an image here, or click to select
                            </p>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* Preset Sizes Dropdown */}
                    <div className="relative">
                        <label className="block font-medium mb-2">
                            Select Preset Sizes
                        </label>
                        <button
                            type="button"
                            onClick={() =>
                                setPresetDropdownOpen((open) => !open)
                            }
                            className="w-full text-left border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex justify-between items-center"
                            aria-haspopup="listbox"
                            aria-expanded={presetDropdownOpen}
                        >
                            {presets.length > 0
                                ? presets
                                      .map(
                                          (p) =>
                                              p.charAt(0).toUpperCase() +
                                              p.slice(1)
                                      )
                                      .join(", ")
                                : "Select presets..."}
                            <svg
                                className={`w-5 h-5 transition-transform ${
                                    presetDropdownOpen
                                        ? "rotate-180"
                                        : "rotate-0"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {presetDropdownOpen && (
                            <ul
                                className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow max-h-48 overflow-auto"
                                role="listbox"
                                aria-multiselectable="true"
                            >
                                {presetOptions.map((preset) => (
                                    <li
                                        key={preset}
                                        className="flex items-center px-4 py-2 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900"
                                        onClick={() =>
                                            handlePresetChange(preset)
                                        }
                                        role="option"
                                        aria-selected={presets.includes(preset)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={presets.includes(preset)}
                                            readOnly
                                            className="mr-2 accent-green-600"
                                        />
                                        <span className="capitalize">
                                            {preset}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Custom Sizes */}
                    <div>
                        <label className="block font-medium mb-2">
                            Custom Sizes
                        </label>
                        {customSizes.map((size, index) => (
                            <div
                                key={index}
                                className="flex gap-2 mb-2 items-center"
                            >
                                <input
                                    type="number"
                                    placeholder="Width"
                                    value={size.width}
                                    onChange={(e) =>
                                        handleCustomSizeChange(
                                            index,
                                            "width",
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 w-28 rounded"
                                />
                                <input
                                    type="number"
                                    placeholder="Height"
                                    value={size.height}
                                    onChange={(e) =>
                                        handleCustomSizeChange(
                                            index,
                                            "height",
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 w-28 rounded"
                                />
                                {customSizes.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSizeField(index)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                        aria-label={`Remove size field ${
                                            index + 1
                                        }`}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSizeField}
                            className="text-blue-600 dark:text-blue-400 hover:underline mt-2"
                        >
                            + Add Size
                        </button>
                    </div>

                    {/* Format */}
                    <div>
                        <label className="block font-medium mb-2">
                            Select Output Format
                        </label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded w-48"
                        >
                            <option value="image/jpeg">JPG / JPEG</option>
                            <option value="image/png">PNG</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Processing..." : "Upload & Resize"}
                        </button>
                    </div>
                </form>

                {/* Results */}
                {result && (
                    <div className="mt-10">
                        <h2 className="text-xl font-semibold mb-4">Results</h2>

                        <div className="mb-6">
                            <p className="font-medium mb-2">Original Image:</p>
                            <img
                                src={result.original}
                                alt="Original"
                                className="max-w-full border rounded border-gray-300 dark:border-gray-600"
                            />
                            <button
                                onClick={() =>
                                    downloadImage(
                                        result.original,
                                        result.filename
                                    )
                                }
                                className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Download Original
                            </button>
                        </div>

                        <div>
                            <p className="font-medium mb-2">Resized Images:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {Object.entries(result.resized).map(
                                    ([name, uri], index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-300 dark:border-gray-600 p-4 rounded"
                                        >
                                            <p className="mb-2 font-semibold">
                                                {name}
                                            </p>
                                            <img
                                                src={uri}
                                                alt={name}
                                                className="mb-2 max-w-full"
                                            />
                                            <button
                                                onClick={() =>
                                                    downloadImage(
                                                        uri,
                                                        `${name}-${result.filename}`
                                                    )
                                                }
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Snackbar */}
                {snackbar && (
                    <div
                        className={`fixed bottom-4 right-4 px-5 py-3 rounded shadow-lg text-white flex items-center gap-4 max-w-xs ${
                            snackbar.type === "error"
                                ? "bg-red-300/80"
                                : "bg-green-500/80"
                        }`}
                        role="alert"
                        aria-live="assertive"
                    >
                        <span className="flex-1">{snackbar.message}</span>
                        <button
                            onClick={() => setSnackbar(null)}
                            aria-label="Close notification"
                            className="text-white hover:text-gray-200 focus:outline-none"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

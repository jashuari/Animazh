"use client";

import { useState } from "react";
import Image from "next/image";

const ImageGenerator = () => {
  const [styleStrength, setStyleStrength] = useState("standard");
  const [watermark, setWatermark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    // Simulate image generation - in a real app this would call an API
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <section className="container mx-auto px-4 md:px-6 mb-16">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column - Input */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Generate Studio Ghibli AI Image</h2>
          <p className="text-gray-600 text-sm mb-6">
            Select a style, type to get your own image
          </p>

          <div className="border-b pb-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">Current Mode:</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Basic</span>
            </div>
            <p className="text-xs text-gray-500">
              Basic image generation features with standard quality.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Input Image</h3>
            <p className="text-xs text-gray-500 mb-4">
              Turn photos into Ghibli Filter art with Studio Ghibli AI
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition">
              <div className="flex justify-center mb-2">
                <Image
                  src="https://ext.same-assets.com/959849943/2605396752.svg"
                  alt="Upload"
                  width={60}
                  height={60}
                />
              </div>
              <p className="text-sm font-medium mb-1">Drag & drop or browse</p>
              <p className="text-xs text-gray-500">PNG, JPG or JPEG (max 4.5MB)</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Style Strength</h3>
              <span className="text-xs text-gray-500" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="styleStrength"
                  value="standard"
                  checked={styleStrength === "standard"}
                  onChange={() => setStyleStrength("standard")}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span className="text-sm">Standard</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="styleStrength"
                  value="enhanced"
                  checked={styleStrength === "enhanced"}
                  onChange={() => setStyleStrength("enhanced")}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span className="text-sm">Enhanced</span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Watermark</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={watermark}
                  onChange={() => setWatermark(!watermark)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center justify-center transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            Generate Image
            <span className="text-xs ml-2">· 6 Credits</span>
          </button>
        </div>

        {/* Right column - Result */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Studio Ghibli AI Image Result</h2>

          {isLoading ? (
            <div className="text-center p-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
              <p className="text-gray-600">
                Please wait for about 3 minutes while we generate your image...
              </p>
            </div>
          ) : showResult ? (
            <div className="text-center">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <Image
                  src="https://ext.same-assets.com/959849943/3728330511.jpeg"
                  alt="Generated Ghibli Image"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
                <button className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center space-x-3 mb-3">
                <button className="flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                </button>
                <button className="flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                  Enhance
                </button>
                <button className="flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </button>
              </div>

              <div className="flex justify-center space-x-3">
                <button className="flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-800 rounded-md text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                  </svg>
                  To Video
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-teal-100 text-teal-800 rounded-md text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Upscale
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-10 text-gray-500">
              Please upload an image and click Generate to see the result.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageGenerator;

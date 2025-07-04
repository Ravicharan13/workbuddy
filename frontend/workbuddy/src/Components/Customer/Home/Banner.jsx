import React from 'react';

import bannerlight from "../../../Assests/bannerlight.jpg"
import bannerdark from "../../../Assests/bannerdark.jpg"

function Banner() {
  return (
    <div className="w-full  flex flex-col-reverse md:flex-row items-center md:items-center justify-between px-6 md:px-14 lg:px-32 py-10 gap-10 md:gap-0 lg:gap-10 dark:bg-gray-900">
      {/* Left Content */}
      <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl lg::text-6xl font-bold leading-tight dark:text-white">
           Find Trusted Services <br /> At Your Fingertips
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-xl md:text-3xl">
         Connect with skilled professionals, track service progress, and get tasks done easily.
        </p>
        <button className="bg-gray-800 hover:bg-gray-700 duration-300 dark:bg-gray-700 dark:hover:bg-gray-500 text-white px-6 py-3 rounded-sm">
          Explore Services
        </button>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={bannerlight}
          alt="Worker illustration"
          className="w-full max-w-sm md:max-w-md dark:hidden"
        />
        <img
          src={bannerdark}
          alt="Worker illustration dark"
          className="w-full max-w-sm md:max-w-md hidden dark:block"
        />

      </div>
    </div>
  );
}

export default Banner;

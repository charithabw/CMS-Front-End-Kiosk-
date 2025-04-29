import React from "react";
//import { Outlet } from "react-router-dom";

const ProductLayout = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-500 shadow-md rounded-lg p-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl  font-bold mb-4">
            Welcome to the Dashboard!
          </h1>
          <p className="text-base sm:text-lg md:text-xl">
            Here is the content of the dashboard.
          </p>
        </div>
        <div className="mt-8"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-500 shadow-md rounded-lg p-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl  font-bold mb-4">
            Welcome to the Dashboard!
          </h1>
          <p className="text-base sm:text-lg md:text-xl">
            Here is the content of the dashboard.
          </p>
        </div>
        <div className="mt-8"></div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-500 shadow-md rounded-lg p-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl  font-bold mb-4">
            Welcome to the Dashboard!
          </h1>
          <p className="text-base sm:text-lg md:text-xl">
            Here is the content of the dashboard.
          </p>
        </div>
        <div className="mt-8">
          <p>jjjj</p>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)] gap-y-[10px] gap-x-[10px]">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
        <div>8</div>
        <div>9</div>
      </div>
    </>
  );
};

export default ProductLayout;

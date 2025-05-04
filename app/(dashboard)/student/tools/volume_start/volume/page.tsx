import VolumeCalculator from "@/components/games/volume-calculator";

const VolumePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-800 p-4 flex flex-col items-center w-full">
      <div className="w-full max-w-5xl lg:w-3/4 mx-auto">
        <h1 className="text-lg sm:text-xl md:text-3xl font-bold mb-7 text-center text-gray-900 dark:text-white">
          Interactive Tool for Volume
        </h1>
        <div className="flex flex-col gap-2 lg:flex-row w-full">
          {/* Text Description Section */}
          <div className="w-full lg:w-1/2 text-sm sm:text-base md:text-lg lg:text-xl px-4 text-gray-800 dark:text-gray-300">
            <p className="mb-4">
              Using this tool, you can identify the volume of the shape by dragging the slider.
            </p>
            <p className="mb-4">
              Drag the slider and observe the shape and its volume change in real time on the canvas.
            </p>
          </div>

          {/* Volume Calculator Section */}
          <div className="w-full lg:w-1/2">
            <VolumeCalculator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolumePage;

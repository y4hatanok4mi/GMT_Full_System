import { VolumeCalculator } from "@/components/games/volume-calculator";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 mt-8 flex flex-col items-center w-full lg:w-3/4 mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-7 text-center">
        Interactive Tool for Volume
      </h1>
      <div className="flex flex-col gap-2 lg:flex-row w-full">
        <div className="w-full lg:w-1/2 text-lg md:text-2xl px-4">
          <p className="mb-4">
            Using this tool, you can identify the volume of the shape by dragging the slider.
          </p>
          <p className="mb-4">
            Drag the slider and observe the shape and its volume change in real time on the canvas.
          </p>
        </div>
        <VolumeCalculator />
      </div>
    </div>
  );
};

export default Home;

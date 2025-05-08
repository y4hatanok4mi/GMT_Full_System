import React from "react";
import { LucideIcon } from "lucide-react";

interface IconCircleProps {
  Icon: LucideIcon;
  size?: number; // Icon size, defaults to 24
  bgColor?: string; // Background color, defaults to 'bg-gray-200'
  iconColor?: string; // Icon color, defaults to 'text-gray-700'
}

const IconCircle: React.FC<IconCircleProps> = ({
  Icon,
  size = 24,
  bgColor="bg-green-600 dark:bg-green-700",
  iconColor = "text-gray-700",
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full ${bgColor} p-2`}
      style={{ width: size + 16, height: size + 16 }} // Adjust size with padding
    >
      <Icon className={`${iconColor}`} size={size} />
    </div>
  );
};

export default IconCircle;

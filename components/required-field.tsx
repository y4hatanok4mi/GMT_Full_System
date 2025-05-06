import { CheckCheck, TriangleAlert } from "lucide-react"; // Import icons

interface RequiredFieldStatusProps {
  isCompleted: boolean;
}

const RequiredFieldStatus: React.FC<RequiredFieldStatusProps> = ({ isCompleted }) => {
  return (
    <div className="flex items-center gap-2 mt-4 mb-1 ml-4">
      {isCompleted ? (
        <CheckCheck className="text-green-500" size={24} />
      ) : (
        <TriangleAlert className="text-yellow-500" size={24} />
      )}
      <span className={isCompleted ? "text-green-500" : "text-yellow-500"}>
        {isCompleted ? "Completed" : "Required"}
      </span>
    </div>
  );
};

export default RequiredFieldStatus;

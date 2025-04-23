import { PointItemType } from "../types/props";
import "../index.css";

const PointItem = ({
  index,
  inputValues,
  handleInputChange,
  addNewInputAfter,
  handleRemovePoint,
}: PointItemType) => {
  return (
    <div className="flex items-center">
      <label className="bg-[#1a1a1a] text-white min-w-[3rem] flex justify-center items-center font-bold h-[3rem] rounded-md mr-2">
        {index + 1}
      </label>
      <input
        type="text"
        value={inputValues[index] ?? ""}
        onChange={(e) => handleInputChange(index, e.target.value)}
        className="p-2 border rounded-md w-full"
        placeholder="Enter coordinates or place name"
      />
      <button
        onClick={() => addNewInputAfter(index)}
        className="ml-2 mr-1 p-2 clip-path-app text-white w-[3rem] h-[3rem] flex justify-center items-center rounded-full"
      >
        +
      </button>
      <button
        onClick={() => handleRemovePoint(index)}
        className="ml-1 mr-2 p-2 text-white flex justify-center items-center w-[3rem] h-[3rem] rounded-full"
      >
        -
      </button>
    </div>
  );
};

export default PointItem;

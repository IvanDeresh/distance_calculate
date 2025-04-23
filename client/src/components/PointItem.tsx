import { PointItemType } from "../types/props";
import "../index.css";

const PointItem = ({
  index,
  inputValues,
  handleInputChange,
  addNewInputAfter,
  handleRemovePoint,
  inputRef,
}: PointItemType) => {
  return (
    <div className="flex items-center">
      <label className="bg-[#1a1a1a] text-white min-w-[2.5rem] flex justify-center items-center font-bold h-[2.5rem] rounded-md mr-2">
        {index + 1}
      </label>
      <input
        type="text"
        ref={inputRef}
        value={inputValues[index] ?? ""}
        onChange={(e) => handleInputChange(index, e.target.value)}
        className="px-2 py-1 border rounded-md text-[1rem] w-full"
        placeholder="Enter coordinates or place name"
      />
      <button
        onClick={() => addNewInputAfter(index)}
        className="ml-2 mr-1 p-2 clip-path-app text-white w-[2.5rem] h-[2.5rem] flex justify-center items-center rounded-full"
      >
        +
      </button>
      <button
        onClick={() => handleRemovePoint(index)}
        className="ml-1 mr-2 p-2 text-white flex justify-center items-center w-[2.5rem] h-[2.5rem] rounded-full"
      >
        -
      </button>
    </div>
  );
};

export default PointItem;

import { PointItemType } from "../types/props";

const PointItem = ({
  index,
  inputValues,
  handleInputChange,
  addNewInputAfter,
}: PointItemType) => {
  return (
    <div className="flex items-center">
      <label className="bg-[#1a1a1a] text-white min-w-[46px] flex justify-center items-center font-bold h-[46px] rounded-md mr-2">
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
        className="mx-2 p-2 text-white bg-green-500 rounded-full"
      >
        +
      </button>
    </div>
  );
};

export default PointItem;

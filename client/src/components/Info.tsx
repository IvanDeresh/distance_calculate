import { InfoProps } from "../types/props";

const Info = ({ total, points }: InfoProps) => {
  return (
    <div className="mt-4">
      Distance: <span className="font-bold">{total.toFixed(2)}</span> km between{" "}
      <span className="font-bold">{points.length}</span> points 📌
    </div>
  );
};

export default Info;

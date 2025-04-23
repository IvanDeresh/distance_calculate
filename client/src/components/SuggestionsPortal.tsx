import { JSX } from "react";
import ReactDOM from "react-dom";

type Props = {
  visible: boolean;
  top: number;
  left: number;
  width: number;
  suggestions: JSX.Element[];
};

export default function SuggestionsPortal({
  visible,
  top,
  left,
  width,
  suggestions,
}: Props) {
  if (!visible) return null;

  return ReactDOM.createPortal(
    <ul
      className="absolute z-[9999] mt-4 bg-[#1a1a1a] border rounded-md shadow"
      style={{
        top,
        left,
        width,
        position: "absolute",
      }}
    >
      {suggestions}
    </ul>,
    document.body
  );
}

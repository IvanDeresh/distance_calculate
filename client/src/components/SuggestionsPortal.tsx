import ReactDOM from "react-dom";
import { PortalProps } from "../types/props";

export default function SuggestionsPortal({
  visible,
  top,
  left,
  width,
  suggestions,
}: PortalProps) {
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

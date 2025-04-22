import { SuggestionsItemProps } from "../types/props";

const SuggestionsItem = ({
  i,
  index,
  sugg,
  handleSelectSuggestion,
}: SuggestionsItemProps) => {
  return (
    <li
      key={i}
      onClick={() => handleSelectSuggestion(index, sugg)}
      className="p-2 hover:bg-[#1a1a1a] cursor-pointer"
    >
      {sugg.display_name}
    </li>
  );
};

export default SuggestionsItem;

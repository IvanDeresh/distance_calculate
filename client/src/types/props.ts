import { Point } from "./store";
import { Suggestion } from "./util";

export type SuggestionsItemProps = {
  i: number;
  index: number;
  sugg: Suggestion;
  handleSelectSuggestion: Function;
};

export type PointItemType = {
  index: number;
  inputValues: string[];
  handleInputChange: (index: number, value: string) => void;
  addNewInputAfter: (index: number) => void;
  handleRemovePoint: (index: number) => void;
  inputRef?: (el: HTMLInputElement | null) => void;
};

export type InfoProps = {
  total: number;
  points: Point[];
};

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
  handleInputChange: Function;
  addNewInputAfter: Function;
  handleRemovePoint: Function;
};

export type InfoProps = {
  total: number;
  points: Point[];
};

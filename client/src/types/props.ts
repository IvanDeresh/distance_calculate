import { Point } from "./store";

export type SuggestionsItemProps = {
  i: number;
  index: number;
  sugg: any;
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

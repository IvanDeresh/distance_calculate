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
};

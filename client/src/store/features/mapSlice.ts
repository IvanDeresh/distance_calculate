import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MapState, Point } from "../../types/store";

const initialState: MapState = {
  points: [],
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    addPoint: (state, action: PayloadAction<Point>) => {
      state.points.push(action.payload);
    },
    setPoints: (state, action: PayloadAction<Point[]>) => {
      state.points = action.payload;
    },
    clearPoints: (state) => {
      state.points = [];
    },
    removePoint: (state, action: PayloadAction<number>) => {
      state.points.splice(action.payload, 1);
    },
  },
});

export const { addPoint, setPoints, clearPoints, removePoint } =
  mapSlice.actions;
export default mapSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type HomePageState = {
  pinnedCategories: string[];
};

type RootStateWithHomePage = {
  homePage: HomePageState;
};

const initialState: HomePageState = {
  pinnedCategories: [],
};

export const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    addPinnedCategory: (state, action: PayloadAction<string>) => {
      state.pinnedCategories.push(action.payload);
    },
    removePinnedCategory: (state, action: PayloadAction<string>) => {
      state.pinnedCategories = state.pinnedCategories.filter(
        (category) => category !== action.payload
      );
    },
    setPinnedCategories: (state, action: PayloadAction<string[]>) => {
      state.pinnedCategories = action.payload;
    },
  },
});

export const selectPinnedCategories = (state: RootStateWithHomePage) =>
  state.homePage.pinnedCategories;

export const { addPinnedCategory, removePinnedCategory, setPinnedCategories } =
  homePageSlice.actions;

import { Appearance } from "react-native";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { useAppSelector } from "@/hooks";

type Mode = "light" | "dark";

type ThemeState = {
  mode: Mode;
  deviceMode: Mode;
  customMode: Mode;
  useDeviceAppearance: boolean;
};

const initialState: ThemeState = {
  mode: Appearance.getColorScheme() || "light",
  deviceMode: Appearance.getColorScheme() || "light",
  customMode: "light",
  useDeviceAppearance: true,
};

export const appearanceslice = createSlice({
  name: "appearance",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload
    },
    setCustomMode: (state, action: PayloadAction<Mode>) => {
      state.customMode = action.payload
    },
    setUseDeviceApperance: (state, action: PayloadAction<boolean>) => {
      state.useDeviceAppearance = action.payload
    },
    setDeviceMode: (state, action: PayloadAction<Mode>) => {
      state.deviceMode = action.payload
    }
  },
});

export const { setMode, setCustomMode, setDeviceMode, setUseDeviceApperance } = appearanceslice.actions;

export const monitorAppearanceChanges = createAsyncThunk(
  "appearance/monitorAppearanceChanges",
  async (_, { dispatch }) => {
    const appearanceListener = () => {
      const newDeviceMode = Appearance.getColorScheme() || "light";
      dispatch(setDeviceMode(newDeviceMode));
    };

    const listener = Appearance.addChangeListener(appearanceListener);

    return () => listener.remove();
  }
);

const selectMode = (state: { appearance: ThemeState, [key: string]: any }) => {
  if (state.appearance.useDeviceAppearance) {
    return state.appearance.mode;
  } else {
    return state.appearance.customMode;
  }
}
export const selectUseDeviceAppearance = (state: { appearance: ThemeState, [key: string]: any }) => state.appearance.useDeviceAppearance;
export const selectCustomMode = (state: { appearance: ThemeState, [key: string]: any }) => state.appearance.customMode;

export const useAppearance = () => {
  const mode = useAppSelector(selectMode);
  return { mode };
};

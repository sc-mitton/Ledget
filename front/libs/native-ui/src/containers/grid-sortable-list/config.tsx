import { Easing } from "react-native-reanimated";

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 350,
};

export const getPosition = (position: number, width: number, height: number, column: number) => {
  "worklet";

  return {
    x: position % column === 0 ? 0 : width * (position % column),
    y: Math.floor(position / column) * height,
  };
};

export const getIndex = (tx: number, ty: number, max: number, width: number, height: number, column: number) => {
  "worklet";

  const x = Math.round(tx / width / 1.5) * width;
  const y = Math.round(ty / height / 1.5) * height;
  const row = Math.max(y, 0) / height;
  const col = Math.max(x, 0) / width;

  return Math.min(row * column + col, max);
};

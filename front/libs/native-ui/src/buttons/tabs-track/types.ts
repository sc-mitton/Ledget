import { ViewStyle } from 'react-native';

export interface TabsTrackProps {
  onIndexChange: (index: number) => void;
  defaultIndex?: number;
  containerStyle?: ViewStyle;
  children: React.ReactNode[];
}

export interface TabsTrackPropsContext {
  index: number;
  setIndex: (index: number) => void;
}

export interface TabProps {
  children: React.ReactNode | ((props: { selected: boolean }) => React.ReactNode);
  index: number;
}

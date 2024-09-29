import { TextInput, SectionList } from 'react-native';
import type { Emoji } from '../types';

export interface NativeEmojiPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  numColumns?: number;
}

export interface ISearchProps extends React.ComponentProps<typeof TextInput> {
  darkMode?: boolean;
}

export type Section = {
  category: string;
  data: Emoji[][];
}

export type Context = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export type CategoryPickerProps = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void
}

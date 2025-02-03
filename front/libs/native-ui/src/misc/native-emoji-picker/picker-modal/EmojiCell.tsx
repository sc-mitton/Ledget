import { Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Emoji } from '../types';
import { charFromEmojiObject } from '../helpers';

interface IEmojiCellProps {
  emoji: Emoji;
  onPress: (emoji: string) => void;
}

export default function EmojiCell({ emoji, onPress }: IEmojiCellProps) {
  return (
    <TouchableOpacity
      style={{ ...styles.wrapper }}
      onPress={() => onPress(charFromEmojiObject(emoji))}
    >
      <Text style={{ fontSize: 32 }}>{charFromEmojiObject(emoji)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 10,
    margin: 6,
    width: Platform.OS === 'ios' ? 34 : 44,
    height: Platform.OS === 'ios' ? 34 : 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

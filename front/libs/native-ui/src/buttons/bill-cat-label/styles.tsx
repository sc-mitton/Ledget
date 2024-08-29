import { StyleSheet } from "react-native";

export default StyleSheet.create({
  billCatLabel: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 1,
    flexDirection: 'row',
    gap: 4
  },
  billCatEmojiContainer: {
    position: 'relative'
  },
  billCatEmoji: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  background: {
    position: 'absolute',
    borderRadius: 16,
    padding: 4,
    width: 32,
    height: 32
  },
  backgroundContainer: {
    position: 'absolute'
  }
});

import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
  },
  absEmojiContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  absEmoji: {
    position: 'absolute',
    width: 45,
    height: 45,
  },
  progressEmoji: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 2
  },
});

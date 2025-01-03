import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  billCatLabel: {
    borderRadius: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  billCatEmojiContainer: {
    position: 'relative',
  },
  billCatEmoji: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    padding: 4,
  },
  backgroundContainer: {
    position: 'absolute',
  },
  absEmojiContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  absEmoji: {
    position: 'absolute',
    width: 35,
    height: 35,
  },
  progressEmoji: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

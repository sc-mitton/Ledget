import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 16,
    zIndex: 1,
    alignItems: 'center',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    transform: [{ translateY: -20 }],
    paddingHorizontal: 24,
    paddingVertical: 28,
    marginHorizontal: -16,
    zIndex: 1,
    height: 120,
  },
  blurView: {
    zIndex: -1,
  },
  blurEmoji: {
    fontSize: 80,
    lineHeight: 90,
    opacity: 1,
    transform: [{ scaleX: 2 }],
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: -2,
  },
  seperator: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    zIndex: 3,
  },
});

export default styles;

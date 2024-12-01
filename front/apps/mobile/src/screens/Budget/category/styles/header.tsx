import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 16,
    zIndex: 1,
    alignItems: 'center'
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    transform: [{ translateY: -10 }],
    paddingHorizontal: 24,
    paddingVertical: 20,
    zIndex: 1,
    height: 100,
  },
  blurView: {
    zIndex: -1,
  },
  blurEmoji: {
    fontSize: 80,
    lineHeight: 64,
    opacity: 1,
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: -2
  },
  seperator: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    zIndex: 3
  },
  spendingData: {
    marginTop: -4,
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  }
});

export default styles;

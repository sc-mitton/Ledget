import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 12,
    zIndex: 1
  },
  blurView: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    height: 150,
    zIndex: -1,
    borderBottomWidth: 2
  },
  canvas: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    height: 150
  },
  boxesContainer: {
    flex: 1
  },
  blurEmoji: {
    fontSize: 100,
    lineHeight: 140,
    transform: [{ scaleX: 2 }],
    position: 'absolute',
    top: 36,
    left: 20,
    zIndex: -2
  },
  spendingData: {
    flexDirection: 'row',
    gap: 6,
    marginTop: -2
  }
});

export default styles;

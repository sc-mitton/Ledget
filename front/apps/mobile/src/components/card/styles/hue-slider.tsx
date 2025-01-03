import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  sliderContainer: {
    marginHorizontal: 8,
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 6,
    right: 6,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  slider: {
    width: '100%',
    borderRadius: 10,
    height: 16,
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '200%',
  },
  sliderGradient: {
    borderRadius: 10,
  },
  chevronIconContainer: {
    marginTop: -16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  chevronIcon: {
    position: 'absolute',
    zIndex: -1,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    transform: [{ translateY: 0.3 }],
    bottom: '100%',
    borderColor: 'white',
    borderWidth: 2.5,
    position: 'absolute',
  },
});

export default styles;

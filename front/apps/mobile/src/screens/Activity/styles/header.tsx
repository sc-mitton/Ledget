import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  headerContainer: {
    marginBottom: 0,
    marginTop: 12,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '66%',
    alignItems: 'center',
    gap: 12,
    marginRight: 4,
    marginBottom: 12,
  },
  countCountainer: {
    position: 'relative',
    marginRight: 4,
  },
  countBackgroundOuterContainer: {
    position: 'relative',
  },
  countBackgroundContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
    top: '50%',
  },
  countBackground: {
    borderRadius: 5,
    height: 20,
    width: 20,
    position: 'absolute',
    opacity: 0.1,
  },
  seperator: {
    width: '200%',
  },
  lightModeSeperator: {
    transform: [{ translateY: 8 }],
  },
});

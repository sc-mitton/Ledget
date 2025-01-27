import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  regularTouchableContainer: {
    position: 'relative',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 13,
  },
  smallTouchableContainer: {
    position: 'relative',
    padding: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 13,
  },
  skeletonCardTouchableContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    overflow: 'hidden',
    borderRadius: 13,
  },
  cardBorder: {
    borderRadius: 13,
    zIndex: -1,
    position: 'absolute',
    opacity: 0.8,
  },
  smallCardBorder: {
    top: -1,
    left: -1,
    bottom: -1,
    right: -1,
  },
  regularCardBorder: {
    top: -1,
    left: -1,
    bottom: -1,
    right: -1,
  },
  pressable: {
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardContainer: {
    width: '100%',
    height: '100%',
  },
  cardBack1: { zIndex: -1, opacity: 0.45 },
  cardBack2: { zIndex: -2 },
  cardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    justifyContent: 'space-between',
    flex: 1,
  },
  smallCardPadding: {
    paddingTop: 6,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  regularCardPadding: {
    paddingTop: 8,
    paddingBottom: 6,
    paddingRight: 16,
    paddingLeft: 16,
  },
  cardTopHalf: {
    justifyContent: 'flex-start',
    flex: 1,
    paddingBottom: 8,
  },
  logo: {
    position: 'absolute',
    top: 8,
    right: 6,
  },
  logoTint: {
    opacity: 0.9,
    zIndex: 1,
  },
  accountName: {
    opacity: 0.9,
  },
  mask: {
    marginLeft: 6,
    transform: [{ translateY: 2 }],
    opacity: 0.7,
  },
  smallMask: {
    transform: [{ translateY: 5 }],
  },
  bottomStripe: {
    height: '25%',
    width: '200%',
    position: 'absolute',
    bottom: 0,
    opacity: 0.05,
  },
  chipContainer: {
    borderRadius: 4,
    position: 'absolute',
    bottom: '36%',
    left: 16,
    overflow: 'hidden',
    opacity: 0.7,
  },
  chip: {
    zIndex: 1,
    opacity: 0.95,
  },
  chipBack: {
    zIndex: 0,
  },
});

export default styles;

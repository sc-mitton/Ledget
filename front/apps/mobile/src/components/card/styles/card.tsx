import { StyleSheet } from 'react-native';

const borderRadius = 14;

const styles = StyleSheet.create({
  cardBorder: {
    borderRadius: 13,
    borderWidth: 1.5,
    zIndex: -1,
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
  },
  pressable: {
    position: 'relative',
  },
  cardContainer: {
    width: '100%',
    height: '100%',
  },
  cardBack1: { zIndex: -1, opacity: 0.45, borderRadius: borderRadius },
  cardBack2: { zIndex: -2, borderRadius: borderRadius },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
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
    width: '100%',
    position: 'absolute',
    bottom: 0,
    opacity: 0.05,
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
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

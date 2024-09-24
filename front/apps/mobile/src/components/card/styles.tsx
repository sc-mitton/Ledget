import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  touchableContanier: {
    position: 'relative',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonCardTouchableContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBorder: {
    borderRadius: 13,
    zIndex: -1,
    position: 'absolute',
    overflow: 'hidden',
    opacity: .8
  },
  smallCardBorder: {
    top: -.5,
    left: -.5,
    bottom: -.5,
    right: -.5,
  },
  regularCardBorder: {
    top: 0,
    left: -2,
    bottom: 0,
    right: -2,
  },
  touchable: {
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1
  },
  card: {
    justifyContent: 'space-between',
    flex: 1,
    overflow: 'hidden'
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
  logo: {
    position: 'absolute',
    top: 8,
    right: 6
  },
  logoTint: {
    opacity: .9,
    zIndex: 1
  },
  mask: {
    marginLeft: 6,
    opacity: .2
  },
  bottomStripe: {
    height: '30%',
    width: '200%',
    position: 'absolute',
    bottom: 0,
    opacity: .03
  }
});

export default styles;

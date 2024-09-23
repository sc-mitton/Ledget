import { StyleSheet } from 'react-native';
import { CARD_HEIGHT, CARD_WIDTH } from './constants';

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
    top: 0,
    left: -2,
    bottom: 0,
    right: -2,
    borderRadius: 13,
    zIndex: -1,
    position: 'absolute',
    overflow: 'hidden',
    opacity: .8
  },
  touchable: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    overflow: 'hidden'
  },
  card: {
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 6,
    paddingRight: 16,
    paddingLeft: 16,
    flex: 1,
    overflow: 'hidden'
  },
  logo: {
    position: 'absolute',
    top: 12,
    right: 12
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

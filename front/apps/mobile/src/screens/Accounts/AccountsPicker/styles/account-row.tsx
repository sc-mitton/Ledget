import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  accountCard: {
    width: '100%',
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 4,
    borderRadius: 12,
    position: 'relative',
  },
  accountCardTouchable: {
    paddingVertical: 4,
  },
  accountCardOverlay: {
    opacity: .02,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  accountCardInfo: {
    flexDirection: 'row',
    gap: 12,
    paddingLeft: 4,
    alignItems: 'center',
    position: 'relative',
    borderRadius: 16,
    zIndex: 0
  },
  accountInfo: {
    flexGrow: 1,
  },
  balance: {
    paddingRight: 12
  },
  institutionLogoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    width: 28,
    height: 28,
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: 40,
    opacity: .6
  },
});

export default styles;

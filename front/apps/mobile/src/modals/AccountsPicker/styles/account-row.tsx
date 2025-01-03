import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  accountCard: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  accountCardOverlay: {
    opacity: 0.02,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  accountCardInfo: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
    paddingRight: 12,
    paddingLeft: 8,
    alignItems: 'center',
    position: 'relative',
    zIndex: 0,
  },
  accountInfo: {
    flexGrow: 1,
  },
  balance: {
    marginRight: -12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
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
    opacity: 0.6,
  },
  seperator: {
    paddingLeft: 40,
  },
});

export default styles;

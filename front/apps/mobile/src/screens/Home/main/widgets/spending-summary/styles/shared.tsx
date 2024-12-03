import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  box: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalAmount: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start'
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  bottomRowCell: {
    flexGrow: 1,
    flex: 1,
    alignItems: 'center',
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 2
  },
  smallDot: {
    width: 6,
    height: 6,
    borderRadius: 120,
  },
  overlappingDot: {
    marginLeft: -7
  },
  bottomTitle: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    marginBottom: -2
  },
  title: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    marginBottom: -2
  },
  dollarPlaceholder: {
    height: 14,
    width: 50,
    marginTop: 4,
    borderRadius: 8,
  }
});

export default styles;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  bellIcon: {
    marginRight: 4,
  },
  emptyBox: {
    justifyContent: 'center',
  },
  box: {
    flexDirection: 'column',
    flex: 1,
    flexShrink: 1,
  },
  alerts: {
    flexDirection: 'column',
    gap: 4,
  },
  alert: {
    gap: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  alertCircle: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertIndex: {
    lineHeight: 18,
    transform: [{ translateY: 2 }, { translateX: 0.5 }],
  },
  trashButton: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
});

export default styles;

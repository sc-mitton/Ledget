import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  alertsBoxContainer: {
    marginBottom: 16
  },
  alerts: {
    flexDirection: 'column',
    gap: 4
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
    alignItems: 'center'
  },
  alertIndex: {
    lineHeight: 18,
    transform: [{ translateY: 2 }, { translateX: .5 }]
  },
  trashButton: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});

export default styles;

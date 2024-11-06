import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  statsTopRow: {
    alignItems: 'flex-start',
    width: '100%',
    gap: 4
  },
  statsBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 4
  },
  bottomRowCell: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default styles;

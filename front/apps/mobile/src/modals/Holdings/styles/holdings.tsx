import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10
  },
  modalBackground: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'relative'
  },
  headerSeperator: {
    width: '200%',
    transform: [{ translateX: '-50%' }],
  },
  tableHeader: {
    width: '103%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default styles;

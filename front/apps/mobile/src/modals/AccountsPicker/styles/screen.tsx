import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  modalBackground: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'relative',
  },
  accountsListContainer: {
    position: 'relative',
    flex: 1,
  },
  accountsList: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  draggableListContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 2,
  },
});

export default styles;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  searchInput: {
    paddingLeft: 28,
  },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    left: 16,
    marginTop: 1,
  },
  modal: {
    zIndex: 100,
  },
  sectionHeader: {
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
  },
  sectionList: {
    marginBottom: 24,
  },
  sectionListContent: {
    paddingBottom: 250,
  },
});

export default styles;

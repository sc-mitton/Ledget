import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backPanel: {
    zIndex: -2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
  },
  seperator: {
    marginTop: 8,
  },
});

export default styles;

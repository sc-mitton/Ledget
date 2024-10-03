import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: -44,
    marginTop: 0,
    zIndex: 10
  },
  backPanel: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    transform: [{ translateY: -8 }]
  },
  header: {
    flex: 1
  },
});

export default styles;

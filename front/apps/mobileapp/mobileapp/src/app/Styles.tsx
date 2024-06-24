import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    main: {
        flex: 1,
        position: 'relative',
        zIndex: 0,
        paddingTop: 80,
        paddingLeft: 24,
        paddingRight: 24,
    },
    nav: {
        position: 'absolute',
        justifyContent: 'space-between',
        flexDirection: 'row',
        bottom: 0,
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 24,
        paddingBottom: 40,
        left: 0,
        right: 0,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});

declare module '*.scss' {
    const styles: {
        readonly [key: string]: StyleProp<ViewStyle>;
    };
    export default styles;
}

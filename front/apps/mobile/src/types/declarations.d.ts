declare module '*.scss' {
    const styles: {
        readonly [key: string]: StyleProp<ViewStyle>;
    };
    export default styles;
}

declare module '*.ttf' {
    const value: string;
    export default value;
}


declare module '*.png' {
    const value: ImageSourcePropType;
    export default value;
}

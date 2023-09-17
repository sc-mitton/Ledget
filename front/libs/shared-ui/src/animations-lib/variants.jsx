export const jiggleVariants = {
    static: { x: 0, opacity: 1 },
    jiggle: {
        x: [-20, 20, 0],
        opacity: 1,
        transition: { duration: .2, type: 'spring', stiffness: 1000, damping: 10 },
    },
}

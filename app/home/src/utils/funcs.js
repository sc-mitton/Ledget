
export const formatName = (name) => (
    name.split(' ').map((word) => {
        name.charAt(0).toUpperCase() + name.slice(1)
        return word.charAt(0).toUpperCase() + word.slice(1)
    }).join(' ')
)

export const formatDollar = (i) =>
    `$${i / 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

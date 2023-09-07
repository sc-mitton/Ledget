
export const formatName = (name) => (
    name.split(' ').map((word) => {
        name.charAt(0).toUpperCase() + name.slice(1)
        return word.charAt(0).toUpperCase() + word.slice(1)
    }).join(' ')
)

// Takes in the dollar value for a currency and returns a formatted string
// ex: 1000 -> $1,000, 25000000 -> $25,000,000
export const formatDollar = (str) =>
    `$${str}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

// Takes in a string currency and returns a formatted string
// ex: 100000 -> $1,000, 25000 -> $250
export const formatRoundedCurrency = (val) => {
    let str = ''
    typeof val === 'string'
        ? str = val.replace(/[^0-9]/g, '')
        : str = (val / 100).toString()

    return formatDollar(str)
}

// Takes in a string currency and returns a formatted string
// ex: 100000 -> $1,000.00, 25000 -> $250.00
export const formatCurrency = (val) => {
    if (!val) return

    let str = ''
    typeof val === 'string'
        ? str = val.replace(/[^0-9]/g, '').replace(/^0+/, '')
        : str = val.toString()

    const dollar = str.slice(0, str.length - 2) || '0'
    let cents = str.slice(str.length - 2)
    if (cents.length === 0) cents = '00'
    if (cents.length === 1) cents = `0${cents}`

    return `${formatDollar(dollar)}.${cents}`
}

// Takes in a string currency and returns an integer
// by removing all non-numeric characters and leading zeros
// ex: $1,000.00 -> 100000, $250 -> 25000
export const makeIntCurrencyFromStr = (s) => {
    if (s === '$0') { return 0 }
    let newVal
    newVal = parseInt(s.replace(/[^0-9]/g, '').replace(/^0+/, ''))
    return s.includes('.') ? newVal : newVal * 100
}

// For list of objects, returns the length of the longest string
// for the given key
export const getLongestLength = (items, key) => {
    const longestLength = items.reduce((acc, curr) => {
        if (curr[key] && curr[key].toString().length > acc) {
            return curr[key].toString().length
        } else {
            return acc
        }
    }, 0)
    return longestLength
}

export function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const formatDateOrRelativeDate = (unixTimestamp) => {
    const currentDate = new Date();
    const inputDate = new Date(unixTimestamp * 1000); // Convert Unix timestamp to milliseconds

    const timeDiffInDays = Math.floor((currentDate - inputDate) / (1000 * 60 * 60 * 24));

    if (timeDiffInDays === 1) {
        return "yesterday";
    } else if (timeDiffInDays === 0) {
        return "today";
    } else if (timeDiffInDays === 2) {
        return "2 days ago";
    } else if (timeDiffInDays === 3) {
        return "3 days ago";
    } else {
        const year = inputDate.getFullYear().toString().substr(-2); // Get last two digits of the year
        const month = (inputDate.getMonth() + 1).toString(); // Month is zero-based, so we add 1
        const day = inputDate.getDate().toString().padStart(2, "0");
        return `${month}/${day}/${year}`;
    }
}

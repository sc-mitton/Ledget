function formatDateOrRelativeDate(unixTimestamp) {
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

export default formatDateOrRelativeDate;

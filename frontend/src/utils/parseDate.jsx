export const parse_AAAA_MM_DD = (date, separator) => {
    const BASE_CASE = "01/01/1970";
    if (typeof(date) !== "string") {
        return BASE_CASE;
    }
    const dateArray = date.split(separator);
    if (dateArray.length !== 3) {
        return BASE_CASE;
    }
    return String(dateArray[2]) + "/" + String(dateArray[1]) + "/" + String(dateArray[0]);
}

export const parse_SQLDate = (date) => {
    const BASE_CASE = "01/01/1970 00:00";
    if (typeof(date) !== "string") {
        return BASE_CASE;
    }
    date = date.split("T");
    if (date.length !== 2) {
        return BASE_CASE;
    }
    return parse_AAAA_MM_DD(date[0], "-");
}
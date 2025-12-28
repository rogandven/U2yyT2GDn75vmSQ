export const parseUnixDate = (date) => {
        const defaultDate = "01/01/1970";
        
        if (!date) {
            return defaultDate;
        }

        date = parseInt(date) * 1000;

        try {
            const formattedDate = new Date(date);
            if (!formattedDate) {
                return defaultDate;
            }

            return (formattedDate.getDate().toString()) + "/" + ((formattedDate.getMonth() + 1).toString()) + "/" + (formattedDate.getFullYear());
        } catch (error) {
            console.error(error);
            return defaultDate;
        }
}

export const parseUnixDate_ALT = (date) => {
        const defaultDate = "01/01/1970";
        
        if (!date) {
            return defaultDate;
        }

        date = parseInt(date);

        try {
            const formattedDate = new Date(date);
            if (!formattedDate) {
                return defaultDate;
            }

            return (formattedDate.getFullYear()) + "-" + ((formattedDate.getMonth() + 1).toString()) + "-" + (formattedDate.getDate().toString());
        } catch (error) {
            console.error(error);
            return defaultDate;
        }
}

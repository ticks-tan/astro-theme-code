import { format as dfsFormatDate, parse as dfsParseDate } from 'date-fns';

export const DataUtils = {
    formatDate: (
        date: Date | number | string,
        formatStr: string = 'yyyy-MM-dd HH:mm',
    ) => {
        const newDate = new Date(date);
        return dfsFormatDate(newDate, formatStr);
    },
    parseDate: (dateStr: string, formatStr: string = "yyyy-MM-dd'T'HH:mm") => {
        return dfsParseDate(dateStr, formatStr, new Date());
    },
};

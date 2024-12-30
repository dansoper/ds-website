const moment = require('moment');

module.exports = {
    eleventyComputed: {
        eachStation(data) {
            const s = data.rail.stations.map(station => {
                const firstVisit = data.rail.trips.find(a => a.toCode == station.code || a.fromCode == station.code);
                let visitDate = null;
                if (firstVisit != null) {
                    const time = firstVisit.toCode == station.code ? decimalToTime(firstVisit.arrival) : decimalToTime(firstVisit.departure);
                    visitDate = moment(firstVisit.date).hours(time.hours).minutes(time.minutes);
                }
                return {
                    ...station,
                    firstVisit,
                    visitDate
                }
            }).filter(a => a.visitDate != null);
            s.sort((a, b) => a.visitDate - b.visitDate);
            return s;
        },
        startOf2025() {
            return moment("2025-01-01");
        }
    }
}

function decimalToTime(decimal) {
    decimal = decimal * 24;
    // Calculate the number of hours (integer part)
    let hours = Math.floor(decimal);
    
    // Calculate the remaining minutes (decimal part * 60)
    let minutes = Math.round((decimal - hours) * 60);

    // Ensure minutes are within the range of 0-59
    if (minutes === 60) {
        minutes = 0;
        hours++;
    }

    return {hours, minutes};
}
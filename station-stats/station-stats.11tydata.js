const moment = require('moment');

module.exports = {
    eleventyComputed: {
        eachStation(data) {
            return stationVisits(data);
        },
        startOf2025() {
            return moment("2025-01-01");
        },
        stationDays(data) {
            const stations = stationVisits(data);

            const groupedByDay = stations.reduce((acc, item) => {
                // Format to a YYYY-MM-DD string so all visits on the same day match
                const dayKey = item.visitDate.format("YYYY-MM-DD");

                // Create array for this day if it doesn't exist yet
                if (!acc[dayKey]) {
                    acc[dayKey] = [];
                }

                // Add item to that day
                acc[dayKey].push(item);

                return acc;
            }, {});

            const days = Object.entries(groupedByDay).map(([day, items]) => ({
                day,
                items
            }));

            days.sort((a, b) => a.items.length - b.items.length);

            return days;
        },
        stationMonths(data) {
            const stations = stationVisits(data);

            const groupedByMonth = stations.reduce((acc, item) => {
                // Format to a YYYY-MM string so all visits on the same day match
                const monthKey = item.visitDate.format("YYYY-MM");

                // Create array for this day if it doesn't exist yet
                if (!acc[monthKey]) {
                    acc[monthKey] = [];
                }

                // Add item to that day
                acc[monthKey].push(item);

                return acc;
            }, {});

            const months = Object.entries(groupedByMonth).map(([month, items]) => ({
                month,
                items
            }));

            months.sort((a, b) => a.items.length - b.items.length);

            return months;
        },
        stationYears(data) {
            const stations = stationVisits(data);

            const groupedByYear = stations.reduce((acc, item) => {
                // Format to a YYYY-MM string so all visits on the same day match
                const yearKey = item.visitDate.format("YYYY");

                // Create array for this day if it doesn't exist yet
                if (!acc[yearKey]) {
                    acc[yearKey] = [];
                }

                // Add item to that day
                acc[yearKey].push(item);

                return acc;
            }, {});

            const years = Object.entries(groupedByYear).map(([year, items]) => ({
                year,
                items
            }));

            years.sort((a, b) => a.items.length - b.items.length);

            return years;
        }
    }
}

const stationVisits = (data) => {
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
};

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

    return { hours, minutes };
}
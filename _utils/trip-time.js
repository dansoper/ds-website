const moment = require('moment');

// Converts a spreadsheet time value (fraction of a day, e.g. 0.5 == 12:00) into hours/minutes.
function decimalToTime(decimal) {
    decimal = decimal * 24;
    let hours = Math.floor(decimal);
    let minutes = Math.round((decimal - hours) * 60);

    if (minutes === 60) {
        minutes = 0;
        hours++;
    }

    return { hours, minutes };
}

// A trip only has a date (no time) plus separate decimal arrival/departure times.
// This combines them into a single moment for the given station, so same-day visits sort correctly.
function tripMoment(trip, stationCode) {
    if (trip == null) return null;
    const decimal = trip.toCode == stationCode ? trip.arrival : trip.departure;
    const time = decimalToTime(decimal);
    return moment(trip.date).hours(time.hours).minutes(time.minutes);
}

module.exports = { decimalToTime, tripMoment };

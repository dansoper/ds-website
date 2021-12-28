const moment = require('moment');

module.exports = {
    eleventyComputed: {
        futureEvents(data) {
            var d = getYmd(new Date());
            const e = data.events.filter(a => a.startDate >= d).map(modifyEvent);
            e.sort((a, b) => a.startDate - b.startDate);
            return e;
        },
        pastEvents(data) {
            var d = getYmd(new Date());
            const e = data.events.filter(a => a.startDate < d).map(modifyEvent);
            e.sort((a, b) => b.startDate - a.startDate);
            const f = groupBy(e, "year");
            return f;
        }
    }
}

const getYmd = (d) => {
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var d = d.getDate();
    if (m < 10) m = "0" + m;
    if (d < 10) d = "0" + d;
    return parseInt("" + y + m + d);
}

const modifyEvent = (event) => {
    event.year = event.startDate.toString().substring(0,4);
    let format = "dddd D MMMM YYYY";
    let sd = moment(event.startDate, "YYYYMMDD");
    if (event.endDate != null) {
        let ed = moment(event.endDate, "YYYYMMDD");
        if (ed.year() == sd.year() && ed.month() == sd.month()) {
            format = "dddd D";
        } else if (ed.year() == sd.year()) {
            format = "dddd D MMMM";
        }
        event.endDateFormatted = ed.format("dddd D MMMM YYYY");
    }
    event.startDateFormatted = sd.format(format);
    return event;
}

const groupBy = (arr, key) => {
    const initialValue = {};
    const groupedObj = arr.reduce((acc, cval) => {
      const myAttribute = cval[key];
      acc[myAttribute] = [...(acc[myAttribute] || []), cval]
      return acc;
    }, initialValue);
    return Object.keys(groupedObj).map(a => {
        return { year: a, events: groupedObj[a] }
     }).sort((a, b) => b.year - a.year);
  };
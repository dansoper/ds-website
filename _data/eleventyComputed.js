const moment = require('moment');

module.exports = {
    futureEvents: data => {
        const d = getYmd(new Date());
        const e = data.events.filter(a => a.startDate >= d).map(modifyEvent);
        e.sort((a, b) => a.startDate - b.startDate);
        return e;
    },
    pastEvents: data => {
        const d = getYmd(new Date());
        const e = data.events.filter(a => a.startDate < d).map(modifyEvent);
        e.sort((a, b) => b.startDate - a.startDate);
        return groupByYear(e);
    },
    nextEvent: data => {
        // Depends on futureEvents having already resolved in the data cascade.
        return Array.isArray(data.futureEvents) ? data.futureEvents[0] || null : null;
    },
    visitedStations: data => {
        const trips = data.rail.trips;
        const visitCounts = countStationVisits(trips);
        return data.rail.stations.filter(station => trips.find(a => a.toCode == station.code || a.fromCode == station.code) != null).map(station => {
            return {
                ...station,
                firstTrip: trips.find(a => a.toCode == station.code || a.fromCode == station.code),
                visitCount: visitCounts[station.code] || 0 };
        });
    },
    unvisitedStations: data => {
        const trips = data.rail.trips;
        return data.rail.stations.filter(station => trips.find(a => a.toCode == station.code || a.fromCode == station.code) == null);
    },
    allStationsList: data => {
        // The Array.isArray checks are because this runs at the start with visitedStations/unvisitedStations unresolved.
        const visitedStations = Array.isArray(data.visitedStations) ? data.visitedStations : [];
        const unvisitedStations = Array.isArray(data.unvisitedStations) ? data.unvisitedStations : [];
        const visited = visitedStations.map(station => ({ ...station, visited: true }));
        const unvisited = unvisitedStations.map(station => ({ ...station, visited: false, firstTrip: null, visitCount: 0 }));
        return [...visited, ...unvisited].sort((a, b) => a.name.localeCompare(b.name));
    },
    lastVisitedStation: data => {
        // Depends on visitedStations having already resolved in the data cascade.
        const visited = Array.isArray(data.visitedStations) ? data.visitedStations : [];
        return visited.reduce((latest, station) => {
            return latest == null || station.firstTrip.date > latest.firstTrip.date ? station : latest;
        }, null);
    },
    stationTotals: data => {
        // Depends on countyStats having already resolved in the data cascade.
        const stats = Array.isArray(data.countyStats) ? data.countyStats : [];
        return stats.find(c => c != null && c.name === "Total") || null;
    },
    countyStats: data => {
        const stations = data.rail.stations;
        const trips = data.rail.trips;
        let counties = data.counties.map(c => { return { total: 0, visited: 0, name: c } });
        let englandTotal = 0;
        let englandVisited = 0;
        stations.forEach(station => {
            let county = counties.find(a => a.name == station.county);
            if (county == null) {
                county = { total: 0, visited: 0, name: station.county };
                counties.push(county);
            }
            if (county.name != "Wales" && county.name != "Scotland") englandTotal++;
            county.total++;
            if (trips.find(a => a.toCode == station.code || a.fromCode == station.code) != null) {
                county.visited++;
                if (county.name != "Wales" && county.name != "Scotland") englandVisited++;
            }
        });
        // The null checks here are because this runs at the start with an array of null objects. Not sure why.
        const wales = counties.find(a => a != null && a.name == "Wales" );
        const scotland = counties.find(a => a != null && a.name == "Scotland");
        const englandNotOnMapExists = data.countiesNotOnMap.notOnMapCount > 0;
        counties = counties.filter(a => a != null && a.name != "Wales" && a.name != "Scotland");
        if (englandNotOnMapExists) {
            counties.push({ total: englandTotal, visited: englandVisited, name: "England (on map)" });
            counties.push({ total: data.countiesNotOnMap.notOnMapCount, visited: 0, name: "England (not on map)" });
        }
        counties.push({ total: data.countiesNotOnMap.notOnMapCount + englandTotal, visited: englandVisited, name: "England" });
        
        const scotTotal = 363;
        const scot = scotland != null ? scotTotal - scotland.total : scotTotal;
        if (scotland != null) { scotland.name = "Scotland (on map)"; counties.push(scotland); }
        counties.push({ total: scot, visited: 0, name: scotland != null ?  "Scotland (not on map)" : "Scotland" });
        if (scotland != null) {
            counties.push({ total: scotTotal, visited: scotland?.visited ?? 0, name: "Scotland" });
        }

        const walTotal = 223;
        const wal = wales != null ? walTotal - wales.total : walTotal;
        if (wales != null) { wales.name = "Wales (on map)"; counties.push(wales); }
        counties.push({ total: wal, visited: 0, name: wales != null ? "Wales (not on map)" : "Wales" });
        if (wales != null) {
            counties.push({ total: walTotal, visited: wales?.visited ?? 0, name: "Wales" });
        }

        counties.push({ total: englandTotal + data.countiesNotOnMap.notOnMapCount + scotTotal + walTotal, visited: englandVisited + (scotland?.visited ?? 0) + (wales?.visited ?? 0), name: "Total" });
        
        counties.forEach(county => {
            if (county != null) {
                county.percentage = Math.round(county.visited / county.total * 10000) / 100;
            }
        });
        return counties;
    },
    londonStats: data => {
        const stations = data.rail.stations.filter(a => a.londonBorough != null);
        const trips = data.rail.trips;
        const boroughs = [];
        let total = 0;
        let visited = 0;
        stations.forEach(station => {
            let borough = boroughs.find(a => a.name == station.londonBorough);
            if (borough == null) {
                borough = { total: 0, visited: 0, name: station.londonBorough };
                boroughs.push(borough);
            }
            total++;
            borough.total++;
            if (trips.find(a => a.toCode == station.code || a.fromCode == station.code) != null) {
                borough.visited++;
                visited++;
            }
        });
        boroughs.push({ total, visited, name: "Total" });
        
        boroughs.forEach(borough => {
            if (borough != null) {
                borough.percentage = Math.round(borough.visited / borough.total * 10000) / 100;
            }
        });
        return boroughs;
    },
    countiesNotOnMap: data => {
        const countiesOnMap = data.counties;
        const allCounties = data.allCounties;
        const extraCount = data.rail.stations.filter(a => a.county == "Extras").length;
        const countiesNotOnMap = allCounties.filter(c => countiesOnMap.find(d => d == c.name) == null);
        const notOnMapCount = countiesNotOnMap.reduce((prev, curr) => prev + curr.hardcodedTotal, 0);
        return { notOnMapCount: notOnMapCount - extraCount, counties: countiesNotOnMap };
    }
}

const getYmd = (d) => {
    const y = d.getFullYear();
    let m = d.getMonth() + 1;
    let day = d.getDate();
    if (m < 10) m = "0" + m;
    if (day < 10) day = "0" + day;
    return parseInt("" + y + m + day);
}

const modifyEvent = (event) => {
    event.year = event.startDate.toString().substring(0, 4);
    let format = "dddd D MMMM YYYY";
    const sd = moment(event.startDate, "YYYYMMDD");
    if (event.endDate != null) {
        const ed = moment(event.endDate, "YYYYMMDD");
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

const groupByYear = (events) => {
    const initialValue = {};
    const groupedObj = events.reduce((acc, cval) => {
        acc[cval.year] = [...(acc[cval.year] || []), cval];
        return acc;
    }, initialValue);
    return Object.keys(groupedObj).map(a => {
        return { year: a, events: groupedObj[a] }
    }).sort((a, b) => b.year - a.year);
}

// Counts a station once per physical presence there, rather than once per trip leg
// that touches it. Without this, changing trains at a station (arriving on one leg,
// then departing on the very next leg of the same day) would count as two visits.
function countStationVisits(trips) {
    const counts = {};
    trips.forEach((trip, i) => {
        const prevTrip = trips[i - 1];
        const isInterchange = prevTrip != null
            && prevTrip.toCode == trip.fromCode
            && prevTrip.date.getTime() == trip.date.getTime();
        if (!isInterchange) {
            counts[trip.fromCode] = (counts[trip.fromCode] || 0) + 1;
        }
        counts[trip.toCode] = (counts[trip.toCode] || 0) + 1;
    });
    return counts;
}

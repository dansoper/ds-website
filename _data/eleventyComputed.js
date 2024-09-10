module.exports = {
    visitedStations: data => {
        const trips = data.rail.trips;
        return data.rail.stations.filter(station => trips.find(a => a.toCode == station.code || a.fromCode == station.code) != null).map(station => {
            return {
                ...station,
                firstTrip: trips.find(a => a.toCode == station.code || a.fromCode == station.code),
                visitCount: trips.filter(a => a.toCode == station.code || a.fromCode == station.code).length };
        });
    },
    unvisitedStations: data => {
        const trips = data.rail.trips;
        return data.rail.stations.filter(station => trips.find(a => a.toCode == station.code || a.fromCode == station.code) == null);
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

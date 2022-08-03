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
        const counties = data.counties.map(c => { return { total: 0, visited: 0, name: c } });;
        let total = 0;
        let visited = 0;
        stations.forEach(station => {
            let county = counties.find(a => a.name == station.county);
            if (county == null) {
                county = { total: 0, visited: 0, name: station.county };
                counties.push(county);
            }
            total++;
            county.total++;
            if (trips.find(a => a.toCode == station.code || a.fromCode == station.code) != null) {
                county.visited++;
                visited++;
            }
        });
        counties.push({ total, visited, name: "Total on map" });
        counties.push({ total: data.countiesNotOnMap.notOnMapCount, visited: 0, name: "Total not on map (England)" });
        const scot = 359
        counties.push({ total: scot, visited: 0, name: "Scotland" });
        const wal = 223;
        counties.push({ total: wal, visited: 0, name: "Wales" });
        counties.push({ total: total + data.countiesNotOnMap.notOnMapCount + scot + wal, visited, name: "Total" });
        
        
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

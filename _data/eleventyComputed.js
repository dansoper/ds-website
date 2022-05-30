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
        const counties = [];
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
        counties.push({ total, visited, name: "TOTAL" });
        counties.forEach(county => {
            county.percentage = Math.round(county.visited / county.total * 10000) / 100;
        });
        return counties;
    }
}

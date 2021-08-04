module.exports = function () {
	return {
		today: getToday(),
		fullYear: getYearData()
	};
}

const getToday = function () {
	const today = new Date();
	const season = findSeasonFor(today);
	const feast = findFeastFor(today);
	const day = feast != null ? feast : season;
	return { word: day, title: titles[day] };
}

const getYearData = function () {
	const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
	const days = [];
	for (let i = 0; i <= 365; i++) {
		const dt = new Date();
		dt.setDate(dt.getDate() + i);
		const season = findSeasonFor(dt);
		const feast = findFeastFor(dt);
		const day = feast != null ? feast : season;
		const dateFormat = new Intl.DateTimeFormat('en-GB', options);
		const dateParts = dateFormat.formatToParts(dt);
		const dateString = dateParts.find(a => a.type == "weekday").value + " " + dateParts.find(a => a.type == "day").value + " " + dateParts.find(a => a.type == "month").value + " " + dateParts.find(a => a.type == "year").value;
		days.push({ date: dt, dateString, details: { word: day, title: titles[day] } });
	}
	return days;
}

const titles = {
	'advent': "Season of Advent",
	'christmas-day': "Christmas Day",
	'christmas': "Season of Christmas",
	'epiphany': "Season of Epiphany",
	'candlemas': "Candlemas",
	'ordinary-e-l': "Ordinary Time (Epiphany to Lent)",
	'ash-wednesday': "Ash Wednesday",
	'lent': "Season of Lent",
	'passiontide': "Season of Passiontide",
	'palm-sunday': "Palm Sunday",
	'holy-week': "Holy Week",
	'maundy-thursday': "Maundy Thursday",
	'good-friday': "Good Friday",
	'easter-day': "Easter Day",
	'easter': "Season of Easter",
	'ascension': "Ascension",
	'pentecost': "Pentecost",
	'trinity': "Trinity Sunday",
	'corpus-christi': "Corpus Christi Day",
	'ordinary-may': "Ordinary Time (May)",
	'ordinary-june': "Ordinary Time (June)",
	'ordinary-july': "Ordinary Time (July)",
	'ordinary-august': "Ordinary Time (August)",
	'ordinary-september': "Ordinary Time (September)",
	'ordinary-october': "Ordinary Time (October)",
	'all-saints': "All Saints' Day",
	'kingdom': "Kingdom Season",
	'conversion-of-paul': "The Conversion of Paul",
	'joseph': "Joseph of Nazareth",
	'annunciation': "The Annunciation of Our Lord to the Blessed Virgin Mary",
	'george': "George, Martyr, Patron of England",
	'mark': "Mark the Evangelist",
	'philip-and-james': "Philip and James, Apostles",
	'matthias': "Matthias the Apostle",
	'visit-to-elizabeth': "The Visit of the Blessed Virgin Mary to Elizabeth",
	'barnabas': "Barnabas the Apostle",
	'john-the-baptist': "The Birth of John the Baptist",
	'peter-and-paul': "Peter and Paul, Apostles",
	'thomas': "Thomas the Apostle",
	'mary-magdalene': "Mary Magdalene",
	'james': "James the Apostle",
	'transfiguration': "The Transfiguration of Our Lord",
	'blessed-virgin-mary': "The Blessed Virgin Mary",
	'bartholomew': "Bartholomew the Apostle",
	'holy-cross': "Holy Cross Day",
	'matthew': "Matthew, Apostle and Evangelist",
	'michael': "Michael and All Angels",
	'luke': "Luke the Evangelist",
	'simon-and-jude': "Simon and Jude, Apostles",
	'andrew': "Andrew the Apostle",
	'stephen': "Stephen, Deacon, First Martyr",
	'john-the-evangelist': "John, Apostle and Evangelist",
	'holy-innocents': "The Holy Innocents",
	'ds': "The Birth of Daniel Soper"
};

// Don't forget month is monthIndex
const ashWednesdays = {
	2010: new Date(2010, 1, 17),
	2011: new Date(2011, 2, 9),
	2012: new Date(2012, 1, 22),
	2013: new Date(2013, 1, 13),
	2014: new Date(2014, 2, 5),
	2015: new Date(2015, 1, 18),
	2016: new Date(2016, 1, 10),
	2017: new Date(2017, 2, 1),
	2018: new Date(2018, 1, 14),
	2019: new Date(2019, 2, 6),
	2020: new Date(2020, 1, 26),
	2021: new Date(2021, 1, 17),
	2022: new Date(2022, 2, 2),
	2023: new Date(2023, 1, 22),
	2024: new Date(2024, 1, 14),
	2025: new Date(2025, 2, 5),
	2026: new Date(2026, 1, 18),
	2027: new Date(2027, 1, 10),
	2028: new Date(2028, 2, 1),
	2029: new Date(2029, 1, 14),
	2030: new Date(2030, 2, 6),
	2031: new Date(2031, 1, 26),
	2032: new Date(2032, 1, 11),
	2033: new Date(2033, 2, 2),
	2034: new Date(2034, 1, 22),
	2035: new Date(2035, 1, 7),
	2036: new Date(2036, 1, 27),
	2037: new Date(2037, 1, 18),
	2038: new Date(2038, 2, 10),
	2039: new Date(2039, 1, 23),
	2040: new Date(2040, 1, 15),
}

const festivals = {
	'0125': 'conversion-of-paul',
	'0202': 'candlemas',
	'0319': 'joseph',
	'0325': 'annunciation',
	'0423': 'george',
	'0425': 'mark',
	'0501': 'philip-and-james',
	'0514': 'matthias',
	'0524': 'ds',
	'0531': 'visit-to-elizabeth',
	'0611': 'barnabas',
	'0624': 'john-the-baptist',
	'0629': 'peter-and-paul',
	'0703': 'thomas',
	'0722': 'mary-magdalene',
	'0725': 'james',
	'0806': 'transfiguration',
	'0815': 'blessed-virgin-mary',
	'0824': 'bartholomew',
	'0914': 'holy-cross',
	'0921': 'matthew',
	'0929': 'michael',
	'1018': 'luke',
	'1028': 'simon-and-jude',
	'1101': 'all-saints',
	'1130': 'andrew',
	'1225': 'christmas-day',
	'1226': 'stephen',
	'1227': 'john-the-evangelist',
	'1228': 'holy-innocents'
};

const festivalsByNumber = {
	'0': 'ash-wednesday',
	'39': 'palm-sunday',
	'43': 'maundy-thursday',
	'44': 'good-friday',
	'46': 'easter-day',
	'95': 'pentecost',
	'102': 'trinity',
	'106': 'corpus-christi'
};

function findSeasonFor(date) {
	const y = date.getFullYear();
	let season = "notfound";

	if (date >= new Date(y, 11, 25)) {
		season = "christmas";
	} else if (date >= new Date(y, 11, 24 - new Date(y, 11, 24).getDay() - (7 * 3))) {
		season = "advent";
	} else if (date >= new Date(y, 10, 2)) {
		season = "kingdom";
	} else if (date >= new Date(y, 9, 1)) {
		season = "ordinary-october";
	} else if (date >= new Date(y, 8, 1)) {
		season = "ordinary-september";
	} else if (date >= new Date(y, 7, 1)) {
		season = "ordinary-august";
	} else if (date >= new Date(y, 6, 1)) {
		season = "ordinary-july";
	} else if (date >= new Date(y, ashWednesdays[y].getMonth(), ashWednesdays[y].getDate() + 96) && date >= new Date(y, 5, 1)) {
		season = "ordinary-june";
	} else if (date >= new Date(y, ashWednesdays[y].getMonth(), ashWednesdays[y].getDate() + 96)) {
		season = "ordinary-may";
	} else if (date >= new Date(y, ashWednesdays[y].getMonth(), ashWednesdays[y].getDate() + 85)) {
		season = "ascension";
	} else if (date >= new Date(y, ashWednesdays[y].getMonth(), ashWednesdays[y].getDate() + 46)) {
		season = "easter";
	} else if (date >= new Date(y, ashWednesdays[y].getMonth(), ashWednesdays[y].getDate() + 40)) {
		season = "holy-week";
	} else if (date >= new Date(y, ashWednesdays[y].getMonth(), ashWednesdays[y].getDate() + 32)) {
		season = "passiontide";
	} else if (date >= new Date(y, ashWednesdays[y].getMonth(), ashWednesdays[y].getDate())) {
		season = "lent";
	} else if (date >= new Date(y, 1, 3)) {
		season = "ordinary-e-l";
	} else if (date >= new Date(y, 0, 6)) {
		season = "epiphany";
	} else if (date >= new Date(y, 0, 1)) {
		season = "christmas";
	}
	return season;
}

function findFeastFor(date) {
	const y = date.getFullYear();

	// transfers
	// joseph
	const josephFromAshWed = getDayOfYear(new Date(y, 2, 19)) - getDayOfYear(ashWednesdays[y]);
	const annunFromAshWed = getDayOfYear(new Date(y, 2, 25)) - getDayOfYear(ashWednesdays[y]);
	const josephDay = new Date(y, 2, 19).getDay();
	if (josephFromAshWed >= 39 && josephFromAshWed <= 53) {
		festivals['0319'] = null;
		if (annunFromAshWed >= 39 && annunFromAshWed <= 53) {
			festivalsByNumber['55'] = "joseph";
		} else {
			festivalsByNumber['54'] = "joseph";
		}
	} else if (josephFromAshWed >= 0 && josephFromAshWed <= 95 && josephDay == 0) {
		festivals['0319'] = null;
		festivals['0320'] = "joseph";
	}

	// annunciation
	const annunDay = new Date(y, 2, 25).getDay();
	if (annunFromAshWed >= 39 && annunFromAshWed <= 53) {
		festivals['0325'] = null;
		festivalsByNumber['54'] = "annunciation";
	} else if (annunFromAshWed >= 0 && annunFromAshWed <= 95 && annunDay == 0) {
		festivals['0325'] = null;
		festivals['0326'] = "annunciation";
	}

	// george
	const georgeFromAshWed = getDayOfYear(new Date(y, 3, 23)) - getDayOfYear(ashWednesdays[y]);
	const georgeDay = new Date(y, 3, 23).getDay();
	if (georgeFromAshWed >= 39 && georgeFromAshWed <= 53) {
		festivals['0423'] = null;
		festivalsByNumber['54'] = "george";
	} else if (((georgeFromAshWed >= 0 && georgeFromAshWed <= 95) || georgeFromAshWed == 102) && georgeDay == 0) {
		festivals['0423'] = null;
		festivals['0424'] = "george";
	}

	// mark
	const markFromAshWed = getDayOfYear(new Date(y, 3, 25)) - getDayOfYear(ashWednesdays[y]);
	const markDay = new Date(y, 3, 25).getDay();
	if (markFromAshWed >= 39 && markFromAshWed <= 53) {
		festivals['0425'] = null;
		if (georgeFromAshWed >= 39 && georgeFromAshWed <= 53) {
			festivalsByNumber['55'] = "mark";
		} else {
			festivalsByNumber['54'] = "mark";
		}
	} else if (((markFromAshWed >= 0 && markFromAshWed <= 95) || markFromAshWed == 102) && markDay == 0) {
		festivals['0425'] = null;
		festivals['0426'] = "mark";
	}

	// philip-and-james
	const philipJamesFromAshWed = getDayOfYear(new Date(y, 4, 1)) - getDayOfYear(ashWednesdays[y]);
	const philipJamesDay = new Date(y, 4, 1).getDay();
	if (philipJamesFromAshWed >= 39 && philipJamesFromAshWed <= 53) {
		festivals['0501'] = null;
		if (georgeFromAshWed >= 39 && georgeFromAshWed <= 53) {
			festivalsByNumber['56'] = "philip-and-james";
		} else if (markFromAshWed >= 39 && markFromAshWed <= 53) {
			festivalsByNumber['55'] = "philip-and-james";
		} else {
			festivalsByNumber['54'] = "philip-and-james";
		}
	} else if ((((philipJamesFromAshWed >= 0 && philipJamesFromAshWed <= 95) || philipJamesFromAshWed == 102) && philipJamesDay == 0) || (philipJamesFromAshWed >= 54 && philipJamesFromAshWed <= 55)) {
		festivals['0501'] = null;
		if (georgeFromAshWed >= 39 && georgeFromAshWed <= 53) {
			festivalsByNumber['56'] = "philip-and-james";
		} else if (markFromAshWed >= 39 && markFromAshWed <= 53) {
			festivalsByNumber['55'] = "philip-and-james";
		} else {
			festivals['0502'] = "philip-and-james";
		}
	}

	// matthias
	const matthiasFromAshWed = getDayOfYear(new Date(y, 4, 14)) - getDayOfYear(ashWednesdays[y]);
	const matthiasDay = new Date(y, 4, 14).getDay();
	if ((((matthiasFromAshWed >= 0 && matthiasFromAshWed <= 95) || matthiasFromAshWed == 102) && matthiasDay == 0) || (matthiasFromAshWed == 106)) {
		festivals['0514'] = null;
		if (philipJamesFromAshWed >= 39 && philipJamesFromAshWed <= 53) {
			festivals['0516'] = "matthias";
		} else {
			festivals['0515'] = "matthias";
		}
	}

	// visit-to-elizabeth
	const visitationFromAshWed = getDayOfYear(new Date(y, 4, 31)) - getDayOfYear(ashWednesdays[y]);
	const visitationDay = new Date(y, 4, 31).getDay();
	if ((((visitationFromAshWed >= 0 && visitationFromAshWed <= 95) || visitationFromAshWed == 102) && visitationDay == 0) || (visitationFromAshWed == 106)) {
		festivals['0531'] = null;
		festivals['0601'] = "visit-to-elizabeth";
	}

	// barnabas
	const barnabasFromAshWed = getDayOfYear(new Date(y, 5, 11)) - getDayOfYear(ashWednesdays[y]);
	const barnabasDay = new Date(y, 5, 11).getDay();
	if ((((barnabasFromAshWed >= 0 && barnabasFromAshWed <= 95) || barnabasFromAshWed == 102) && barnabasDay == 0) || (barnabasFromAshWed == 106)) {
		festivals['0611'] = null;
		festivals['0612'] = "barnabas";
	}

	// john-the-baptist
	const johnFromAshWed = getDayOfYear(new Date(y, 5, 24)) - getDayOfYear(ashWednesdays[y]);
	const johnDay = new Date(y, 5, 24).getDay();
	if ((((johnFromAshWed >= 0 && johnFromAshWed <= 95) || johnFromAshWed == 102) && johnDay == 0) || (johnFromAshWed == 106)) {
		festivals['0624'] = null;
		festivals['0625'] = "john-the-baptist";
	}

	const todayFromAshWed = getDayOfYear(date) - getDayOfYear(ashWednesdays[y]);
	let m = date.getMonth() + 1;
	if (m < 10) m = "0" + m;
	let d = date.getDate();
	if (d < 10) d = "0" + d;
	let feast = festivals[m + "" + d];
	if (festivalsByNumber[todayFromAshWed] != null && festivalsByNumber[todayFromAshWed] != "") feast = festivalsByNumber[todayFromAshWed];
	return feast;
}

function getDayOfYear(date) {
	var start = new Date(date.getFullYear(), 0, 0);
	var diff = date - start;
	var oneDay = 1000 * 60 * 60 * 24;
	var day = Math.floor(diff / oneDay);
	return day;
}
var compilations = 27;
var lps = 8;

var albumData = {};
var request = new XMLHttpRequest();
request.open('GET', 'albums/overview.json', true);

request.onload = function() {
	albumData = JSON.parse(request.responseText);
	showGrids();
};

request.onerror = function() {
	alert('Error: cannot retrieve album data.');
};

request.send();

availableCompilations = [];
for(var i=1;i<=compilations;i++) {
	var pad = "0";
	if(i > 99) pad = "";
	else if(i < 10) pad = "00";
	var albumnumber = pad + i;
	availableCompilations.push(albumnumber);
}

availableLPs = [];
for(var i=1;i<=lps;i++) {
	var pad = "0";
	if(i > 99) pad = "";
	else if(i < 10) pad = "00";
	availableLPs.push("MCLP" + pad + i);
}

availableEPs = ["MCEP017", "MCEP037", "MCEP042", "MCEP054", "MCEP062", "MCEP072", "MCEP074", "MCEP079", "MCEP082", "MCEP092", "MCEP094", "MCEP096", "MCEP097"];
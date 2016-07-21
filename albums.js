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

availableEPs = ["MCEP017", "MCEP037", "MCEP042", "MCEP054", "MCEP056", "MCEP058", "MCEP061", "MCEP062", "MCEP065", "MCEP072", "MCEP073", "MCEP074", "MCEP076", "MCEP079", "MCEP080", "MCEP082", "MCEP086", "MCEP088", "MCEP092", "MCEP093", "MCEP094", "MCEP096", "MCEP097"];
showGrids();

var url = window.location.href.split("#");
if(url.length > 1 && url[1].length > 0 && (url[1].substr(0,2) == "MC" || url[1].substr(0,1) == "0")) {
    if(url[1].substr(0,3) == "MC0") {
        url[1] = url[1].substr(2);
    }
    setTimeout(function() { // code somehow doesn't work without using setTimeout
        loadAlbum(url[1]);
        section('album-detail');
    }, 0);
}
else {
    section('home');
}

function section(what) {

    window.scrollTo(0,0);
    window.location = "#";

    var title = "";
    if(what == "compilation-albums") title = "Compilation Albums";
    else if(what == "lps") title = "Long Plays (LPs)";
    else if(what == "eps") title = "Extended Plays (EPs)";
    else if(what == "seasonal") title = "Seasonal Albums";
    else if(what == "album-detail" && currentAlbum !== undefined && !loadingAlbum) {
        title = albumTitle;
        window.location = "#" + currentAlbum;
    }

    if(title == "") document.title = "Monstercat Album Browser";
    else document.title = title + " | Monstercat Album Browser";

    var sections = document.getElementsByClassName("section");
    for(var i=0;i<sections.length;i++) {
        document.getElementsByClassName("section")[i].style.display = 'none';
        document.getElementsByClassName("link")[i].className = 'link';
    }
    document.getElementById(what).style.display = 'block';
    document.getElementById("link-" + what).className = 'link active';
    document.getElementById("sidebar").style.left = "-280px";
    document.getElementById("modal").style.opacity = 0;
    setTimeout(function() {
        document.getElementById("modal").style.display = "none";
    }, 200);

}

function showGrids() {

    for(var i=availableCompilations.length-1;i>=0;i--) document.getElementById("compilations-grid").innerHTML += showAlbumCard(availableCompilations[i]);

    for(var i=availableLPs.length-1;i>=0;i--) document.getElementById("lp-grid").innerHTML += showAlbumCard(availableLPs[i]);

    for(var i=availableEPs.length-1;i>=0;i--) document.getElementById("ep-grid").innerHTML += showAlbumCard(availableEPs[i]);

    for(var i=availableSeasonals.length-1;i>=0;i--) document.getElementById("seasonal-grid").innerHTML += showAlbumCard(availableSeasonals[i]);

    for(var i=0;i<latestReleases.length;i++) document.getElementById("latest-releases").innerHTML += showAlbumCard(latestReleases[i]);

}

function showAlbumCard(number) {

    if(number.indexOf("MCLP") > -1) {
        var albumIndex2 = arrayIndex(number, availableLPs);
        var card_image = albumData.lps[albumIndex2].album_artwork_thumb;
        var card_title = albumData.lps[albumIndex2].album_artist;
        var card_subtitle = albumData.lps[albumIndex2].album_title;
    }
    else if(number.indexOf("MCEP") > -1 || number.indexOf("MCF") > -1 || number.indexOf("MCS") > -1)  {
        var albumIndex2 = arrayIndex(number, availableEPs);
        var card_image = albumData.eps[albumIndex2].album_artwork_thumb;
        var card_title = albumData.eps[albumIndex2].album_artist;
        var card_subtitle = albumData.eps[albumIndex2].album_title;
    }
    else if(number.indexOf("MCH") > -1 || number.indexOf("MCX") > -1) {
        var albumIndex2 = arrayIndex(number, availableSeasonals);
        var card_image = albumData.seasonals[albumIndex2].album_artwork_thumb;
        var card_title = albumData.seasonals[albumIndex2].album_artist;
        var card_subtitle = albumData.seasonals[albumIndex2].album_title;
    }
    else {
        var albumIndex2 = arrayIndex(number, availableCompilations);
        var card_image = albumData.compilations[albumIndex2].album_artwork_thumb;
        var card_title = "MONSTERCAT " + albumData.compilations[albumIndex2].album_number;
        var card_subtitle = albumData.compilations[albumIndex2].album_title;
    }

    return '<div class="album-view" onclick="loadAlbum(\''+number+'\'),section(\'album-detail\')"><img src="'+card_image+'"><div class="album-info"><div class="title">'+card_title+'</div><div class="subtitle">'+card_subtitle+'</div></div></div>';

};

function bannerBg(url) {
    return "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("+url+") center center no-repeat black";
}

function randomIndex(array) {
    return array[Math.round(Math.random()*array.length)];
}

/* TRACKLIST STUFF */

var genres = ["trap", "dnb", "house", "electro", "hard-dance", "glitch-hop", "nu-disco", "future-bass", "trance", "dubstep", "drumstep", "electronic"];

var selectedGenre,
    genreCount,
    data,
    danykaCounter,
    selectedTrack,
    currentAlbum,
    currentAlbumIndex,
    availableAlbums = availableCompilations,
    loadingAlbum = true,
    mode = "compilation",
    audio = new Audio(),
    albumTitle = document.title;

function loadAlbum(number) {

    if(number.indexOf("MCLP") > -1) mode = "lp", availableAlbums = availableLPs;
    else if(number.indexOf("MCEP") > -1 || number.indexOf("MCF") > -1 || number.indexOf("MCS") > -1) mode = "ep", availableAlbums = availableEPs;
    else if(number.indexOf("MCH") > -1 || number.indexOf("MCX") > -1) mode = "seasonal", availableAlbums = availableSeasonals;
    else mode = "compilation", availableAlbums = availableCompilations;

    loadingAlbum = true;

    document.getElementById("album-artwork").src = "";
    document.getElementById("wrapper").style.opacity = 0.5;
    document.getElementById("no-album-selected").style.display = "none";

    var request = new XMLHttpRequest();
    request.open('GET', 'albums/' + number + '.json', true);

    request.onload = function() {

        currentAlbum = number;
        currentAlbumIndex = albumIndex(number);
        window.location = "#" + number;

        if(currentAlbumIndex == 0) document.getElementById("prev-album").style.display = "none";
        else document.getElementById("prev-album").style.display = "table";

        if(currentAlbumIndex == availableAlbums.length-1) document.getElementById("next-album").style.display = "none";
        else document.getElementById("next-album").style.display = "table";

        loadingAlbum = false;
        data = JSON.parse(request.responseText);

        genreCount = [
            { genre: 0, count: 0 },
            { genre: 1, count: 0 },
            { genre: 2, count: 0 },
            { genre: 3, count: 0 },
            { genre: 4, count: 0 },
            { genre: 5, count: 0 },
            { genre: 6, count: 0 },
            { genre: 7, count: 0 },
            { genre: 8, count: 0 },
            { genre: 9, count: 0 },
            { genre: 10, count: 0 },
            { genre: 11, count: 0 }
        ];

        danykaCounter = 0;
        selectedTrack = 99;
        includesText = "";

        if(mode == "compilation") {
            document.getElementById("album-id").innerHTML = "Monstercat " + data.album_number;
            document.title = "Monstercat " + data.album_number + " - " + data.album_title + " Tracklist | Monstercat Album Browser";
        }
        else {
            document.getElementById("album-id").innerHTML = data.album_artist;
            document.title = "[" + data.album_number + "] " + data.album_artist + " - " + data.album_title + " Tracklist | Monstercat Album Browser";
        }
        albumTitle = document.title;

        document.getElementById("album-title").innerHTML = data.album_title;
        document.getElementById("album-artwork").src = data.album_artwork_thumb;
        document.getElementById("artwork-link").href = data.album_artwork_full;
        document.getElementById("tracklist").innerHTML = "";
        document.getElementById("genre-count").innerHTML = "";
        document.getElementById("mixes").innerHTML = "";
        document.getElementById("includes").innerHTML = "";

        var includeMix = false;

        if(mode == "compilation") {
            if(data.album_number == "005") includesText = "INCLUDES 2 PART ALBUM MIX";
            else if(data.mixes.length == 1) includesText = "INCLUDES 1 HOUR ALBUM MIX";
            else if(data.mixes.length > 1) includesText = "INCLUDES " + toText(data.mixes.length) + " 1 HOUR ALBUM MIXES";
            document.getElementById("includes").innerHTML = includesText;
            includeMix = true;
        }
        else {
            if(data.album_number == "MCEP056") {
                includesText = "INCLUDES A CONTINUOUS ALBUM MIX";
                document.getElementById("includes").innerHTML = includesText;
                includeMix = true;
            }
            else if(data.album_number == "MCX002") {
                includesText = "INCLUDES AN ALBUM MIX";
                document.getElementById("includes").innerHTML = includesText;
                includeMix = true;
            }
        }

        if(includeMix) {
            for(z=0;z<data.mixes.length;z++) {
                var thetrack = z+90;
                document.getElementById("mixes").innerHTML += '<div class="mix" id="track-' + thetrack + '" onclick="playSoundCloud(' + thetrack + ', \'' + data.mixes[z].soundcloud_url + '\');"></div>';
                document.getElementById("track-" + thetrack).className = "mix";
                document.getElementById("track-" + thetrack).innerHTML = data.mixes[z].name;
            }
        }

        for(i=0;i<data.tracks.length;i++) {
            var track = data.tracks[i];
            document.getElementById("tracklist").innerHTML += showTrack(i, track);
            genreCount[track.genre].count++;
            if(track.feat.toLowerCase().indexOf("danyka nadeau") > -1) danykaCounter++;
        }

        genreCount.sort(function(x,y){return y.count - x.count;});

        for(i=0;i<12;i++) {
            if(i==6) document.getElementById("genre-count").innerHTML += '<div style="clear: both;"></div>';
            document.getElementById("genre-count").innerHTML += '<div class="genre-wrapper" id="genre-' + genreCount[i].genre + '" onclick="filter(' + genreCount[i].genre + ')">\n\
                <div class="genre-img ' + genres[genreCount[i].genre] + '"></div>\n\
                <div class="genre-num"> ' + genreCount[i].count + '</div>\n\
            </div>';
        }

        document.getElementById("danyka-nadeau").innerHTML = "Danyka Nadeau is featured " + danykaCounter + " time(s) on this album.";

        document.getElementById("wrapper").style.opacity = 1;

        if(selectedGenre < 99) {
            var asd = selectedGenre;
            selectedGenre = 99;
            filter(asd);
        }

    };

    request.onerror = function() {
        loadingAlbum = false;
        section('home');
        alert('Error: Cannot retrieve album data (or album data isn\'t available yet).');
        document.getElementById("album-artwork").src = data.album_artwork_thumb;
        document.getElementById("wrapper").style.opacity = 1;
    };

    request.send();

}

function navigate(what) {

    if(loadingAlbum) return;

    if(what == -1 && currentAlbumIndex < 1) return;
    if(what == 1 && currentAlbumIndex == availableAlbums.length-1) return;

    loadAlbum(availableAlbums[currentAlbumIndex+what]);

}

function filter(genre) {
    var tracks = 0;
    document.getElementById("tracklist").innerHTML = "";
    if(selectedGenre == genre) {
        document.getElementById("genre-" + genre).className = "genre-wrapper";
        document.getElementById("album-mixes").style.display = "block";
        selectedGenre = 99;
    }
    else {
        if(selectedGenre < 99) document.getElementById("genre-" + selectedGenre).className = "genre-wrapper";
        document.getElementById("genre-" + genre).className = "genre-wrapper active";
        document.getElementById("album-mixes").style.display = "none";
        selectedGenre = genre;
    }
    for(i=0;i<data.tracks.length;i++) {
        var track = data.tracks[i];
        if(track.genre == genre || selectedGenre == 99) {
            data.tracks[i].number = i;
            document.getElementById("tracklist").innerHTML += showTrack(i, track);
            tracks++;
        }
    }
    if(tracks == 0) {
        document.getElementById("tracklist").innerHTML += '<div class="track no-tracks">No tracks found.</div>';
    }
}

function showTrack(i, track) {

    var output = "";
    var info = "";
    var title = track.title.replace(/(\((([a-zA-Z0-9 _\-\&'\.\$]* (Remix|Mix|VIP|Edit|Remake))|(with|Performed by) [a-zA-Z0-9 _\-\&]*)\)|\[[a-zA-Z0-9 _\-\&'\.\$]*\])/g, "");

    if(i == selectedTrack) active = " active";
    else active = "";
    if(track.feat != "") info = '(feat. ' + track.feat + ')<br>';

    var search = track.title.search(/(\((([a-zA-Z0-9 _\-\&'\.\$]* (Remix|Mix|VIP|Edit|Remake))|(with|Performed by) [a-zA-Z0-9 _\-\&]*)\)|\[[a-zA-Z0-9 _\-\&'\.\$]*\])/g);
    if(search > -1) info += " " + track.title.substr(search);

    output = '<div class="track' + active + '" onclick="playSoundCloud(' + i + ', \'' + track.soundcloud_url + '\')" id="track-' + i + '">\n\
        <div class="track-number">' + (i+1) + '</div>\n\
        <div class="track-genre"><div class="genre-img ' + genres[track.genre] + '"></div></div>\n\
        <div class="track-artist">' + track.artist + '</div>\n\
        <div class="track-title">' + title + '</div><div class="track-info">' + info + '</div>\n\
    </div>';

    return output;

}

function playSoundCloud(i, url) {

    if(url == "") {
        alert('Link for track not added yet.');
        return;
    }
    if(i == selectedTrack) return;

    if(i > 89) {
        var nowplaying = document.getElementById("album-id").innerHTML + " - " + document.getElementById("album-title").innerHTML + " (" + data.mixes[i-90].name + " Album Mix)";
    }
    else {
        var track = data.tracks[i];
        var nowplaying = track.artist + " - " + track.title;
        if(track.feat != "") nowplaying += " (feat. " + track.feat + ")";
    }

    document.getElementById("now-playing").innerHTML = "Now Playing: <b>" + nowplaying + "</b>";
    document.getElementById("player-div").style.display = "block";
    document.getElementById("spacer").style.display = "block";

    if(selectedTrack<99) {
        audio.pause();
        audio.currentTime = 0;

        if(document.getElementById("track-" + selectedTrack) !== null) {
            if(selectedTrack<90) document.getElementById("track-" + selectedTrack).className = "track";
            else document.getElementById("track-" + selectedTrack).className = "mix";
        }
    }
    selectedTrack = i;
    if(i<90) document.getElementById("track-" + i).className = "track active";
    else document.getElementById("track-" + i).className = "mix active";

    if(url.indexOf("http") < 0) {
        audio.src = 'https://s3.amazonaws.com/data.monstercat.com/blobs/' + url;
        audio.play();
    }
    else {

        var request = new XMLHttpRequest();
        request.open('GET', 'https://api.soundcloud.com/resolve.json?url=' + url + '&client_id=aa5f438c7671dcdd963f0161b2ca5ad7', true);

        request.onload = function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                if(response.kind === "track") {
                    var stream;
                    if(response.sharing == "public") stream = response.stream_url + "?client_id=aa5f438c7671dcdd963f0161b2ca5ad7";
                    else stream = response.stream_url + "&client_id=aa5f438c7671dcdd963f0161b2ca5ad7";
                    audio.src = stream;
                    audio.play();
                }
            }
            else {
                alert('Error: Cannot load music.');
            }
        };

        request.onerror = function() {
            alert('Error: Cannot connect to SoundCloud server.');
        };

        request.send();

    }

    updatePlayer();

}

function updatePlayer() {

    var time = Math.floor(audio.currentTime);
    var time2 = time3 = Math.floor(audio.duration);
    if(isNaN(time2)) time2 = 0, time3 = 1;

    document.getElementById('seek-bar-inner').style.width = (audio.currentTime / time3 * 630) + "px";

    var button = document.getElementById("play-pause");
    if(!audio.paused) {
        button.className = "pause";
        button.innerHTML = "&#9612;&#9612;";
    }
    else {
        button.className = "play";
        button.innerHTML = "&#9658;";
    }

    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    if(seconds < 10) seconds = "0" + seconds;

    var minutes2 = Math.floor(time2 / 60);
    var seconds2 = time2 - minutes2 * 60;
    if(seconds2 < 10) seconds2 = "0" + seconds2;

    document.getElementById("duration").innerHTML = minutes + ":" + seconds + " / " + minutes2 + ":" + seconds2;

    requestAnimationFrame(updatePlayer);

}

function toText(num) {
    var text = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"];
    return text[num];
}

function albumIndex(num) {
    for(i=0;i<availableAlbums.length;i++) {
        if(num === availableAlbums[i]) return i;
    }
    return -1;
}

function arrayIndex(item, array) {
    for(i=0;i<array.length;i++) {
        if(item === array[i]) return i;
    }
    return -1;
}

document.getElementById("hamburger-icon").onclick = function() {
    document.getElementById("sidebar").style.left = "0px";
    document.getElementById("modal").style.display = "block";
    document.getElementById("modal").style.opacity = 0;
    setTimeout(function() {
        document.getElementById("modal").style.opacity = 1;
    }, 1);
};

document.getElementById("modal").onclick = function() {
    document.getElementById("sidebar").style.left = "-280px";
    document.getElementById("modal").style.opacity = 0;
    setTimeout(function() {
        document.getElementById("modal").style.display = "none";
    }, 200);
};

document.getElementById("play-pause").onclick = function() {
    if(!audio.paused) audio.pause();
    else audio.play();
};

document.getElementById("seek-bar").onmousemove = function(e) {
    var offsetLeft = document.body.clientWidth / 2 - 335;
    var x = e.pageX - offsetLeft;
    document.getElementById("seek-bar-ghost").style.width = x + "px";
};

document.getElementById("seek-bar").onmouseout = function(e) {
    document.getElementById("seek-bar-ghost").style.width = "0px";
};

document.getElementById("seek-bar").onclick = function(e) {
    if(!audio.paused) {
        var offsetLeft = document.body.clientWidth / 2 - 335;
        var x = e.pageX - offsetLeft;
        audio.currentTime = x / 630 * audio.duration;
        audio.play();
    }
};

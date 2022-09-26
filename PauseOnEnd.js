/*global chrome*/
var idPauseOnEnd = 'PauseOnEnd';
var idcheckboxPauseOnEnd = 'cbPauseOnEnd';
var selectorPlaylist = 'ytd-playlist-panel-renderer:not([hidden])'; //some parts of youtube interface can be hidden
var selectorPlaylistButtons = '#playlist-actions #top-level-buttons-computed';
var idDefaultState = 'DefaultState';

// console.log(new Date().toISOString() + ' run PauseOnEnd.js on ' + document.URL);

var intervalId;
checkAddObserver()

document.addEventListener("yt-navigate-finish", function(event) {
	// console.log("yt-navigate-finish from PauseOnEnd")
	checkAddObserver()
})

function checkAddObserver() {
    if (location.pathname == "/watch") 
        if (document.URL.includes("list=")) 
			if (!intervalId)
				intervalId = addObserver();
}

function checkContainerAndCreate() {
	let containerToPlace = document.querySelector(`${selectorPlaylist} ${selectorPlaylistButtons}`);
	if (!containerToPlace) {
		console.log('No container to place PauseOnEnd')
		clearInterval(intervalId)
		intervalId = null
	} else
		containerToPlace.appendChild(createPauseOnEndElement())
}

function createPauseOnEndElement(){
	console.log(new Date().toISOString() +' Create PauseOnEnd element on ' + document.URL);
	let div = document.createElement('div');
	div.id = idPauseOnEnd;
	div.style.display = 'flex';
	div.style.alignItems = 'center';
	div.style.marginLeft = '18px';
	div.style.fontSize = '12px';

	let checkboxPauseOnEnd = document.createElement('input');
	checkboxPauseOnEnd.type = "checkbox";
	checkboxPauseOnEnd.id = idcheckboxPauseOnEnd;
	checkboxPauseOnEnd.style.marginTop = '1px';
	// checkboxPauseOnEnd.style.verticalAlign = 'middle';
	checkboxPauseOnEnd.onclick = cbPauseOnEndOnClick;
	readSettings(checkboxPauseOnEnd);

	let span = document.createElement('span');
	span.innerHTML = 'Pause On End';
	span.style.marginLeft = '3px';
	span.style.color = '#767676';

	div.appendChild(checkboxPauseOnEnd);
	div.appendChild(span);
	return div;
}


function readSettings(checkbox) {
	let playlistID = getPlaylistID();
	if (!playlistID) return;

	chrome.storage.local.get([playlistID, idDefaultState], function(data) {
		checkbox.checked = data[playlistID] ?? data[idDefaultState] ?? false;
	});
}

chrome.storage.onChanged.addListener(function(changes, areaName) {
	if (changes[idDefaultState]) {
		let checkboxPauseOnEnd = 
			document.querySelector(`${selectorPlaylist} #${idcheckboxPauseOnEnd}`);

		readSettings(checkboxPauseOnEnd)
	}
})
	

var dontPauseAgain = false;

function addObserver(){

	return setInterval(function() {
		//skip pausing on end if an advertisement is playing
		let isThisAd = document.querySelector('.video-ads')?.childElementCount > 0;
		if (isThisAd) return; 

		//some parts of youtube interface can be hidden, exclude them from the search
		let checkboxPauseOnEnd =
			document.querySelector(`${selectorPlaylist} #${idcheckboxPauseOnEnd}`);
		if (!checkboxPauseOnEnd) {
			checkContainerAndCreate();
			checkboxPauseOnEnd = document.getElementById(idcheckboxPauseOnEnd)
		}

		let video = document.querySelector('video')

		if ((video) && (checkboxPauseOnEnd) && (checkboxPauseOnEnd.checked) ) {
			//pause in 1 second before the end, but at increased playback speed 
			//more than one second of video is played in one real second,
			//therefore we increase the threshold in this case
			let threshold = Math.max(1, video.playbackRate);
			if (video.duration - video.currentTime < threshold) {
				if (!dontPauseAgain) {
					video.pause();
					//Pause on the end of video only one time
					dontPauseAgain = true; //if the user clicks "play", the pause will not occur again
				}
			}
			else
				dontPauseAgain = false; //if the video was rewound, can pause again on the end
		}

	}, 1000)

}


function cbPauseOnEndOnClick(event) {
	let checked = event.target.checked
	let playlistID = getPlaylistID();
	if (!playlistID) return;

	chrome.storage.local.set({ [playlistID]: checked }, function() {
		console.info(`Saved PauseOnEnd = ${checked} on playlist ${playlistID}`);
	});

}

function getPlaylistID() {
	let url = new URL(document.URL)
	return url.searchParams.get("list")
}


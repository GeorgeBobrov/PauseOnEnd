/*global chrome*/
var idPauseOnEnd = 'PauseOnEnd';
var idcheckboxPauseOnEnd = 'cbPauseOnEnd';
var selectorContainerToPlace = '#playlist-actions #top-level-buttons-computed';

// console.log(new Date().toISOString() + ' run PauseOnEnd.js on ' + document.URL);

var observerId;
if (!observerId)
	observerId = addObserver();


function checkContainerAndCreate() {
	let containerToPlace = document.querySelector(selectorContainerToPlace);
	if (!containerToPlace)
		console.log('No container to place PauseOnEnd')
	else
		containerToPlace.appendChild(createPauseOnEndElement())
}

function createPauseOnEndElement(){
	console.log(new Date().toISOString() +' Create PauseOnEnd element on ' + document.URL);
	let div = document.createElement('div');
	div.id = idPauseOnEnd;
	div.style.marginTop = '13px';
	div.style.marginLeft = '20px';
	div.style.fontSize = '12px';

	let checkboxPauseOnEnd = document.createElement('input');
	checkboxPauseOnEnd.type = "checkbox";
	checkboxPauseOnEnd.id = idcheckboxPauseOnEnd;
	checkboxPauseOnEnd.style.margin = '-3px 1px 0px 2px';
	checkboxPauseOnEnd.style.verticalAlign = 'middle';
	checkboxPauseOnEnd.onclick = cbPauseOnEndOnClick;
	readSettings(checkboxPauseOnEnd);

	let span = document.createElement('span');
	span.innerHTML = 'Pause On End';
	span.style.marginLeft = '5px';
	span.style.color = '#767676';

	div.appendChild(checkboxPauseOnEnd);
	div.appendChild(span);
	return div;
}


function readSettings(checkbox) {
	let playlistID = getPlaylistID();
	if (!playlistID) return;

	chrome.storage.local.get([playlistID], function(data) {
		checkbox.checked = data[playlistID] || false;
	});
}

var dontPauseAgain = false;

function addObserver(){

	return setInterval(function() {
		//skip pausing on end if an advertisement is playing
		let isThisAd = document.querySelector('.video-ads')?.childElementCount > 0;
		if (isThisAd) return; 

		//some parts of youtube interface can be hidden, exclude them from the search
		let checkboxPauseOnEnd =
			document.querySelector(`ytd-playlist-panel-renderer:not([hidden]) #${idcheckboxPauseOnEnd}`);
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


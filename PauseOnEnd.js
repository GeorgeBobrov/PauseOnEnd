var idPauseOnEnd = 'PauseOnEnd';
var idcheckboxPauseOnEnd = 'cbPauseOnEnd';
var selectorContainerToPlace = '#playlist-actions #top-level-buttons'

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
	let playlistActionsConteiner = document.querySelector('#playlist-actions')

	if (playlistActionsConteiner) {
		let observer = new MutationObserver(mutationRecords => {
			for (const mutationRecord of mutationRecords) {
				// console.log(mutationRecord.target);
				// if (mutationRecord.removedNodes.length > 0)
				//   console.log(mutationRecord.removedNodes[0].nodeName);
				// for (const removedNode of mutationRecord.removedNodes) 
				// 	console.log(new Date().toISOString() + ' removedNode: ' + removedNode);

				// for (const addedNode of mutationRecord.addedNodes) 
				// 	console.log(new Date().toISOString() + ' addedNode: ' + addedNode);

				if ((mutationRecord.type == "childList") &&
					(mutationRecord.removedNodes.length > 0) && 
					(mutationRecord.removedNodes[0].id == idPauseOnEnd))
					{
						console.log(new Date().toISOString() + ' mutation: PauseOnEnd deleted ');
						checkContainerAndCreate();
					}
			}
		});

		observer.observe(playlistActionsConteiner, {
			childList: true, 
			subtree: true,
			characterData: false
		}); 
	}

	return setInterval(function() {
		//some parts of youtube interface can be hidden, exclude them from the search
		let checkboxPauseOnEnd = 
			document.querySelector(`ytd-playlist-panel-renderer:not([hidden]) #${idcheckboxPauseOnEnd}`);
		if (!checkboxPauseOnEnd) {
			checkContainerAndCreate();
			checkboxPauseOnEnd = document.getElementById(idcheckboxPauseOnEnd)
		} 
			
		let video = document.querySelector('video')

		if ((video) && (checkboxPauseOnEnd) && (checkboxPauseOnEnd.checked) ) {
			if (video.duration - video.currentTime < video.playbackRate) {
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


var idPauseOnEnd = 'PauseOnEnd';
var idcheckboxPauseOnEnd = 'cbPauseOnEnd';
var selectorContainerToPlace = '#playlist-actions #top-level-buttons'

addObserver();


function checkAndCreate() {
  var containerToPlace = document.querySelector(selectorContainerToPlace);  
  if (! containerToPlace) 
    console.log('No container to place PauseOnEnd')
  else { 
    var alreadyCreated = document.getElementById(idPauseOnEnd);
    if (! alreadyCreated) {
      containerToPlace.appendChild(createCheckboxElement())
    }
  }  
}

function createCheckboxElement(){
  console.log('Create PauseOnEnd element on ' + document.URL); 
  var div = document.createElement('div'); 
  div.id = idPauseOnEnd;
  div.style.marginTop = '13px';
  div.style.marginLeft = '20px';
  div.style.fontSize = '12px';

  var checkboxPauseOnEnd = document.createElement('input');
  checkboxPauseOnEnd.type = "checkbox";  
  checkboxPauseOnEnd.id = idcheckboxPauseOnEnd;
  checkboxPauseOnEnd.style.margin = '-3px 1px 0px 2px';
  checkboxPauseOnEnd.style.verticalAlign = 'middle';
  checkboxPauseOnEnd.onclick = cbPauseOnEndOnClick;
  readSettings(checkboxPauseOnEnd);

  var span = document.createElement('span');  
  span.innerHTML = 'Pause On End';
  span.style.marginLeft = '5px';
  span.style.color = '#767676';

  div.appendChild(checkboxPauseOnEnd);
  div.appendChild(span);
  return div;
}
   

function readSettings(checkbox) {
  chrome.storage.local.get([idPauseOnEnd], function(data) {
    checkbox.checked = data[idPauseOnEnd];
  });
}

var dontPauseAgain = false; 

function addObserver(){

  setInterval(function() {
    let checkboxPauseOnEnd = document.getElementById(idcheckboxPauseOnEnd)
    if (! checkboxPauseOnEnd) 
      checkAndCreate();
      
    checkboxPauseOnEnd = document.getElementById(idcheckboxPauseOnEnd)
    let videos = document.querySelectorAll('video')

    if ((videos.length > 0) && (checkboxPauseOnEnd) && (checkboxPauseOnEnd.checked) ) {
      if (videos[0].duration - videos[0].currentTime < 1) {
        if (! dontPauseAgain) { 
          videos[0].pause();
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

  chrome.storage.local.set({ [idPauseOnEnd]: checked }, function() {
    console.info("Saved PauseOnEnd " + checked);
  });  
}

// Added to fix issue: Youtube hides the video publication date if it doesn't have enough space.
// This code allows you to show the video publication date (if it is hidden) 
// under the number of views. 
function showDateOnYoutube() {
	var selectorsVideoInfo = [
		"#info-text.ytd-video-primary-info-renderer",
		"ytd-video-primary-info-renderer[has-date-text_] #info-text.ytd-video-primary-info-renderer"
	];

	for (const selectorVideoInfo of selectorsVideoInfo) {
		var videoInfo = document.querySelector(selectorVideoInfo);
		if (videoInfo)
			videoInfo.style.maxHeight = "unset";
	}
}
    
showDateOnYoutube();

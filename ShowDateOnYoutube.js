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
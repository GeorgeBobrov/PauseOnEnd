// Added to fix issue: Youtube hides the video publication date if it doesn't have enough space.
// This code allows you to show the video publication date (if it is hidden) 
// under the number of views. 
document.querySelector("#info-text.ytd-video-primary-info-renderer").style.maxHeight = "unset"
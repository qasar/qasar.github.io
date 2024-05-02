var imgCount = 0;   
var totalImgs = imageGallery.length -1;   
function preloadImages() {
  for (var i = 0; i < imageGallery.length; i++) {
    img1 = new Image();
    img1.src = imagePrefix + imageGallery[i];
    imageCounts[imageGallery[i]] = 0;
  }
}
    
  
function next(previous, update) {
  if (!update) {
    if (previous){
      imgCount--;   
      if(imgCount < 0) imgCount = totalImgs ;   
    } else {
      if(imgCount == totalImgs){    
        imgCount = 0;   
      }  else {   
        imgCount++;   
      }
    }
  }
  document.getElementById("gallery").src = imagePrefix + imageGallery[imgCount];   
  document.getElementById("imageText").innerHTML = imageText[imgCount];
  document.getElementById("locationsText").innerHTML = locations[imgCount];	
  document.getElementById('currentImage').innerHTML = imgCount + 1
  document.getElementById('clapIcon').setAttribute("photo_id", imageGallery[imgCount]);
  document.getElementById('clapCount').innerHTML = imageCounts[imageGallery[imgCount]];



  
}   
 
    
document.addEventListener("keydown", function(e){   
  console.log(e.keyCode)    
  if (e.keyCode == 37) {    
    next(true)    
  } else if (e.keyCode == 39) {   
    next()    
  }   
});   
  
function handlePhotoClick(event, img) {
        var posX = event.offsetX?(event.offsetX):event.pageX-img.offsetLeft;
        var posY = event.offsetY?(event.offsetY):event.pageY-img.offsetTop;
        if (posX > img.width / 2) {
          next()
        } else {
          next(true)
        }
}



document.getElementById('currentImage').innerHTML = imgCount + 1
document.getElementById('totalImages').innerHTML = imageGallery.length
preloadImages()
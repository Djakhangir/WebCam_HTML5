const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d'); //context is where the work happen, no clew? learn canvas
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap'); //this is our audio tag

//to get the video webcam work
function getVideo(){
    // mediaDevices.getUserMedia() are the webAPI property which allows us to use media input mediastream and returns as a promises
navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        console.log(localMediaStream);
        video.srcObject = localMediaStream; //localMediaStream is an object and it doesnt work automatically, 
        //and we have to convert it to url, and finally we play it;
        video.play();
    })
    .catch(err=>{ // we catch any error to handle that error
        console.error('OH NO!!!', err);
    })
}

//below we are taking the actual video frame from the streaming video of the cam and put into the canvas to manipulate
    function paintToCanvas() {
        const width = video.videoWidth;
        const height = video.videoHeight;
        //console.log(width, height); in order to know what sizes are our webcam streaming, 
        canvas.width = width;                                            //because the canvas has to be the same sizes;
        canvas.height = height;

//take everythy some seconds take the shot and put it into canvas;
return setInterval(() => {      //return is a helper to stop that process if we need to
    ctx.drawImage(video, 0, 0, width, height); //context will draw the image of the video starting the left corner
                                                                         // and paint the width and height;
    let pixels = ctx.getImageData(0, 0, width, height);     //takes the pixels out                            
                                                    //Mess with the color red channel in this case
//pixels = greenScreen(pixels);

//pixels = rgbSplit(pixels);
            // it is going to take the original video and make it transparent in order to stack the rgb in 10 more frames 
//ctx.globalAlpha = 0.6;              // making it ghosting; as high number as faster the changed pixels follows
pixels = redEffect(pixels);                 //            red  px 
    ctx.putImageData(pixels, 0, 0);                         // put the pixels back into canvas
    }, 16);    // set the seconds                                 
}
//function to take photo and play sound as well as download link
function takePhoto(){
    snap.currentTime = 0;   //to Play the sound
    snap.play();
 
// take data out of the canvas
const data = canvas.toDataURL('image/jpeg'); //data becomes the text based representation of the image (log it to see);
// to create the link anchor tag
const link = document.createElement('a');
//set the href to data 
link.href = data;
//setAttribute to the link meaning set the value on specific element. if exist will be updated
link.setAttribute('download', 'handsome'); //downloads and name the file as handsome
//inputted the text content to return the text content of all elements 
            //link.textContent = 'Download Image'; //name of the link for the download; but we use innerhtml to bring that to the DOM

link.innerHTML = `<img src="${data}" alt = "Handsome Man" />`;
//inserts node as the child right before the existing child - node is any html element
strip.insertBefore(link, strip.firstChild) //the same as strip.prepend in js is .firstChild in Vanilla js

}

//To put the filters of cam for a photoshoot- the way it works: it takes the px out of the canvas and 
                                                    //manipulate them changing the RGB values and put them back in
function redEffect(pixels) {
for( let i = 0; i < pixels.data.length; i += 4) { //to increment while looping not by 1 but by 4;
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // Red channel;
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //Green channel;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //Blue channel;
};
 //once we hvae done with the px color channels we can return it
            return pixels;
}

//this function takes out the pixels aside and when we work with them we see the differences on them
function rgbSplit(pixels){
    for( let i = 0; i < pixels.data.length; i += 4) { 
        pixels.data[i - 250] = pixels.data[i + 0]; // R
        pixels.data[i + 500] = pixels.data[i + 1]; //G
        pixels.data[i - 550] = pixels.data[i + 2]; //B
    };
    return pixels;
}

//take the min and max we define and take the rest pixel color out so the user doesn't see them
function greenScreen(pixels){
    const levels = {}; //empty object levels
                            // took all the sliders in rgb tag and set them as min and max
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
                                // we loop over every single pixels and found out the values of each of them
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
                                // if any of the r g b is in between min and max -
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
                                            // we take it out! Because 4th px is alpha whih transparency px,
                                            //since it is 0 it is going to be transparent
        pixels.data[i + 3] = 0;
      }
}
return pixels;
}

getVideo();

//adding the event, once that video tag is played it is going to emit the event canplay and tell to  
//function the paintToCanvas to start now

video.addEventListener('canplay', paintToCanvas);
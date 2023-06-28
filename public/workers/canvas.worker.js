/*
*  canvas.worker.js
*/

this.onmessage = async function(e){
	// console.log(e.data)
	switch(e.data.command){
        case 'clear':
            if(this.canvas){
                this.canvas.getContext('2d').clearRect(0, 0,this.canvas.width, this.canvas.height)
                this.img = null
                this.canvas = null
            }
            break;
        case 'update':
			update(e.data.boundingBox,e.data.hue);
		    break;
		case 'depth':
            if(!this.canvas){
                this.canvas = e.data.canvas;
                this.canvas.width = e.data.boundingBox.cw;
                this.canvas.height = e.data.boundingBox.ch;
                this.ctx = this.canvas.getContext("2d",{
                    desynchronized:true,
                    // willReadFrequently:true
                });
            }
			this.img = exportDepth(e.data);
		    break;
        case 'export_image':
            self.postMessage(e.data);
            break;
        default:
            break;
    }
}
this.canvas = null
this.img = null

const fps = 10
var alpha = 0.5
var width = 256
var height = 256
var canvas_off = null
var ctx_off = null
this.ctx = null
// const clock = new Clock()
var shouldRender = true
var counter = 0
var requestAnimationId = null
var animate = true
var box = {x:0,y:0,w:width,h:height,cw:width,ch:height}

async function exportDepth(data){
    // console.log(data)
	// switch(data.command){
    const imageUrl = data.imageURL;
    const response = await fetch(imageUrl)
    const imgBlob = await response.blob()
    img = await createImageBitmap(imgBlob)
    // box = data.boundingBox
    
    return(img)
    // console.log(img)
    // Set canvas dimensions
    
    // update(box)
};

function getImageData(){
    this.ctx.save()
    this.ctx.clearRect(0, 0, b.cw, b.ch)
    
    this.ctx.drawImage(this.img, b.x, b.y, b.w, b.h);
    var imgData = this.ctx.getImageData(b.x, b.y, b.w, b.h);
    var d = imgData.data;
    for (var i = 0; i < d.length; i += 4) {
        var sum = Math.ceil(Math.floor(d[i])+ Math.floor(d[i+1]) + Math.floor(d[i+2]));
        d[i+3] = sum
    }

    return(imgData)
}

function update(b,hue){
    if(this.canvas == null) return
    
    this.ctx.save()
    this.ctx.clearRect(0, 0, b.cw, b.ch)
    
    this.ctx.drawImage(this.img, b.x, b.y, b.w, b.h);
    this.ctx.globalCompositeOperation="color-burn";
    this.ctx.fillStyle='hwb('+hue+'deg 0% 0%)';
    // this.ctx.fillStyle='#f00';
    this.ctx.fillRect(b.x, b.y, b.w, b.h);
    
    var imgData = this.ctx.getImageData(b.x, b.y, b.w, b.h);
    var d = imgData.data;
    for (var i = 0; i < d.length; i += 4) {
        var sum = Math.ceil(Math.floor(d[i])+ Math.floor(d[i+1]) + Math.floor(d[i+2]));
        // var sum = (d[i]+ d[i+1] + d[i+2]);
        d[i+3] = (sum+sum)
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.putImageData(imgData, b.x, b.y);
    this.ctx.globalCompositeOperation="source-out";
    this.ctx.fillStyle=`#0F0`;
    this.ctx.fillRect(b.x+2, b.y+2, b.w-4, b.h-4);

    this.ctx.restore()

}

function draw(time) {
    if(shouldRender == false) return
    // Perform some drawing using the gl context
    ctx_off.drawImage(this.img, 0, 0, width, height);
    ctx_off.fillStyle=`rgba(0,0,0,${alpha})`;
    ctx_off.fillRect(0, 0, width, height);
    
    canvas_off[canvas_off.convertToBlob ? 'convertToBlob' : 'toBlob']()
    .then(blob => {
        const dataURL = new FileReaderSync().readAsDataURL(blob);
        alpha+=0.01
        counter -= 1
        // self.postMessage(dataURL);
        this.postMessage({"command":"export_image", "image":dataURL})
        
        requestAnimationFrame(render)
    });
    if(alpha >= 1.0) shouldRender = false
}



function render(time) {
    
    draw(time)
    // clock.start()
    requestAnimationFrame(render)

}

class Clock {
    constructor(autoStart = true) {
        this.autoStart = autoStart;
        this.startTime = 0;
        this.oldTime = 0;
        this.elapsedTime = 0;
        this.running = false;
    }

    start() {
        this.startTime = now();
        this.oldTime = this.startTime;
        this.elapsedTime = 0;
        this.running = true;
    }

    stop() {
        this.getElapsedTime();
        this.running = false;
        this.autoStart = false;
    }

    getElapsedTime() {
        this.getDelta();
        return this.elapsedTime;
    }

    getDelta() {
        let diff = 0;

        if (this.autoStart && !this.running) {
            this.start();
            return 0;
        }

        if (this.running) {
            const newTime = now();
            diff = (newTime - this.oldTime) / 1000;
            this.oldTime = newTime;
            this.elapsedTime += diff;
        }

        return diff;
    }

}

function now() {
    return Date.now();
}


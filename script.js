    let port;
    let toggle = false;
    let score = 0; 
    let scoreboard = document.getElementById("scoreboard")
    let star1 = document.getElementById("star-five")
    let star2 =document.getElementById("star2-five")
    star2.style.left = '10%'
    star2.style.top = '50%'

var audio = new Audio('summer.mp3')

  function elementsOverlap(el1, el2) {
  const domRect1 = el1.getBoundingClientRect();
  const domRect2 = el2.getBoundingClientRect();

  if(
    domRect1.top > domRect2.bottom ||
    domRect1.right < domRect2.left ||
    domRect1.bottom < domRect2.top ||
    domRect1.left > domRect2.right
  ){
    //console.log("no collision")
  }
    else{
      score++
      scoreboard.innerHTML = `Score:${score}`
      let randomX = Math.floor(Math.random()*100)
      let randomY = Math.floor(Math.random()*100)
      star2.style.left = randomX + "%"
      star2.style.top = randomY + "%"
    
    }
}

setInterval(function(){elementsOverlap(star1,star2)},50)

    async function connect() {
        //console.log('connect called');
        port = await navigator.serial.requestPort();
        await port.open({
            baudRate: 9600
        })

        let decoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(decoder.writable)

        //const inputStream = decoder.readable;

        const reader = decoder.readable
        .pipeThrough(new TransformStream(new LineBreakTransformer()))
        .getReader()
        await readLoop(reader);

    }

    async function readLoop(reader) {
        while (true) {
            const { value, done } = await reader.read();
            if (value) {
                if(!isNaN(parseInt(value))) {
                  moveCircle(value)
                  //displayReading(value)
                }
            }
            if (done) {
                console.log('[readLoop] DONE', done);
                reader.releaseLock();
                break;
            }
        }
    }

 let dynamicX =50; 
 let dynamicY =50; 

  function moveCircle(valueIn){
    audio.play()
    arrayVals = valueIn.split(",")
    //console.log(arrayVals)
    let xVal = parseInt(arrayVals[0]); 
    let yVal = parseInt(arrayVals[1]);

    let xScaled = (xVal*100)/1022
    let yScaled = (yVal*100)/1022

    
    let aStar = document.getElementById('star-five')

   

    if(xScaled>55 || xScaled<45){
      if(xScaled>55){
        if(dynamicX<100){
          dynamicX+=4;
        }
      }
      if(xScaled<45){
        if(dynamicX>0){
          dynamicX-=4;
        }
      }
    }

    
    if(yScaled>55 || yScaled<45){
      if(yScaled>55){
        if(dynamicY<100){
          dynamicY+=4;
        }
      }
      if(yScaled<45){
        if(dynamicY>0){
          dynamicY-=4;
        }
      }
    }

    aStar.style.left = dynamicX + "%"
    aStar.style.top = dynamicY + "%"
    

    //console.log(aCircle)
   
  }

function displayReading(valueIn){
  let display = document.getElementById('reading')
  display.innerHTML = valueIn
}

    class LineBreakTransformer {
        constructor() {
            // A container for holding stream data until a new line.
            this.chunks = "";
        }

        transform(chunk, controller) {
            // Append new chunks to existing chunks.
            this.chunks += chunk;
            // For each line breaks in chunks, send the parsed lines out.
            const lines = this.chunks.split("\r\n");
            this.chunks = lines.pop();
            lines.forEach((line) => controller.enqueue(line));
        }

        flush(controller) {
            // When the stream is closed, flush any remaining chunks out.
            controller.enqueue(this.chunks);
        }
    }
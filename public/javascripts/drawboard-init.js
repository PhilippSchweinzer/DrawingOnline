//Globale Variable zur Speicherung einer DrawBoard Referenz
/** @type {DrawBoard} */
var drawboard;
var prevMouse = undefined;
var currMouse;





/**
 * Executed on the body onload. Sets the drawboard variable and adds
 * the "mousedown"-listener to the canvas to start the drawing process.
 */
function init() {
    drawboard = new DrawBoard(1000,1000, document.getElementById('draw_canvas'));
    drawboard.canvas.addEventListener("mousedown", startDrawAbility);
    console.log(drawboard);
    startOfflineHandler();
}


/**
 * Start the handling of going "offline" or "online" with the help of
 * the Offline.js library. 
 * Options are configured.
 */
function startOfflineHandler() {
    Offline.options = {
        // to check the connection status immediatly on page load.
        checkOnLoad: false,
    
        // to monitor AJAX requests to check connection.
        interceptRequests: true,
    
        // to automatically retest periodically when the connection is down (set to false to disable).
        reconnect: {
            // delay time in seconds to wait before rechecking.
            initialDelay: 3,
    
            // wait time in seconds between retries.
            delay: 8
        },
    
        // to store and attempt to remake requests which failed while the connection was down.
        requests: true
    };
}



/**
 * Stops the drawing process. Removes the "mousemove"-listener and sets the
 * prevMouse to undefined.
 * @param {*} event Event
 */
function removeDrawAbility(event) {
    //Remove Mouse-Movement-Listener
    drawboard.canvas.removeEventListener("mousemove", onMouseMove);
    //Remove the Listener that checks if the mouse leaves the Canvas
    drawboard.canvas.removeEventListener("mouseout", onMouseOut);
    //Set prevMouse to undefined so new line is handled appropiatly
    prevMouse = undefined;
    console.log(" listener removed");
}


/**
 * Starts the drawing process. Sets the "mousemove"-listener to 
 * the canvas and the "mouseup"-listener to the document.
 * @param {*} event Event
 */
function startDrawAbility(event) {
    console.log("mousedown: listener added");
    //Set Mouse-Movement-Listener
    drawboard.canvas.addEventListener("mousemove", onMouseMove);

    //Wenn Maus irgendwo ausgelassen wird -> malen stoppen
    document.addEventListener("mouseup", removeDrawAbility);

    //Wenn Maus den Canvas verlässt -> preMouse auf undefined setzen um neue Linie anzufangen
    drawboard.canvas.addEventListener("mouseout", onMouseOut);
}

function onMouseOut(event) {
    prevMouse = undefined;
}

/**
 * Executed when mouse is moved. Used as Listener
 * @param {*} event Event
 */
function onMouseMove(event) {

    //If new line was started
    if(typeof prevMouse == "undefined") {
        prevMouse = getMousePos(event);
    } else {    // if currently in line
        prevMouse = currMouse;
    }
    
    //update Mouse position
    currMouse = getMousePos(event);
    
    //Draw line
    drawboard.context.moveTo(prevMouse.x, prevMouse.y);
    drawboard.context.lineTo(currMouse.x, currMouse.y);
    drawboard.context.stroke();
}

/**
 * Return the current mouse position in the canvas
 * @param {*} event Event
 */
function getMousePos(event) {
    var rect = drawboard.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}



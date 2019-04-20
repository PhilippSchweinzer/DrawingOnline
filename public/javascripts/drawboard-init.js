//Globale Variable zur Speicherung einer DrawBoard Referenz
/** @type {DrawBoard} */
var drawboard;
//the mouse position from the last time the mouse was moved.
var prevMouse = undefined;
//the current mouse position
var currMouse;
//The mouse position from the last frame
var lastCurrMouse;
//Boolean = true if mouse is currently down, false if up
var mouseDown;
//stores the wanted line width
var lineWidth;





/**
 * Executed on the body onload. Sets the drawboard variable and adds
 * the "mousedown"-listener to the canvas to start the drawing process.
 */
function init() {
    drawboard = new DrawBoard(500,500, document.getElementById('draw_canvas'));
    //Set lineCap to round to draw the lines with a round ending
    drawboard.context.lineCap = "round";
    //Add the "mousedown" listener
    drawboard.canvas.addEventListener("mousedown", startDrawAbility);
    //log the drawboard
    console.log(drawboard);
    startOfflineHandler();
    //Execute updateCanvas x-time in a second.
    setInterval(updateCanvas, 3);
    //Execute the function once to display the number onload
    strokeSliderChanged()
}

/**
 * Draws the lines according to the variables set in the listener functions
 */
function updateCanvas() {
    if(mouseDown && currMouse != lastCurrMouse) {

        if(typeof prevMouse == "undefined") {
            prevMouse = currMouse;
        }

        //Draw line
        drawboard.context.beginPath();
        drawboard.context.moveTo(prevMouse.x, prevMouse.y);
        drawboard.context.lineTo(currMouse.x, currMouse.y);
        drawboard.context.stroke();
    }
    
    //Sets the lastCurrMouse to the currMouse at the end of the frame calculation
    lastCurrMouse = currMouse;
}



/**
 * Executed when the stroke range-slider changes
 * Updates the lineWidth and also displays the value in DOM
 */
function strokeSliderChanged() {
    lineWidth = document.getElementById("strokeslider").value;
    document.getElementById("strokeoutput").innerHTML = lineWidth;
    drawboard.context.lineWidth = lineWidth;
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
    //Mouse is now up -> mouseDown = false
    mouseDown = false;
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
    //Mouse is now down -> mouseDown = true
    mouseDown = true;
    console.log("mousedown: listener added");
    //Set Mouse-Movement-Listener
    drawboard.canvas.addEventListener("mousemove", onMouseMove);

    //Wenn Maus irgendwo ausgelassen wird -> malen stoppen
    document.addEventListener("mouseup", removeDrawAbility);

    //Wenn Maus den Canvas verlässt -> preMouse auf undefined setzen um neue Linie anzufangen
    drawboard.canvas.addEventListener("mouseout", onMouseOut);
}

function onMouseOut(event) {
    event.preventDefault();
    event.stopPropagation();
    prevMouse = undefined;
}

/**
 * Executed when mouse is moved. Used as Listener
 * @param {*} event Event
 */
function onMouseMove(event) {
    event.preventDefault();
    event.stopPropagation();

    //If new line was started
    if(typeof prevMouse == "undefined") {
        prevMouse = getMousePos(event);
    } else {    // if currently in line
        prevMouse = currMouse;
    }
    
    //update Mouse position
    currMouse = getMousePos(event);
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



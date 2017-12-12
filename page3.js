//variables for controlling the triangles
let tri = "tri.svg";
let hex = "hex.svg";
let square = "square.svg";
let triNum = 10;
let triHeight = 72;
let triWidth = 44;
let avoidDistance = 100;
let sWidth = 0;
let sHeight = 0;
let objNum = -1;

//create arrays for stores the triangle data
let triArr;
let triPosArr = new Array(triNum);
let triVelArr = new Array(triNum);
let triAccArr = new Array(triNum);

//variables for fine-tuning forces
let maxSpeed = 20;
let maxForce = 1;
let mass = 1;

//variables for mouse interaction
let mousePos = new Victor(0, 0);
let lastMousePos = new Victor(0, 0);
let IsMouseSame = false;
let CanMove = true;
let stopTris;
//let currMouse;
let holding;
let IsHolding = false;
let initMousePos = new Victor(0,0);
let finalMousePos = new Victor(0,0);


GetScreenDimentions();
InstantiateObjects();

//sets the refresh rate / starts the update method
let updateInterval = setInterval(Update, 33);
//Seek(new Victor(100,100), triPosArr[0]); //test calculations

//method for getting the screen resolution
function GetScreenDimentions(){
    sWidth = window.innerWidth;
    sHeight = window.innerHeight;

    //console.log("W: " + sWidth + " H: " + sHeight);
}

//method for creating the triangles and setting default values
function InstantiateObjects(){

    for(let i = 0; i < triNum; i++){
        objNum++;
        let newTri = document.createElement('img');
        let randSrc = Math.random();
        if (randSrc < .33){
            newTri.src = tri;
        }
        else if (randSrc > .66){
            newTri.src = square;
        }
        else{
            newTri.src = hex;
        }
        //newTri.src = tri;
        newTri.alt = "object" + objNum;
        //triArr[i] = newTri;
        document.body.appendChild(newTri);
    }
    
    triArr = document.querySelectorAll("img");
    //console.log(triArr);

    for(let i = 0; i < triNum; i++){
        triArr[i].style.position = 'absolute';
        let newTop = 0 - triHeight / 2;
        let newLeft = 0 - triWidth / 2;
        triArr[i].style.top = "" + newTop + "px";
        triArr[i].style.left = "" + newLeft + "px";
        triArr[i].style.transformOrigin = "0% 0%";
        triArr[i].draggable = false;
    }

    for (let i = 0; i < triNum; i++){
        triAccArr[i] = new Victor(0, 0);
        triVelArr[i] = new Victor(0, 0);
        triPosArr[i] = new Victor(50 * i, 50 * i);
    }

    //console.log(triPosArr[0]);

}

//Code for tracking mouse: https://stackoverflow.com/questions/7790725/javascript-track-mouse-position
function FollowMouse(){
    var dot, eventDoc, doc, body, pageX, pageY;
    
    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    //console.log("mX: " + event.pageX + " mY: " + event.pageY);
    mousePos = new Victor(event.pageX, event.pageY);
    //console.log("mX:" + mousePos.x + " mY:" + mousePos.y);
}

//method for AI following
function Seek(target, currTri){
    let currtarget = new Victor(target.x, target.y);

    let desiredVelocity = currtarget.subtract(currTri);
    desiredVelocity.normalize();
    desiredVelocity.limit(0, maxForce);
    //console.log("scaled: " + desiredVelocity.length());
    return desiredVelocity;
}

//method for AI avoidance
function Flee(target, currTri){
    let currtarget = new Victor(currTri.x, currTri.y);

    let desiredVelocity = currtarget.subtract(target);
    desiredVelocity.normalize();
    desiredVelocity.limit(0, maxForce);
    //console.log("scaled: " + desiredVelocity.length());
    return desiredVelocity;
}

//method for determining overall force acting on the triangles
function CalcSteeringForces(){
    //console.log("in csf");
    var currMouse = mousePos;
    //console.log(currMouse.x + " : " + currMouse.y);
    //console.log("Number: " + i + " Target: [" + currMouse.x + ", " + currMouse.y + "]");
    for (let i = 0; i < triNum; i++){
        let ultimate = new Victor(0, 0);
        
        ultimate.limit(maxForce, maxForce);
        triAccArr[i].add(ultimate);
    }
    
}

//method for updating the transform of the triangles on the screen
function UpdatePosition () {
    for(let i = 0; i < triNum; i++){
        if (holding == null){
            //console.log("currently updating: " + i);
            let position = new Victor(triPosArr[i].x, triPosArr[i].y);
            triVelArr[i].add(triAccArr[i]);
            let velMag = triVelArr[i].magnitude();
            
            if (velMag > maxSpeed){
                triVelArr[i].normalize();
                triVelArr[i].limit(0, maxSpeed);
            }
            
            position.add(triVelArr[i]);
            triAccArr[i] = new Victor(0, 0);
        
            //console.log(triVelArr[i].length());
            let direction = triVelArr[i].horizontalAngleDeg() + 90;
            //console.log(direction);
        
            let newPos = new Victor(position.x + triPosArr[i].x, position.y + triPosArr[i].y);
            triArr[i].style.top = position.y + "px";
            triArr[i].style.left = position.x + "px";
            triArr[i].style.transform = "rotate(" + direction + "deg)";
            //triArr[i].transform({rotation: direction});
            
        
            triPosArr[i] = position;
        }
        else if (triArr[i].alt != holding.alt){
            //console.log("currently updating: " + i);
            let position = new Victor(triPosArr[i].x, triPosArr[i].y);
            triVelArr[i].add(triAccArr[i]);
            let velMag = triVelArr[i].magnitude();
            
            if (velMag > maxSpeed){
                triVelArr[i].normalize();
                triVelArr[i].limit(0, maxSpeed);
            }
            
            position.add(triVelArr[i]);
            triAccArr[i] = new Victor(0, 0);
        
            //console.log(triVelArr[i].length());
            let direction = triVelArr[i].horizontalAngleDeg() + 90;
            //console.log(direction);
        
            let newPos = new Victor(position.x + triPosArr[i].x, position.y + triPosArr[i].y);
            triArr[i].style.top = position.y + "px";
            triArr[i].style.left = position.x + "px";
            triArr[i].style.transform = "rotate(" + direction + "deg)";
            //triArr[i].transform({rotation: direction});
            
        
            triPosArr[i] = position;
        }
        
    }
    
}

//sets function for tracking mouse to the onmousemove event
document.onmousemove = FollowMouse;

//checks which object was clicked by the user
document.addEventListener('mousedown', function(e) {
    //console.log(!holding);
    if (!holding){
        e = e || window.event;
        holding = e.holding || e.srcElement;
        //console.log("pressed: " + holding.alt);
        if (holding.alt.includes('object')){
            IsHolding = true;
            initMousePos = new Victor(mousePos.x, mousePos.y);
            //console.log("start: {" + initMousePos.x + "," + initMousePos.y + "}");
            //console.log(holding.alt);
        }
        else {
            //console.log("undef");
        }
    }
    
}, false);

//when the user unclicks, a force is applied to the object being dragged
document.addEventListener('mouseup', function() {
    if (IsHolding){
        finalMousePos = new Victor(mousePos.x, mousePos.y);
        //console.log("final: {" + finalMousePos.x + "," + finalMousePos.y + "}");
        let newForce = new Victor((finalMousePos.x - initMousePos.x), (finalMousePos.y - initMousePos.y));
        ApplyForce(holding.alt, newForce);
        IsHolding = false;
        holding = null;
    }
    
})

//method called ~30 times per second | "main loop"
function Update(){
    if (lastMousePos == mousePos){
        IsMouseSame = true;
    }
    else{
        IsMouseSame = false;
        CanMove = true;
    }

    if (CanMove){
        CalcSteeringForces();
        UpdatePosition();
    }
    Bounce();
    MoveHolding();
    
    lastMousePos = mousePos;
}

//applies a force to an object
function ApplyForce(objAlt, force){
    for (let i = 0; i < triArr.length; i++){
        if (triArr[i].alt == objAlt){
            triAccArr[i].add(force);
            break;
        }
    }
}

//clicked object is dragged around the screen
function MoveHolding(){
    
    if (IsHolding){
        
        for (let i = 0; i < triArr.length; i++){
            if (holding != null){
                if (triArr[i].alt == holding.alt){
                    //triPosArr[i] = new Victor(mousePos.x, mousePos.y);
                    //console.log("in moveholding");
                    let h = 72;
                    let w = 72;
                    if (holding.src == "tri.svg"){
                        w = triWidth;
                        h = triHeight;
                    }
                    let newPos = new Victor(mousePos.x + w / 2, mousePos.y - h / 2);
                    triArr[i].style.top = newPos.y + "px";
                    triArr[i].style.left = newPos.x + "px";
                    //triArr[i].style.transform = "rotate(" + direction + "deg)";
                    //triArr[i].transform({rotation: direction});
                    
                
                    triPosArr[i] = newPos;
                    break;
                }
            }
            
        }
    }
}

//method for bouncing objects off walls, for some reason the objects just stick to walls instead
function Bounce(){
    for (let i = 0; i < triArr.length; i++){
        if (triPosArr[i].x > sWidth || triPosArr[i].x < 72 || triPosArr[i].y > sHeight - 72 || triPosArr[i].y < 0){
            //console.log("bouncing " + triArr[i].alt);
            triVelArr[i] = (new Victor(-triVelArr.x, -triVelArr.y));
        }
    }
}

//method for keeping triangles away from each other
function Separation(currTri){
    let result = new Victor(0, 0);
    //for (let i = 0; i < triNum; i++){
        for (let j = 0; j < triNum; j++){
            if (currTri != triPosArr[j]){
                if (currTri.distanceSq(triPosArr[j]) < avoidDistance * avoidDistance){
                    result.add(Flee(triPosArr[j], currTri));
                }
            }
        }
    //}

    return result;
}

function Pause(){
    CanMove = false;
    window.clearInterval(stopTris);
}
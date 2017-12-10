//variables for controlling the triangles
let tri = "tri.svg";
let triNum = 0;
let triHeight = 72;
let triWidth = 44;
let avoidDistance = 100;
let sWidth = 0;
let sHeight = 0;

let tagNum = -1;

//create arrays for stores the triangle data
let triArr = new Array(0);
let triPosArr = new Array(0);
let triVelArr = new Array(0);
let triAccArr = new Array(0);

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


GetScreenDimentions();
document.onmousedown = InstantiateTris;

//sets the refresh rate / starts the update method
let updateInterval = setInterval(Update, 33);
//Seek(new Victor(100,100), triPosArr[0]); //test calculations

//method for getting the screen resolution
function GetScreenDimentions(){
    sWidth = window.innerWidth;
    sHeight = window.innerHeight;

    console.log("W: " + sWidth + " H: " + sHeight);
}

//method for creating the triangles and setting default values
function InstantiateTris(){
    tagNum++;
    let classNm = "tri" + tagNum;

    //for(let i = 0; i < triNum; i++){
        let newTri = document.createElement('img');
        newTri.src = tri;
        newTri.alt = "tri";
        newTri.className = classNm;
        //triArr[i] = newTri;
        document.body.appendChild(newTri);
    //}
    
    //triArr = document.querySelectorAll("img");
    let pushNm = "." + classNm;
    triArr.push(document.querySelector(pushNm));
    
    console.log(triArr);

    //for(let i = 0; i < triNum; i++){
        triArr[tagNum].style.position = 'absolute';
        let newTop = 0 - triHeight / 2;
        let newLeft = 0 - triWidth / 2;
        triArr[tagNum].style.top = "" + newTop + "px";
        triArr[tagNum].style.left = "" + newLeft + "px";
        triArr[tagNum].style.transformOrigin = "0% 0%";
    //}

    /*triAccArr = new Array(triArr.length);
    triPosArr = new Array(triArr.length);
    triVelArr = new Array(triArr.length);*/

    //for (let i = 0; i < triNum; i++){
        
        triAccArr.push(new Victor(0, 0));
        triVelArr.push(new Victor(0, 0));
        triPosArr.push(new Victor(mousePos.x, mousePos.y));

        console.log(triArr);
        console.log(triAccArr);
        console.log(triVelArr);
        console.log(triPosArr);

        triNum = triArr.length;
    //}

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
    /*CalcSteeringForces();
    UpdatePosition();*/
}

//method for AI following
function Seek(target, currTri){
    /*
        Vector3 desiredVelocity = targetPos - position;
		desiredVelocity.Normalize ();
		desiredVelocity = desiredVelocity * maxSpeed;

        return (desiredVelocity - velocity);
    */
    /*console.log("tX: " + target.x);
    console.log("cX: " + currTri.x);*/
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
    /*
    Vector3 ultimate = Vector3.zero;
		//ultimate += Wander ();
		//ultimate += JAvoid ();
		if (IsFollower){
			ultimate += FollowPath ();
		}
		if (IsFlowFollower){
			ultimate += FollowFlowField ();
		}
		ultimate = Vector3.ClampMagnitude (ultimate, maxForce);
		//ultimate += NoOOB ();
		acceleration += ultimate;
        acceleration.y = 0;
    */
    //console.log("in csf");
    var currMouse = mousePos;
    //console.log(currMouse.x + " : " + currMouse.y);
    //console.log("Number: " + i + " Target: [" + currMouse.x + ", " + currMouse.y + "]");
    for (let i = 0; i < triNum; i++){
        let ultimate = new Victor(0, 0);
        //console.log(currMouse.x + " : " + currMouse.y);
        if (IsMouseSame){
            ultimate = ultimate.add(Seek(new Victor(sWidth / 2, sHeight / 2), triPosArr[i]));
        }
        else{
            ultimate = ultimate.add(Seek(currMouse, triPosArr[i]));
            //stopTris = setInterval(Pause, 5000);
        }
        
        //triAccArr[i].add(Seek(currMouse, triPosArr[i]));
        ultimate.add(Separation(triPosArr[i]));
        ultimate.limit(maxForce, maxForce);
        triAccArr[i].add(ultimate);
    }

    
    /*triAccArr[0].add(Seek(currMouse, triPosArr[0]));
    console.log(currMouse.x + " : " + currMouse.y);
    triAccArr[1].add(Seek(currMouse, triPosArr[1]));*/
    
}

//method for updating the transform of the triangles on the screen
function UpdatePosition () {
    /*position = gameObject.transform.position;
    velocity += acceleration;
    velocity = Vector3.ClampMagnitude (velocity, maxSpeed);
    position += velocity;
    direction = velocity.normalized;
    acceleration = Vector3.zero;*/
    for(let i = 0; i < triNum; i++){
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
        console.log(direction);
    
        let newPos = new Victor(position.x + triPosArr[i].x, position.y + triPosArr[i].y)
        triArr[i].style.top = position.y + "px";
        triArr[i].style.left = position.x + "px";
        triArr[i].style.transform = "rotate(" + direction + "deg)";
        //triArr[i].transform({rotation: direction});
        
    
        triPosArr[i] = position;
    }
    
}

//sets function for tracking mouse to the onmousemove event
document.onmousemove = FollowMouse;

//method called ~30 times per second | "main loop"
function Update(){
    //Seek(mousePos, triPosArr[0]);//test update
    //FollowMouse();
    //console.log(mousePos.x + " " + mousePos.y);
    //currMouse = mousePos;
    
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
    
    lastMousePos = mousePos;
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
let tri = "tri.svg";
let triNum = 10;
let triHeight = 72;
let triWidth = 44;

let triArr;
let triPosArr = new Array(triNum);
let triVelArr = new Array(triNum);
let triAccArr = new Array(triNum);

let maxSpeed = 10;
let maxForce = 2;
let mass = 1;

let mousePos;
let currMouse;

let updateInterval = setInterval(Update, 200);

InstantiateTris();
//Seek(new Victor(100,100), triPosArr[0]); //test calculations

function InstantiateTris(){

    for(let i = 0; i < triNum; i++){
        let newTri = document.createElement('img');
        newTri.src = tri;
        newTri.alt = "tri";
        //triArr[i] = newTri;
        document.body.appendChild(newTri);
    }
    
    triArr = document.querySelectorAll("img");
    console.log(triArr);

    for(let i = 0; i < triNum; i++){
        triArr[i].style.position = 'absolute';
        let newTop = 0 - triHeight / 2;
        let newLeft = 0 - triWidth / 2;
        triArr[i].style.top = "" + newTop + "px";
        triArr[i].style.left = "" + newLeft + "px";
    }

    /*triAccArr = new Array(triArr.length);
    triPosArr = new Array(triArr.length);
    triVelArr = new Array(triArr.length);*/

    for (let i = 0; i < triNum; i++){
        triAccArr[i] = new Victor(0, 0);
        triVelArr[i] = new Victor(0, 0);
        triPosArr[i] = new Victor(0, 0);
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
    /*CalcSteeringForces();
    UpdatePosition();*/
}

function Seek(target, currTri){
    /*
        Vector3 desiredVelocity = targetPos - position;
		desiredVelocity.Normalize ();
		desiredVelocity = desiredVelocity * maxSpeed;

        return (desiredVelocity - velocity);
    */
    /*console.log("tX: " + target.x);
    console.log("cX: " + currTri.x);*/

    let desiredVelocity = target.subtract(currTri);
    desiredVelocity.normalize();
    desiredVelocity.limit(0, maxForce);
    //console.log("scaled: " + desiredVelocity.length());
    return desiredVelocity;
}

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
    

    for (let i = 0; i < triNum; i++){
        let ultimate = new Victor(0, 0);
        console.log("Number: " + i + " Target: [" + currMouse.x + ", " + currMouse.y + "]");
        ultimate = ultimate.add(Seek(currMouse, triPosArr[i]));
        triAccArr[i].add(ultimate);
    }
    
}

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
    
        let newPos = new Victor(position.x + triPosArr[i].x, position.y + triPosArr[i].y)
        triArr[i].style.top = position.y + "px";
        triArr[i].style.left = position.x + "px";
    
        triPosArr[i] = position;
    }
    
}

//sets function for tracking mouse to the onmousemove event
document.onmousemove = FollowMouse;

function Update(){
    //Seek(mousePos, triPosArr[0]);//test update
    //FollowMouse();
    //console.log(mousePos.x + " " + mousePos.y);
    currMouse = mousePos;
    CalcSteeringForces();
    UpdatePosition();
}
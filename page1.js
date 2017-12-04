let tri = "tri.svg";
let triNum = 10;
let triHeight = 72;
let triWidth = 44;

let triArr;
let triPosArr;
let triVelArr;
let triAccArr;

let maxSpeed = 10;
let maxForce = 2;

InstantiateTris();


function InstantiateTris(){

    for(let i = 0; i < triNum; i++){
        let newTri = document.createElement('img');
        newTri.src = tri;
        newTri.alt = "tri";
        //triArr[i] = newTri;
        document.body.appendChild(newTri);
    }
    
    triArr = document.querySelectorAll("img");

    for(let i = 0; i < triNum; i++){
        triArr[i].style.position = 'absolute';
        let newTop = 0 - triHeight / 2;
        let newLeft = 0 - triWidth / 2;
        triArr[i].style.top = "" + newTop + "px";
        triArr[i].style.left = "" + newLeft + "px";
    }

    triAccArr = new Array(triArr.length);
    triPosArr = new Array(triArr.length);
    triVelArr = new Array(triArr.length);

    for (let i = 0; i < triNum; i++){
        triAccArr = new Victor(0, 0);
        triVelArr = new Victor(0, 0);
        triPosArr = new Victor(0, 0);
    }

}

function FollowMouse(){

}

function Seek(){

}
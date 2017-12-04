let tri = "tri.svg";
let triNum = 10;
let triArr;

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

}
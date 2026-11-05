const rowsBox=document.getElementById("rows");
const colsBox=document.getElementById("cols");
const bombsBox=document.getElementById("bombs");
const rec=document.getElementById("recommended");
const border=document.getElementById("wrapper");
const grid=document.getElementsByClassName("grid")[0];
//const smileyContainer=document.getElementById("smiley-container");
const smiley=document.getElementById("smiley");
let firstClick=false;
let outcome="neutral";
let touchingSmiley=false;

const displayNumbers={
    0: `width: 13px; height: 23px; background-position: 0px 0px;`,
    1: `width: 13px; height: 23px; background-position: -13px 0px;`,
    2: `width: 13px; height: 23px; background-position: -26px 0px;`,
    3: `width: 13px; height: 23px; background-position: -39px 0px;`,
    4: `width: 13px; height: 23px; background-position: -52px 0px;`,
    5: `width: 13px; height: 23px; background-position: -65px 0px;`,
    6: `width: 13px; height: 23px; background-position: -78px 0px;`,
    7: `width: 13px; height: 23px; background-position: -91px 0px;`,
    8: `width: 13px; height: 23px; background-position: -104px 0px;`,
    9: `width: 13px; height: 23px; background-position: -117px 0px;`,
    "-": `width: 13px; height: 23px; background-position: -130px 0px;`
};

const warningNumbers={
    0: `width: 16px; height: 16px; background-position: 0px -23px;`,
    1: `width: 16px; height: 16px; background-position: -16px -23px;`,
    2: `width: 16px; height: 16px; background-position: -32px -23px;`,
    3: `width: 16px; height: 16px; background-position: -48px -23px;`,
    4: `width: 16px; height: 16px; background-position: -64px -23px;`,
    5: `width: 16px; height: 16px; background-position: -80px -23px;`,
    6: `width: 16px; height: 16px; background-position: -96px -23px;`,
    7: `width: 16px; height: 16px; background-position: -112px -23px;`,
    8: `width: 16px; height: 16px; background-position: -128px -23px;`
};

//testDis.style=
const freeSpace=`width: 16px; height: 16px; background-position: 0px -39px;`;
const flag=`width: 16px; height: 16px; background-position: -16px -39px;`;
const clickedBomb=`width: 16px; height: 16px; background-position: -32px -39px;`;
const faltyFlag=`width: 16px; height: 16px; background-position: -48px -39px;`;
const bomb=`width: 16px; height: 16px; background-position: -64px -39px;`;
const defaultSmiley=`width: 26px; height: 26px; background-position: 0px -55px;`;
const clickedSmiley=`width: 26px; height: 26px; background-position: -26px -55px;`;
const scaredSmiley=`width: 26px; height: 26px; background-position: -52px -55px;`;
const loseSmiley=`width: 26px; height: 26px; background-position: -78px -55px;`;
const winSmiley=`width: 26px; height: 26px; background-position: -104px -55px;`;
const topLeft=`width: 10px; height: 10px; background-position: 0px -81px;`;
const topRight=`width: 10px; height: 10px; background-position: -10px -81px;`;
const bottomLeft=`width: 10px; height: 10px; background-position: -20px -81px;`;
const bottomRight=`width: 10px; height: 10px; background-position: -30px -81px;`;
const topBottom=`width: 16px; height: 10px; background-position: -40px -81px;`;
const splitLeft=`width: 10px; height: 10px; background-position: -56px -81px;`;
const splitRight=`width: 10px; height: 10px; background-position: -66px -81px;`;
const leftRight=`width: 10px; height: 32px; background-position: -134px -39px;`;


class Space{
    #buttonElement;
    #imgElement;
    constructor(style, index, leftEdge=false, topEdge=false, rightEdge=false, bottomEdge=false, isMine=false, isClicked=false, isFlagged=false){
        this.style=style;
        this.index=index;
        this.isMine=isMine;
        this.isClicked=isClicked;
        this.isFlagged=isFlagged;
        this.leftEdge=leftEdge;
        this.topEdge=topEdge;
        this.rightEdge=rightEdge;
        this.bottomEdge=bottomEdge;

        this.#buttonElement=document.createElement("button");  // makes the button
        this.#buttonElement.id=`button${this.index+1}`;  //sets button id to "button{index}"
        //this.#buttonElement.style=`
        //    width: 64px;
        //    height: 64px;
        //    cursor: pointer;
        //    padding: none;
        //    background: none;
        //    border: none;
        //    img{
        //        ${this.style} background-image: url("./media/sprite100.gif"); background-repeat: no-repeat; image-rendering: pixelated; image-rendering: crisp-edges; width: 16px; height: 16px; background-position: 0px -39px; display: block;
        //    }
        //`;

        this.#imgElement=document.createElement("img");
        this.#imgElement.id=`img${this.index+1}`;
        this.#imgElement.src="";
        this.#imgElement.alt="";
        //this.#imgElement.style=`${this.style} background-image: url("./media/sprite100.gif"); background-repeat: no-repeat; image-rendering: pixelated; image-rendering: crisp-edges; width: 16px; height: 16px; background-position: 0px -39px; display: block;`;

        this.#buttonElement.append(this.#imgElement);

        this.#buttonElement.addEventListener("click", () => this.gridClicked());
        this.#buttonElement.addEventListener("contextmenu", (e)=>this.gridRightClicked(e));

        //this.#buttonElement.push(this.#imgElement);
        //grid.push(this.#buttonElement);

    }
    
    get button(){
        return this.#buttonElement;
    }
    get img(){
        return this.#imgElement;
    }

    gridClicked(){
        if(outcome=="neutral"){
            if(firstClick==false){
                firstClick=true;
                startBoard(this);
            }else if(this.isFlagged==false){
                if(this.isMine==true){
                    this.#imgElement.style=clickedBomb;
                    lose(this);
                    return;
                }else{
                    this.getNumberOfBombs();
                    this.isClicked=true;
                }
            }
        }
    }

    gridRightClicked(event){
        if(outcome=="neutral"){
            console.log("right clicked")
            console.log(this)
            event.preventDefault(); // Prevents the default right-click menu
            if(this.isFlagged==false&&this.isClicked==false){
                this.#imgElement.style=flag;
                this.isFlagged=true;
            }else if(this.isFlagged==true){
                this.#imgElement.style=freeSpace;
                this.isFlagged=false;
            }

            //this.alt="N";
        }
    }

    getNumberOfBombs(){
        let amount=0;
        if(this.index>cols&&this.leftEdge==false&&this.topEdge==false){     //top left
            if(spaces[this.index-(cols+1)].isMine==true){
                amount++;
            }
        }
        if(this.index>cols-1&&this.topEdge==false){                           //top mid
            if(spaces[this.index-(cols)].isMine==true){
                amount++;
            }
        }
        if(this.index>cols-1&&this.rightEdge==false&&this.topEdge==false){    //top right
            if(spaces[this.index-(cols-1)].isMine==true){
                amount++;
            }
        }
        if(this.index>0&&this.leftEdge==false){                          //mid left
            if(spaces[this.index-1].isMine==true){
                amount++;
            }
        }
        if(this.index<spaces.length-1&&this.rightEdge==false){           //mid right
            if(spaces[this.index+1].isMine==true){
                amount++;
            }
        }
        if(this.index<spaces.length-(cols-1)&&this.leftEdge==false&&this.bottomEdge==false){  //bottom left
            if(spaces[this.index+(cols-1)].isMine==true){
                amount++;
            }
        }
        if(this.index<spaces.length-cols&&this.bottomEdge==false){       //bottom mid
            if(spaces[this.index+(cols)].isMine==true){
                amount++;
            }
        }
        if(this.index<spaces.length-(cols+1)&&this.rightEdge==false&&this.bottomEdge==false){ //bottom right
            if(spaces[this.index+(cols+1)].isMine==true){
                amount++;
            }
        }
        this.#imgElement.style=warningNumbers[amount];
        this.isClicked=true;
        moves++;

        if(moves==(total-bombCount)){
            win();
            return;
        }

        if(amount==0){
            this.revealMore();
        }
    }

    revealMore(){
        if(this.index>cols&&this.leftEdge==false&&this.topEdge==false){     //top left
            if(spaces[this.index-(cols+1)].isClicked==false){
                spaces[this.index-(cols+1)].getNumberOfBombs();
            }
        }
        if(this.index>cols-1&&this.topEdge==false){                           //top mid
            if(spaces[this.index-(cols)].isClicked==false){
                spaces[this.index-(cols)].getNumberOfBombs();
            }
        }
        if(this.index>cols-1&&this.rightEdge==false&&this.topEdge==false){    //top right
            if(spaces[this.index-(cols-1)].isClicked==false){
                spaces[this.index-(cols-1)].getNumberOfBombs();
            }
        }
        if(this.index>0&&this.leftEdge==false){                          //mid left
            if(spaces[this.index-1].isClicked==false){
                spaces[this.index-1].getNumberOfBombs();
            }
        }
        if(this.index<spaces.length-1&&this.rightEdge==false){           //mid right
            if(spaces[this.index+1].isClicked==false){
                spaces[this.index+1].getNumberOfBombs();
            }
        }
        if(this.index<spaces.length-(cols-1)&&this.leftEdge==false&&this.bottomEdge==false){  //bottom left
            if(spaces[this.index+(cols-1)].isClicked==false){
                spaces[this.index+(cols-1)].getNumberOfBombs();
            }
        }
        if(this.index<spaces.length-cols&&this.bottomEdge==false){       //bottom mid
            if(spaces[this.index+(cols)].isClicked==false){
                spaces[this.index+(cols)].getNumberOfBombs();
            }
        }
        if(this.index<spaces.length-(cols+1)&&this.rightEdge==false&&this.bottomEdge==false){ //bottom right
            if(spaces[this.index+(cols+1)].isClicked==false){
                spaces[this.index+(cols+1)].getNumberOfBombs();
            }
        }
    }
}


/*                                         display numbers
button.onclick=function(){
    if(num1=="-"){
        num1=(-1);
    }
    num1+=1;
    if(num1==10){
        num1="-";
    }
    testDis.style=displayNumbers[num1];
}
*/

/*                                          warning numbers
button.onclick=function(){
    num1+=1;
    if(num1==9){
        num1=0;
    }
    testDis.style=warningNumbers[num1];
    }
    */


let spaces=[]
let rows, cols, bombCount, lefts, tops, rights, bottoms, first;

bombsBox.value=10;
rowsBox.value=9;
colsBox.value=9;
bombCount=10;
rows=9;
cols=9;

let moves=0;

reset();
function reset(){
    rows=Number(rowsBox.value);
    cols=Number(colsBox.value);
    bombCount=Number(bombsBox.value);

    let borderWidth=cols*64;
    let borderHeight=rows*64;

    border.style=`width: ${borderWidth+14}px; height: ${borderHeight+126}px;`

    moves=0;
    //setInitialSmileyStyle();
    smiley.style=`#smiley{${loseSmiley}} #smiley:active{${clickedSmiley}}`;
    firstClick=false;
    outcome="neutral";
    firstClick=false;
    
    lefts=[]
    tops=[]
    rights=[]
    bottoms=[]
    
    grid.style=`grid-template-columns: repeat(${cols}, 64px);`;
    total=rows*cols;

    spaces=[];

    for(let i = 1; i <= total; i++){
        spaces.push(new Space(freeSpace, i-1));
        grid.append(spaces[i-1].button);
    }

    first=spaces[0];
    first.leftEdge=true;
    first.topEdge=true;

    firstRight=spaces[0];
    firstRight.rightEdge=true;
    firstRight.topEdge=true;

    for(thing in spaces){
        if(spaces[thing].index<cols){
            spaces[thing].topEdge=true;              // top
        }
        if(spaces[thing].index%cols==0&&spaces[thing].index!=0){
            spaces[thing].leftEdge=true;             // left
        }
        if((spaces[thing].index+1)%cols==0){
            spaces[thing].rightEdge=true;            // right
        }
        if(spaces[thing].index>spaces.length-(cols+1)){
            spaces[thing].bottomEdge=true;           // bottom
        }
    }
    spaces[0].rightEdge=false;
}


rowsBox.onchange=function(){
    if(Number(rowsBox.value)>20){
        rowsBox.value=20;
    }
    if(Number(rowsBox.value)<4){
        rowsBox.value=4;
    }
    getRec();
}
colsBox.onchange=function(){
    if(Number(colsBox.value)>20){
        colsBox.value=20;
    }
    if(Number(colsBox.value)<4){
        colsBox.value=4;
    }
    getRec();
}
bombsBox.onchange=function(){
    if(Number(bombsBox.value)>total-9){  //DO NOT CHANGE 9  (9 stands just for a 3x3 grid, not necessarily the rows or cols value)
        bombsBox.value=total-9;
    }
    if(Number(bombsBox.value)<1){
        bombsBox.value=1;
    }
}

getRec();
function getRec(){
    rec.innerHTML=`Recommended Mines (based on selected rows/ columns): <u>${Math.round((Number(rowsBox.value)*Number(colsBox.value))*0.12345)}</u>`;
}


smiley.onclick=function(){
    for(index in spaces){
        spaces[index].button.remove();
    }
    spaces=[];
    reset();
}
smiley.onmousedown=function(){
    if(outcome=="neutral"){
        smiley.style=`#smiley{${defaultSmiley}} #smiley:active{${clickedSmiley}}`;//winSmiley
    }
}

smiley.addEventListener('mouseenter', ()=>{
  touchingSmiley=true;
  console.log(touchingSmiley);
});
smiley.addEventListener('mouseleave', ()=>{
  touchingSmiley=false;
  console.log(touchingSmiley);
});


window.addEventListener('mousedown', (event)=>{
    if(outcome=="neutral"){
        if(!touchingSmiley&&event.button!==2){
            smiley.style=scaredSmiley;
        }
    }
});
window.addEventListener('mouseup', ()=>{
    if(outcome=="neutral"){
        if(!touchingSmiley){
            smiley.style=`#smiley{${defaultSmiley}} #smiley:active{${clickedSmiley}}`;
        }
    }
});

console.log(spaces);

let bombs;
let using;

function setbombs(){
    bombs=[];

    for(let i=1; i<=bombCount; i++){
        using=Math.floor(Math.random()*(total));
        while(bombs.includes(using)||spaces[using].isClicked==true){
            using=Math.floor(Math.random()*(total));
        }
        bombs.push(using);
    }
}

let map=[];
function startBoard(clickedSpace){
    map=[];
    clickedSpace.img.style=warningNumbers[0];
    clickedSpace.isClicked=true;
    moves++;

    if(clickedSpace.index>cols&&clickedSpace.leftEdge==false&&clickedSpace.topEdge==false){     //top left
        spaces[clickedSpace.index-(cols+1)].isClicked=true;
    }
    if(clickedSpace.index>cols-1&&clickedSpace.topEdge==false){                           //top mid
        spaces[clickedSpace.index-cols].isClicked=true;
    }
    if(clickedSpace.index>cols-1&&clickedSpace.rightEdge==false&&clickedSpace.topEdge==false){    //top right
        spaces[clickedSpace.index-(cols-1)].isClicked=true;
    }
    if(clickedSpace.index>0&&clickedSpace.leftEdge==false){                          //mid left
        spaces[clickedSpace.index-1].isClicked=true;
    }
    if(clickedSpace.index<spaces.length-1&&clickedSpace.rightEdge==false){           //mid right
        spaces[clickedSpace.index+1].isClicked=true;
    }
    if(clickedSpace.index<spaces.length-(cols-1)&&clickedSpace.leftEdge==false&&clickedSpace.bottomEdge==false){  //bottom left
        spaces[clickedSpace.index+(cols-1)].isClicked=true;
    }
    if(clickedSpace.index<spaces.length-cols&&clickedSpace.bottomEdge==false){       //bottom mid
        spaces[clickedSpace.index+cols].isClicked=true;
    }
    if(clickedSpace.index<spaces.length-(cols+1)&&clickedSpace.rightEdge==false&&clickedSpace.bottomEdge==false){ //bottom right
        spaces[clickedSpace.index+(cols+1)].isClicked=true;
    }

    setbombs();
    for(index in bombs){
        spaces[bombs[index]].isMine=true;
        console.log(`The space --> ${spaces[bombs[index]]} <-- has had its isMine thingy set to ${spaces[bombs[index]].isMine}`);
    }

    if(clickedSpace.index>cols&&clickedSpace.leftEdge==false&&clickedSpace.topEdge==false){     //top left
        spaces[clickedSpace.index-(cols+1)].getNumberOfBombs()
    }
    if(clickedSpace.index>cols-1&&clickedSpace.topEdge==false){                           //top mid
        spaces[clickedSpace.index-cols].getNumberOfBombs()
    }
    if(clickedSpace.index>cols-1&&clickedSpace.rightEdge==false&&clickedSpace.topEdge==false){    //top right
        spaces[clickedSpace.index-(cols-1)].getNumberOfBombs()
    }
    if(clickedSpace.index>0&&clickedSpace.leftEdge==false){                          //mid left
        spaces[clickedSpace.index-1].getNumberOfBombs()
    }
    if(clickedSpace.index<spaces.length-1&&clickedSpace.rightEdge==false){           //mid right
        spaces[clickedSpace.index+1].getNumberOfBombs()
    }
    if(clickedSpace.index<spaces.length-(cols-1)&&clickedSpace.leftEdge==false&&clickedSpace.bottomEdge==false){  //bottom left
        spaces[clickedSpace.index+(cols-1)].getNumberOfBombs()
    }
    if(clickedSpace.index<spaces.length-cols&&clickedSpace.bottomEdge==false){       //bottom mid
        spaces[clickedSpace.index+cols].getNumberOfBombs()
    }
    if(clickedSpace.index<spaces.length-(cols+1)&&clickedSpace.rightEdge==false&&clickedSpace.bottomEdge==false){ //bottom right
        spaces[clickedSpace.index+(cols+1)].getNumberOfBombs()
    }

    correctMoves();
}

function correctMoves(){
    moves=0;
    for(thing in spaces){
        if(spaces[thing].isClicked==true){
            moves++;
        }
    }
}

function lose(clickedOne){
    console.log("you lost (add code to reveal board, u bum)");
    if(outcome=="neutral"){
        outcome="lose";
        smiley.style=loseSmiley;  //Why does this one work?
        //smiley.style=`#smiley{${loseSmiley}} #smiley:active{${clickedSmiley}}`;  //But this one doesnt?
        //smiley.style=`#smiley{${defaultSmiley}} #smiley:active{${clickedSmiley}}`;  //Even though this one does?

        for(thing in spaces){
            if(spaces[thing].isMine==true&&spaces[thing]!=clickedOne){
                if(spaces[thing].isFlagged){
                    spaces[thing].img.style=flag;
                }else{
                    spaces[thing].img.style=bomb;
                }
            }else if(spaces[thing]!=clickedOne){
                if(spaces[thing].isFlagged==false){
                    //
                }else{
                    spaces[thing].img.style=faltyFlag;
                }
            }
        }
    }
}

function win(){
    correctMoves();
    if(moves==total-bombCount){
        if(outcome=="neutral"){
            outcome="win";
            smiley.style=winSmiley;         // add console.log stuff for every possible point that smiley.style is set back to  default in previous code --> console.log("smiley.style set to defalt and clicked when clicked");
            //smiley.style=`#smiley{${winSmiley}} #smiley:active{${clickedSmiley}}`;
        }
        for(thing in spaces){
            if(spaces[thing].isFlagged==false&&spaces[thing].isMine==true){
                spaces[thing].img.style=flag;
            }
        }
    }
}
let cells = document.querySelectorAll('.square');
let statuslabel = document.getElementById('status-indicator');
let clearbtn = document.getElementById('restart');
let friendbtn = document.getElementById('mode-friend');
let botbtn = document.getElementById('mode-bot');
let currentmode = 'friend';
let activeturn = 'X';
let isplayable = true;
let gridstate = ["", "", "", "", "", "", "", "", ""];
let wincombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];
friendbtn.addEventListener('click', function(){
    if(currentmode!=='friend'){
        currentmode='friend';
        friendbtn.classList.add('selected');
        botbtn.classList.remove('selected');
        resetmatch();
    }
});
botbtn.addEventListener('click',function(){
    if(currentmode!=='bot'){
        currentmode='bot';
        botbtn.classList.add('selected');
        friendbtn.classList.remove('selected');
        resetmatch();
    }
});
cells.forEach(function(cell){
    cell.addEventListener('click',function(){
        let targetindex = parseInt(cell.getAttribute('data-cell'));
        if(gridstate[targetindex]!==""||!isplayable){
            return;
        }
        if(currentmode==='bot'&&activeturn==='O'){
            return;
        }
        claimcell(targetindex, activeturn);
        let gameended= evaluateboard();
        if(!gameended&&currentmode==='bot'){
            activeturn='O';
            statuslabel.innerHTML="bot is thinking.................";
            setTimeout(triggerbotlogic,500);
        }
    });
});
function claimcell(index,player){
    gridstate[index]=player;
    cells[index].innerHTML=player;
    cells[index].classList.add(player==='X'?'player-x':'player-o');
}
function triggerbotlogic(){
    if(!isplayable)return;
    let chosenmove = lookforstrategicmove('O');
    if(chosenmove===null){
        chosenmove=lookforstrategicmove('X')
    }
    if(chosenmove===null){
        let openSpots =[];
        for(let i=0;i<gridstate.length;i++){
            if(gridstate[i]===""){
                openSpots.push(i);
            }
        }
        let randomselection=Math.floor(Math.random()*openSpots.length);
        chosenmove=openSpots[randomselection];
    }
    claimcell(chosenmove,'O');
    evaluateboard();
}
function lookforstrategicmove(playersign){
    for(let i=0;i<wincombos.length;i++){
        let combo = wincombos[1];
        let a=gridstate[combo[0]];
        let b= gridstate[combo[1]];
        let c= gridstate[combo[2]];
        if(a===playersign&&b===playersign&&c==="")return combo[2];
        if(a===playersign&&c===playersign&&b==="")return combo[1];
        if(b===playersign&&c===playersign&&a==="")return combo[0];   
    }
    return null;
}
function evaluateboard(){
    let matchwon = false;
    let winningline =[];
    for(let i=0;i<wincombos.length;i++){
        let combo = wincombos[i];
        let pos1=gridstate[combo[0]];
        let pos2 = gridstate[combo[1]];
        let pos3 = gridstate[combo[2]];
        if(pos1===""||pos2===""||pos3===""){
            continue;
        }
        if(pos1===pos2&&pos2===pos3){
            matchwon=true;
            winningline=combo;
            break;
        }
    }
    if(matchwon){
        statuslabel.innerHTML=currentmode==='bot'&&activeturn==='O'?"Bot wins": `Player ${activeturn} wins!!`;
        isplayable=false;
        winningline.forEach(function(index){
            cells[index].classList.add('winning-cell');
        });
        return true;
    }
    let matchtied = !gridstate.includes("");
    if(matchtied){
        statuslabel.innerHTML="its a tie lol";
        isplayable=false;
        return true;
    }
    if(currentmode==='friend'){
        activeturn= activeturn==='X'?'O':'X';
        statuslabel.innerHTML= `Player ${activeturn}'s turn!`;
    }else{
        activeturn= 'X';
        statuslabel.innerHTML = `Player X's turn`;
    }
    return false;
}
function resetmatch(){
    activeturn='X';
    isplayable= true;
    gridstate= ["","","","","","","","",""];
    statuslabel.innerHTML= `Player X's turn`;
    cells.forEach(function(cell){
        cell.innerHTML="";
        cell.className ="square";
    });
}
clearbtn.addEventListener('click',resetmatch);
// done ig?
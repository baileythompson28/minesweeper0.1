let rows=9;
let cols=9;

let list=[];

for(let i = 1; i <= cols; i++){
    list.push([]);
    for(let j = 1; j <= rows; j++){
        list[i-1].push(j-1);
    }
}

console.log(list);
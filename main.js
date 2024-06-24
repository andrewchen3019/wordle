const letters = document.querySelectorAll(".letter-edit");
const keys = document.querySelectorAll(".key");
const contextmenu = document.getElementById("contextmenu");
const outputContainer = document.getElementById("output-container");
const oldRows = document.getElementById("old-rows");
const loading = document.getElementById("loading");
const clearAll = document.getElementById("clear-all");
const undo = document.getElementById("undo");
const showMore = document.getElementById("show-more");
const signal = document.getElementById("signal");

function modifyLetter(str, index, newLetter) {
  if (index < 0 || index >= str.length) {
    throw new Error("Index out of bounds");
  }

  // Convert the string to an array
  let charArray = str.split('');

  // Modify the specific letter
  charArray[index] = newLetter;

  // Convert the array back to a string
  return charArray.join('');
}


let selected = 0;

const colors =  ["gray","gray", "gray","gray","gray" ]
var outputs = [];
letters.forEach(letter => {
    letter.addEventListener("click", (e) => {
        e.preventDefault()
        
        contextmenu.style.display = "block";
        contextmenu.style.left = e.clientX + "px";
        contextmenu.style.top = e.clientY + "px";
        document.getElementById("gray").querySelector(".checkmark").style.display = "none";
        document.getElementById("yellow").querySelector(".checkmark").style.display = "none";
        document.getElementById("green").querySelector(".checkmark").style.display = "none";
        document.getElementById(colors[parseInt(letter.id)]).querySelector(".checkmark").style.display = "inline";
        
        document.getElementById("gray").onclick = () => {
            letter.classList.remove("green");
            letter.classList.remove("yellow");
            letter.classList.add("gray");
            colors[parseInt(letter.id)] = "gray";
            contextmenu.style.display = "none";
        }

                
        document.getElementById("green").onclick = () => {
            letter.classList.remove("gray");
            letter.classList.remove("yellow");
            letter.classList.add("green");
            colors[parseInt(letter.id)] = "green";
            contextmenu.style.display = "none";
        }
                
        document.getElementById("yellow").onclick = () => {
            letter.classList.remove("green");
            letter.classList.remove("gray");
            letter.classList.add("yellow");
            colors[parseInt(letter.id)] = "yellow";
            contextmenu.style.display = "none";
        }
        setTimeout(() => contextmenu.style.display = "none", 5000)
    })
})
keys.forEach(key => {
    key.addEventListener("click", () => {
        if(key.innerHTML == `<i class="fas fa-backspace"></i>`) {
            if(selected != 0) {
              selected--;
              document.getElementById(selected).innerHTML = "";
            }
        }else if(key.innerHTML == "Enter"){
            outputContainer.innerHTML = "";
            loading.style.display = "block";
            process();
        }
        else{
            if(selected != 5){
            document.getElementById(selected).innerHTML = key.innerHTML;
              selected++;
            }

            
        }

    })
})
document.addEventListener("keydown", e => {
  if(e.key != " "){
    if(e.key == "Backspace"){
      if(selected != 0) {
        selected--;
        document.getElementById(selected).innerHTML = "";
      }
    }
    else if(e.key == "Enter"){
      process();
    }else if(e.key.length == 1){
      if(selected != 5){
        document.getElementById(selected).innerHTML = e.key.toUpperCase();
        selected++;
      }
    }

  }

})
let dictionary;
function readTextFile(file)
{   
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                let fullText = allText.split(/\r\n|\n/);
                dictionary = fullText;
              
            }
        }
    }
    rawFile.send(null);
}
readTextFile("/Collins Scrabble Words (2019).txt");
let dict = dictionary.filter(ele => ele.length == 5);
let oldDict = dict;

function isGood(ele, word){
  // ele is a string
  // Word is user inputed word
    var output = true;
    // checking green letters
    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        const letter = word[i];
        if (color == "green") {     
             if(!(ele[i] == letter)){
                output = false;
                break;
             }else {
               ele = modifyLetter(ele, i, "&");
             }
        }
    }
  // filtering out yellow
  if(output){
    let yellow = [];
    let badLetters = [];
    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      const letter = word[i];
      if(color == "yellow"){
        let yelIndex = yellow.findIndex(obj => obj.letter == letter);
        if(yelIndex != -1) {
          yellow[yelIndex].number++;
          yellow[yelIndex].badPositions.push(i);
        } else {
          yellow.push({letter: letter, number: 1, badPositions: [i]});
        }
      }else if(color == "gray") {
        let yelIndex = yellow.findIndex(obj => obj.letter == letter);
        if(yelIndex != -1) {
          yellow[yelIndex].badPositions.push(i);
        } else {
          if(badLetters.findIndex(lett => lett == letter) == -1){
            badLetters.push(letter);
          }
        }
      }
    }
    // checking ele
    yellow.forEach(yel => {
      for(let i=0; i < ele.length; i++) {
        if(yel.badPositions.findIndex(pos => pos == i) != -1 && ele[i] == yel.letter){
          output = false;
          break;
        }else if(yel.badPositions.findIndex(pos => pos == i) == -1 && ele[i] == yel.letter){
          yel.number--;
        }
        if(yel.number == 0) break;
      }
      if(yel.number != 0) output = false;
    });
    // check gray letters
    if(output){
      badLetters.forEach(badLetter => {
        if(ele.includes(badLetter)){
          output = false;
        }
      });
    }
  }
  return output;
}
function process(){
    selected = 0;
    var word = "";
    for (let i = 0; i < 5; i++) {
      word+= document.getElementById(i).innerHTML;
    }
    const output= dict.filter(ele => isGood(ele, word));
    var count = 0;
    const showLength = 300;
    outputs.push(output);
    if(output.length == 0){
      outputContainer.innerHTML = "No possible words";
    }else{
      if(output.length > showLength){
        showMore.style.display = "block";
        for (let i = 0; i < showLength; i++) {
          const element = output[i];
          outputContainer.innerHTML += `<div class="word">${element}</div>`
        }
        count = showLength;
        showMore.onclick = () => {
          if(count+showLength > output.length){
            for (let i = count; i < output.length; i++) {
              const element = output[i];
              outputContainer.innerHTML += `<div class="word">${element}</div>`
            }
            showMore.onclick = () => {};
            showMore.style.display = "none";
          }else{
            for (let i = count; i < count+showLength; i++) {
              const element = output[i];
              outputContainer.innerHTML += `<div class="word">${element}</div>`
            }
            count += showLength;
          }
        }
      }else{
        showMore.style.display = "none";
        for (let i = 0; i < output.length; i++) {
          const element = output[i];
          outputContainer.innerHTML += `<div class="word">${element}</div>`
        }
      }
      
    }

    let row = "";
    for (let i = 0; i < colors.length; i++) {
        const element = colors[i];
        row += `<div class="letter ${element}">${document.getElementById(i).innerHTML}</div>`;
    }
    oldRows.innerHTML += `<div class="row">${row}</div>`;
    dict = output;
    document.getElementById("1").innerHTML = "";
    document.getElementById("2").innerHTML = "";
    document.getElementById("3").innerHTML = "";
    document.getElementById("4").innerHTML = "";
    document.getElementById("0").innerHTML = "";
    loading.style.display = "none";
}
clearAll.addEventListener("click", () => {
  dict = oldDict;
  oldRows.innerHTML = "";
  outputContainer.innerHTML = "";
  outputs = [];
})
undo.addEventListener("click", () => {
  if(outputs.length > 0){
    outputs.pop();
    dict = outputs[outputs.length-1];
    outputContainer.innerHTML = "";
    for (let i = 0; i <  dict.length; i++) {
        const element =  dict[i];
        outputContainer.innerHTML += `<div class="word">${element}</div>`
    }
    const rows = document.querySelectorAll(".row");
    const child = rows[rows.length-2];
    oldRows.removeChild(child);
  }
})

const settingsButton = document.getElementById("settings-button");
const settings = document.getElementById("settings");
const x = document.getElementById("x");
const darkSwitch = document.getElementById("dark-switch");
const darkSwitchBall = document.getElementById("dark-switch-ball");
const contrastSwitch = document.getElementById("contrast-switch");
const contrastSwitchBall = document.getElementById("contrast-switch-ball");
const bars = document.getElementById("bars");

settingsButton.addEventListener("click", () => {
  settings.style.display = "flex";
})
x.addEventListener("click", () => {
  settings.style.display = "none";
})
  
let darkMode = false;
darkSwitchBall.addEventListener("click", () => {
  if(darkMode == false){       document.getElementById("body").classList.add("darkmode");
    darkMode = true;
                                     darkSwitch.classList.remove("off");
    darkSwitch.classList.add("on");
  }
  else {
    darkMode = false;
    document.getElementById("body").classList.remove("darkmode");
    darkSwitch.classList.remove("on");
    darkSwitch.classList.add("off");
  }
})

let contrastMode = false;
contrastSwitchBall.addEventListener("click", () => {
  if(contrastMode == false){       document.getElementById("body").classList.add("contrastMode");
    contrastMode = true;
    contrastSwitch.classList.remove("off");
    contrastSwitch.classList.add("on");
  }
  else {
    contrastMode = false;
    document.getElementById("body").classList.remove("contrastMode");
    contrastSwitch.classList.remove("on");
    contrastSwitch.classList.add("off");
  }
})
const menu = document.getElementById("menu");
bars.addEventListener("click", () => {
  menu.style.display = "block";
})
document.getElementById("menu-x").addEventListener("click", () => menu.style.display = "none")

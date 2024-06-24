const letters = document.querySelectorAll(".letter-edit");
const keys = document.querySelectorAll(".key");
const notInList = document.getElementById("not-in-list");
const great = document.getElementById("great");
const lose = document.getElementById("lose");
const modal = document.getElementById("modal-container")
const theModal = document.getElementById("modal")
const correctWord = document.getElementById("correct-word");
const modalMessage = document.getElementById("modal-message");
const xs = document.querySelectorAll(".x");
const defineLink = document.getElementById("define-link");
const settingsButton = document.getElementById("settings-button");
const settings = document.getElementById("settings");
const x = document.getElementById("x");
const darkSwitch = document.getElementById("dark-switch");
const darkSwitchBall = document.getElementById("dark-switch-ball");
const contrastSwitch = document.getElementById("contrast-switch");
const contrastSwitchBall = document.getElementById("contrast-switch-ball");
const bars = document.getElementById("bars");
const signal = document.getElementById("signal");
const { numbers } = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})
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
const loadingImg = document.getElementById("loading-container");
if(numbers != 5){document.getElementById("header-title").innerHTML = `${numbers}-LETTER WORDLE`} 
async function render(){
  document.querySelectorAll(".row").forEach(row => {
        row.style.gridTemplateColumns = `repeat(${numbers}, 1fr)`;
  for (let i = 0; i < numbers; i++) {
    row.innerHTML +=  `
              <div class="flip-card">
                <div class="flip-card-inner">
                <div class="letter-edit col-${i}">
                  
                </div>
                <div class="flip-card-back">
                  
                </div>
              </div>
            </div>`;
    }

});
  return new Promise(resolve => resolve("none"));
}
render();
// const display = await render();
loadingImg.style.display = "none";
setSize();
let selected = 0;
let row = 0;
let isLoading = false;
const colors =  []
for (let i = 0; i < numbers; i++) colors.push("gray");
const greatList = ["Great", "Magnificant", "Genius", "Awesome"];
var outputs = [];
keys.forEach(key => {
    key.addEventListener("click", () => {
      if(!isLoading){
        if(key.innerHTML == `<i class="fas fa-backspace"></i>`) {
            if(selected != 0) {
               selected--;  document.getElementById(row).querySelector(`.col-${selected}`).innerHTML = "";

            }
        }else if(key.innerHTML == "Enter"){
            process();
        }
        else{
          if(selected != numbers){
          document.getElementById(row).querySelector(`.col-${selected}`).innerHTML = key.innerHTML;
            selected++;
          }
        }
        }

    })
})

// VARIABLES
let dictionary;
readTextFile("/Collins Scrabble Words (2019).txt")
let dict = dictionary.filter(ele => ele.length == numbers);
let testWord = ""; 
let realWord;
if(testWord == "") realWord = dict[Math.round(Math.random() * dict.length)];
else realWord = testWord;
let word = "";
let output = new Array(parseInt(numbers, 10)).fill("?");
function recursion(nums){

      setTimeout(() => {      document.getElementById(row).querySelector(`.col-${nums}`).parentElement.querySelector(".flip-card-back").innerHTML = document.getElementById(row).querySelector(`.col-${nums}`).innerHTML;
      document.getElementById(row).querySelector(`.col-${nums}`).parentElement.querySelector(".flip-card-back").classList.add(output[nums]);
  document.getElementById(row).querySelector(`.col-${nums}`).parentElement.style.transform = "rotateY(180deg)";
          if(nums == numbers-1){
            end();
          }
          else recursion(nums+1);
          
      }, 500);
}
function end(){
  document.getElementById("signal").innerHTML = output;
  row++;
  let good = true;
  for(let i=1; i < numbers; i++) {
    console.log(output[i])
    if(output[i] != output[0] || output[i] != "G") {
      good = false;
      break;
    }
  }
    if(good){
      isLoading = true
            great.style.display = "block";
            great.innerHTML = greatList[Math.floor(Math.random() * greatList.length)];
            setTimeout(() => {
              great.style.display = "none"
              setTimeout(() => {
                modal.style.display = "flex";
                theModal.style.display = "block";
                modalMessage.innerHTML = "You win!";
                defineLink.setAttribute("href", `https://www.google.com/search?q=${realWord.toLowerCase()}+definition`)
              }, 1000)
            }, 1000)
    }else if(row == 6){
      isLoading = true
      lose.style.display = "block";
      setTimeout(() =>{
        lose.style.display = "none"
        modal.style.display = "flex";
        theModal.style.display = "block";
        modalMessage.innerHTML = `The word was ${realWord}`;
        defineLink.setAttribute("href", `https://www.google.com/search?q=${realWord.toLowerCase()}+definition`)
      } , 1000);
    }
  else{
      for (let i = 0; i < numbers; i++) {
    document.getElementById(word[i]).classList.remove("R");
      document.getElementById(word[i]).classList.remove("Y");
      document.getElementById(word[i]).classList.add(output[i]);
    }
        isLoading = false;
    selected = 0;
  }
  word = "";
  output =  new Array(parseInt(numbers, 10)).fill("?");
  
}
document.addEventListener("keydown", e => {
  if(e.key != " " && !isLoading){
      
    if(e.key == "Backspace"){
      if(selected != 0) {
      selected--;         document.getElementById(row).querySelector(`.col-${selected}`).innerHTML = "";

      }
    }
    else if(e.key.length == 1 && e.key.toLowerCase() != e.key.toUpperCase()){
       if(selected != numbers){     document.getElementById(row).querySelector(`.col-${selected}`).innerHTML = e.key.toUpperCase();
          selected++;
       } 
    }
      else if(e.key == "Enter"){
    process();
  }
  }


})
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
                dictionary = allText.split(/\r\n|\n/);
            }
        }
    }
    rawFile.send(null);
}



// processing the real word

//console.log(realWord)
function process(){
  // word is user word
  let tempWord = realWord;
  for (let i = 0; i < numbers; i++) {
    word += document.getElementById(row).querySelector(`.col-${i}`).innerHTML;
  }
  if(dict.includes(word)){
    for (let i = 0; i < numbers; i++) {
      let letter = word[i];
      if(letter == realWord[i]){
        output[i] = "G";
        tempWord = modifyLetter(tempWord, i, "?");
      }

    }
    for (let i = 0; i < numbers; i++) {
      let letter = word[i];
      if(output[i] == "?") {
        if(tempWord.indexOf(letter) != -1){
          //yellows.push({letter, badIndexes: [realWord.indexOf(letter)]})
          output[i] = "Y";
          tempWord = modifyLetter(tempWord,tempWord.indexOf(letter) , "?");
        }else {
          output[i] = "R";
        }
      }
    }
    isLoading = true;
    recursion(0);
  }
  else{
    word = "";
    output =  new Array(parseInt(numbers, 10)).fill("?");
    notInList.style.display = "block";
    setTimeout(() => notInList.style.display = "none", 3000)
   
  }    
}
xs.forEach(x => 
  {
    x.addEventListener("click", () => {
      modal.style.display = "none";
    })
  })

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

window.addEventListener("resize", () => {
  setSize()});
document.getElementById("play-again").addEventListener("click", () => location.reload());

function setSize(){
    let poopy = (window.innerWidth);
  poopy = Math.min(poopy, 467);
      signal.innerHTML = `${poopy}`;
    document.querySelector(".container").style.width = `${(poopy * (5/6))+6 * numbers}px`;
  document.querySelectorAll(".flip-card-back").forEach(backCard => {
    backCard.style.width = `${poopy/6}px`;
    backCard.style.height = `${poopy/6}px`;
    backCard.style.fontSize = `${poopy/(2*6)}px`;
  })
        document.querySelectorAll(".flip-card-inner").forEach(backCard => {
    backCard.style.width = `${poopy/6}px`;
    backCard.style.height = `${poopy/6}px`;
    backCard.style.fontSize = `${poopy/(2*6)}px`;
  })
    document.querySelectorAll(".letter-edit").forEach(backCard => {
    backCard.style.width = `${poopy/6}px`;
    backCard.style.height = `${poopy/6}px`;
    backCard.style.fontSize = `${poopy/(2*6)}px`;
  }) 
  // document.querySelectorAll(".key").forEach(key => 
  //   {
  //     key.style.height = `${(window.innerHeight-poopy-100)/3}px`;
  //   })
  }
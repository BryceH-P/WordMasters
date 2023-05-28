

//const letterChoices = document.querySelector(".game");

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}
function loseCondition(){
    gameOver=true;
    alert("You Lose the word was "+todaysWord);
}
function winCondition(){
    gameOver=true;
    document.querySelector(".text-edit").classList.add("winner-text");
}
function removeLetter(){

    //If there was a within function, could say within range
    /*if (divIndex <= rowIndex){
        divIndex--;
        divAccess[divIndex].innerText='';
    }*/

    if (divIndex>=26 && rowIndex===30){
        divIndex--;
        divAccess[divIndex].innerText=null;
    }
    else if (divIndex>=21 && rowIndex===25){
        divIndex--;
        divAccess[divIndex].innerText=null;
    }
    else  if (divIndex>=16 && rowIndex===20){
        divIndex--;
        divAccess[divIndex].innerText=null;
    }
    else  if (divIndex>=11 && rowIndex===15){
        divIndex--;
        divAccess[divIndex].innerText=null;
    }
    else  if (divIndex>=6 && rowIndex===10){
        divIndex--;
        divAccess[divIndex].innerText=null;
    }
    else if (divIndex>0 && rowIndex===5){
        divIndex--;
        divAccess[divIndex].innerText=null;
    }
    
    newLine=false;
    guessWord=guessWord.substring(0,guessWord.length-1);

    /*Alt way to avoid all the conditionals, however requires stopping divIndex from becoming negative, and rowIndex needs to increase
    divIndex--;
    divAccess[guessWord.length].innerText=null;*/
}
function addLetter(keys){
    divAccess[divIndex].innerText=keys.toUpperCase();
    guessWord+=divAccess[divIndex].innerText.toUpperCase();
    divIndex++;
    newLine=true;
}
function loading(){
    loadingImage.style.display = "block";
}
function notLoading(){
    loadingImage.style.display = "none";
}
async function wordValidate(){
    loading();
    const promise = await fetch(VALIDATE_URL, {
        method: "POST", body: JSON.stringify({"word":guessWord})
    });
    const processedResponse = await promise.json();
    correctWord=processedResponse.validWord;
    notLoading();
    if(correctWord){
        submitAnswer();
    }
    else{
        invalidFlash();
    }
}
function invalidFlash(){
    for(let i=divIndex-5;i<rowIndex;i++){
        divAccess[i].classList.remove("invalid-input");
        setTimeout(function(){ divAccess[i].classList.add("invalid-input");},100);
    }
}
async function wordOfTheDay(){
    loading();
    const promise = await fetch(WORD_URL);
    const processedResponse = await promise.json();
    todaysWord = processedResponse.word.toUpperCase();
}
function makeMap(word){
    let obj = {};
    for(let i=0;i<word.length;i++){
        let letter = word[i];
        if(obj[letter]){
            obj[letter]++;
        }
        else{
            obj[letter]=1;
        }
    }
    return obj;
}
function submitAnswer(){     
        let map=makeMap(todaysWord);
        //Stops Enter from doing anything on the last row or before a full 5-letter word is entered
        
            for(;letterIndex<divIndex;letterIndex++){
                //compares each letter in the guess word to the answer word cycling through 0-5 as %5 constrains the numbers to that range
                if (guessWord.charAt(letterIndex%5)===todaysWord.charAt(letterIndex%5)){
                    divAccess[letterIndex].style.backgroundColor="green";
                    divAccess[letterIndex].style.color="white";
                    map[guessWord[letterIndex%5]]--;
                }
                else if (todaysWord.includes(guessWord.charAt(letterIndex%5)) && map[guessWord[letterIndex%5]]>0){
                    divAccess[letterIndex].style.backgroundColor="gold";
                    divAccess[letterIndex].style.color="white";
                    map[guessWord[letterIndex%5]]--;
                }
                else{
                    divAccess[letterIndex].style.backgroundColor="grey";
                    divAccess[letterIndex].style.color="white";
                }
            }
            if(guessWord===todaysWord){
                winCondition();
            }
        //divIndex%5...ensures we are at the end of a row and newLine=true only happens when adding letters to stop enter from being able to be pressed repeatedly at a row end
            if (newLine){
                //By increasing by 5, adding letters will continue working on the new row because the divIndex will always be 5 below the rowIndex
                rowIndex+=5;
                newLine=false;
                guessWord='';
                correctWord=false;
            }
        
        if(divIndex===30 && guessWord!==todaysWord){
                loseCondition();
        }
}

//Will select my game's first div in order to later change its inner text
let divAccess = document.querySelectorAll(".div-styler");
//Can be changed in order to queryselect the next div in my queryselectall
let divIndex=0;
//Keeps track of what key is pressed
let keys;
//Tracks and helps will help prevent queryselection continuing to new rows
let rowIndex=5;
//Keeps track of changing to a new line
let newLine=false;
//URL I'm "getting" the word fo the day from
const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
//URL I'm "postin" my guess word to, to check if it's a valid 5-letter word
const VALIDATE_URL = "https://words.dev-apis.com/validate-word";
//Holds onto word of the day accessed by wordOfTheDay function
let todaysWord='';
//Compares to todaysWord to see if guess is correct
let guessWord='';
//Stops the game from continuing
let gameOver=false;
//Used to cycle through 0-5 to access and compare the different letters of guessWord and todaysWord
let letterIndex=0;
let loadingImage=document.querySelector(".loading");
//Holds onto VALID_URL's answer
let correctWord='';


wordOfTheDay();
notLoading();
    document.addEventListener("keydown", function(event){
        if(gameOver){
            return;
        }
       else if (!isLetter(event.key) && event.key !== "Backspace" && event.key !== "Enter"){
            event.preventDefault();
          }
          else if(event.key === "Backspace"){
            removeLetter();
          }
          else if(event.key === "Enter"){
            if(rowIndex<=30 && divIndex%5===0){    
                if(newLine){
                    wordValidate();
                }
            }
            else{
                //invalidFlash();
            }
          }
          else{
            keys=event.key;
            if(!isLetter(divAccess.innerText) && divIndex < rowIndex){
                addLetter(keys);
            } 
          }
    }); 

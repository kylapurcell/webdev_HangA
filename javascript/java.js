// setting the inital values
let lives = 7;
let score = 0;

// the dictionary of words that will be used in the game
let word_list = [
    {"TATTOO": "a form of body modification where a design is made using ink and a needle gun"},
    {"ELECTRICITY": "is the set of physical phenomena associated with the presence and motioin of electric charge"},
    {"COMMITTEE" : "a group of people appointed for a specific function"},
    {"JAVASCRIPT" : "an object-orientated computer programming language"},
    {"PYTHON" : "a large heavy-boided nonvenomous snake"},
    {"SUSHI" : "a Japanese dish consisting of small balls or rolls of vinegar-flavored cold cooked rice served with a garnish of raw fish, vegetables, or egg"},
    {"BREAKFAST" : "a meal eaten in the morning, the first of the day"},
    {"MISSISSIPPI" : "a state located in the southeastern region of the United States"},
    {"COFFEE" : "a hot drink made from the roasted and ground seeds"},
    {"BANKRUPTCY" : "the state of being unable to pay outstanding debts"},
    ]

 // randomly selects a word from the word object
function pick_word(){
    let word_array = word_list[Math.floor(Math.random() * word_list.length)];
    let word_string = (Object.keys(word_array));
    let word = word_string[0];
    let definition = word_array[word];
    console.log(word);
    console.log(definition);
    document.getElementById("definition").innerHTML = definition;
    return word;
    }

// picks a random word and splits the characters of the word into a list 
function split_word(){
    let word = pick_word();
    console.log(word);
    let mod_word = word.split("");
    console.log(mod_word);
    return mod_word;
}

let word = split_word();

// displays and modifies the lines as play goes on 
 let num_lines = []
        
function initiate_dashes(){
    for (i = 0; i < word.length; i++){
        num_lines[i] = "_";
    }
    let lineWrite = num_lines.join(" ");
    console.log(lineWrite);
    document.getElementById("lines").innerHTML = (lineWrite);
    return num_lines;
}

// displays and modifies the lines as play goes on 
function dashes(value){
    for (i = 0; i < word.length; i++){
        if (value == word[i]){
            num_lines[i] = word[i];
                }
            }
    let lineWrite = num_lines.join(" ");
    console.log(lineWrite);
    document.getElementById("lines").innerHTML = (lineWrite);
    return num_lines;
}

initiate_dashes();

function write_database(score, name)  {
    name = name;
    score = score;
    firebase.database().ref("scores/" + name).set({
        name: name,
        score: score,
    });
}   


// reads the respective items from the database 
function read_highscore(){
    var dbRef = firebase.database().ref("scores/").orderByChild("score").limitToFirst(5);
    dbRef.once("value", function(snap){
        list = snap.val();
        console.log("this is" + list);
        display_information(list);
    })
}

// takes the information and formants it
function display_information(list){
    for (x in list){
        let data_name = document.createElement("p");
        document.getElementById("data_display_name").appendChild(data_name);
        let node_name = document.createTextNode(list[x].name);
        data_name.appendChild(node_name);

        let data_score = document.createElement("p");
        document.getElementById("data_display_score").appendChild(data_score);
        let node_score = document.createTextNode(list[x].score);
        data_score.appendChild(node_score); 
    }
}

// make the highscore information visible 
function display_highscore(){
    document.getElementById("data_display_name").innerHTML = "";
    document.getElementById("data_display_score").innerHTML = "";
    document.getElementById("main").style.visibility="hidden";
    document.getElementById("highscores").style.visibility="visible";
    read_highscore();
}



// If user wins game stores their name and score and displays congratulatory message
let remainingLetters = word.length;
    function user_input(value){
        for (i=0;i<word.length;i++){
            if (value == word[i]){
                 remainingLetters --;
            }
        }
        if (remainingLetters == 0){
            let name = prompt("Enter your name: ");
            console.log(name);
            console.log(score);
            write_database(score, name);
            let winner = confirm("Congratulations," + " " + name + "!" + " " + "The word is " + word.join(" ") + ". " + "Your score is" + " " + score + ".");
                if (winner == true){
                    display_highscore();
                    }
                    else{
                    display_highscore();
                    }
        }
}    
           
// calculates the user's score for correct and incorrect guesses
function word_score(value){
    count = 0
    let decrease = true
    for (i=0;i<word.length;i++){
        if (value == word[i]) {
            count ++;
            score ++;
            decrease = false
        }
    }
    if (count < 1) {
        score = score -1
    }
    return decrease
}

// calculates the user's lives lost for incorrect guesses and displays message if user losses/restarts game
function live_score(value){
    if (word_score(value)) {
        lives = lives - 1;
        console.log(lives);
    }
    if (lives==0){ //When user hits 0 lives, alert will pop-up, user can press ok or cancel to restart.
        let okay = confirm("You have 0 lives. Game Over! Press OK to continue!")
        if (okay == true) {
            start_game();
        }
        if (okay == false){
            start_game();
        }
    }
}
     
// creates the buttons and performs game mechanics per button click
function Create_Buttons (x) {
    for (i = 0; i < x; i++){
        let btn = document.createElement("BUTTON");
            if(i < 9){
                document.querySelector("#keyboard #row_one").appendChild(btn);
                btn.innerHTML=letter(i);
                btn.setAttribute('value',letter(i));
                }else{
                    if(i > 9 && i < 19){
                        document.querySelector("#keyboard #row_two").appendChild(btn);
                        btn.innerHTML=letter(i);
                        btn.setAttribute('value',letter(i));
                        }else{
                            document.querySelector("#keyboard #row_three").appendChild(btn);
                            btn.innerHTML=letter(i);
                            btn.setAttribute('value',letter(i));
                        }   
                    }
            btn.onclick = function () {
                btn.style.visibility='hidden';
                console.log("Button " + " " + btn.value + " " + " was clicked!" );
                dashes(btn.value);
                live_score(btn.value);
                user_input(btn.value);
                document.getElementById('score').innerHTML= "Your Score is" + " " + score;
                document.getElementById('lives').innerHTML = "Remaining Lives:" + " " + lives;
                } 
        }
    }
// creates the letters in the order i
function letter (n) {
    return String.fromCharCode(n+65)
}



Create_Buttons(26);

// restarts game when user clicks on the end game button (picks new word, resets score to 0 and lives to 7)
function start_game(){
    word = split_word();
    lives = 7;
    score = 0;
    remainingLetters = word.length;
    document.getElementById("main").style.visibility="visible";
    document.getElementById("highscores").style.visibility="hidden";
    document.getElementById('score').innerHTML= "Your Score is" + " " + score;
    document.getElementById('lives').innerHTML = "Remaining Lives:" + " " + lives;
    num_lines = [];
    initiate_dashes();
    document.getElementById("row_one").innerHTML=" ";
    document.getElementById("row_two").innerHTML=" ";
    document.getElementById("row_three").innerHTML=" ";
    Create_Buttons(26);
}

//buttons to restart the game
document.getElementById("endgame").onclick = start_game;
document.getElementById("game").onclick = start_game;
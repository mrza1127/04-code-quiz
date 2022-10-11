// declaring all the screens as constants
const startQuizScreenEl = document.getElementById("start-quiz-screen");
const quizScreenEl = document.getElementById("quiz-screen");
const resultScreenEl = document.getElementById("result-screen");
const completeScreenEl = document.getElementById("complete-screen");
const highScoresScreenEl = document.getElementById("high-scores-screen");

// declaring html elements and corresponding buttons (if applicable)
const headerEl = document.getElementById("header");
const viewHighScoresEl = document.getElementById("view-high-scores");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start-quiz-btn");
const goBackBtn = document.getElementById("go-back-btn");
const clearHighScoresBtn = document.getElementById("clear-high-scores-btn");
const questionEl = document.getElementById("question");
const answersListEl = document.getElementById("answers-list");
const resultEl = document.getElementById("result");
const finalScoreEl = document.getElementById("final-score");
const highScoreFormEl = document.getElementById("high-score-form");
const initialsEl = document.getElementById("initials");
const highScoresListEl = document.getElementById("high-scores-list");

// timer for allowed time on questions
const quizTime = 60;

// declaring an array of multiple choice questions as objects
const allQuestions = [
    {
        q: "Commonly used data types DO NOT include:",
        a: ["strings", "booleans", "alerts", "numbers"],
        c: "alerts",
    },
    {
        q: "Arrays in JavaScript can be used to store _______.",
        a: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        c: "all of the above",
    },
    {
        q: "The condition in an if / else statement is enclosed with ________.",
        a: ["quotes", "curly brackets", "parenthesis", "square brackets"],
        c: "parenthesis",
    },
    {

        q: "A very useful tool used during development and debugging for printing content to the debugger is:",
        a: ["JavaScript", "terminal/bash", "for loops", "console.log"],
        c: "console.log",
    },
    {
        q: "String values must be enclosed within _______ when being assigned to variables.",
        a: ["commas", "curly brackets", "quotes", "parenthesis"],
        c: "quotes",
    }
];

// declaring global variables 

//
var timeLeft = quizTime;

var timeInterval;

// tracking current question number
var questionNumber = 0;

//tacking number of answer choices for current question
var answerChoicesCount;

// keeping score
var score = 0;

//declaring an array to store the high score list in local storage
var highScoresLS = [];

// DISPLAYS

var displayQuiz = function () {
    startQuizScreenEl.style.display = "none";
    quizScreenEl.style.display = "initial";
};

// displaying result for each question after answering
var displayResult = function () {
    resultScreenEl.style.display = "initial";
};

//hiding result for each question before answering
var hideResult = function () {
    resultScreenEl.style.display = "none";
};

// displaying the completion screen
var displayComplete = function () {
    headerEl.style.visibility = "visible";
    startQuizScreenEl.style.display = "none";
    quizScreenEl.style.display = "none";
    highScoresScreenEl.style.display = "none";
    completeScreenEl.style.display = "initial";
    // writing the final score
    finalScoreEl.textContent = "Your final score is " + score + ".";
};

// displaying high scores screen
var displayHighScoresHandler = function () {
    headerEl.style.visibility = "hidden";
    startQuizScreenEl.style.display = "none";
    quizScreenEl.style.display = "none";
    completeScreenEl.style.display = "none";
    highScoresScreenEl.style.display = "initial";
    // calls function to get and display updated high scores from localStorage
    getHighScores();
};

// turning off the high scores screen after starting the quiz screen
var displayStartQuizHandler = function () {
    headerEl.style.visibility = "visible";
    highScoresScreenEl.style.display = "none";
    startQuizScreenEl.style.display = "initial";
    // resetting the timer
    clearInterval(timeInterval);
    // resetting quiz time 
    timeLeft = quizTime;
    // writing the quiz time to the corresponding document element
    timerEl.textContent = timeLeft;
};


// declaring a function to reset score, quiz, and timer. displaying quiz screen
var startQuizHandler = function () {
    // resetting score to 0
    score = 0;
    // resetting score to first question
    questionNumber = 0;

    displayQuiz();
    countdown();
    nextQuestion();
};

// quiz timer countdown
var countdown = function () {
    timeInterval = setInterval(function () {
        if (timeLeft > 0) {
            timerEl.textContent = timeLeft;
            timeLeft--;
        } else {
            timerEl.textContent = "0";
            clearInterval(timeInterval);
            // ending quiz when the timer is up
            displayComplete();
        }
        // timer interval in milliseconds
    }, 1000);
};

// displaying questions and answer choices 
var nextQuestion = function () {
    // hiding the result of previous question until a choice is made for the current question
    hideResult();

    // clearing the previous answer choices list
    answersListEl.textContent = "";

    // writing a new question
    questionEl.innerHTML = allQuestions[questionNumber].q;

    // finding the number of possible answers to the new question
    answerChoicesCount = allQuestions[questionNumber].a.length;

    // writing answer choices for the question
    for (let i = 0; i < answerChoicesCount; i++) {
        const answerChoiceEl = document.createElement("li");
        answerChoiceEl.textContent = allQuestions[questionNumber].a[i];
        answersListEl.appendChild(answerChoiceEl);
        answerChoiceEl.addEventListener("click", result);
    }
};

// checking the result of each answer
var result = function () {
    // removing event listeners to avoid more than one answer to the same question 
    for (let i = 0; i < answerChoicesCount; i++) {
        answersListEl.childNodes[i].removeEventListener("click", result);
    }

    // highlighting chosen answer element
    event.target.style.backgroundColor = "#bd60e7";

    // getting text content of chosen answer
    var chosenAnswer = event.target.textContent;

    // indentifying correct answer from the list of answer choices
    var correctAnswer = allQuestions[questionNumber].c;

    // comparing the results of chosenAnswer and correctAnswer 
    if (chosenAnswer === correctAnswer) {
        resultEl.textContent = "Correct!";
        // adding 10 points to the score when correct
        score += 10;
    } else {
        resultEl.textContent = "Incorrect!";
        // taking 10 secs away from timer if incorrect
        timeLeft -= 10;
    }

    //calling function to turn on the display of answer 
    displayResult();

    // calling function to check whether to continue quiz or end (last question)
    checkQuizEnd();
};

// display the result for 2 seconds, 
var checkQuizEnd = function () {
    questionNumber++;

    // of more questions are left, then display the next question
    if (questionNumber < allQuestions.length) {
        setTimeout(function () {
            nextQuestion();
        }, 2000);
        // ending the test
        timerEl.textContent = timeLeft;
        clearInterval(timeInterval);
    }
};

// sorting high score list by score
var sortHighScores = function (highScoresLS) {
    highScoresLS.sort((a, b) => (a.scoreKey <b.scoreKey ? 1 : -1));
    return highScoresLS;
};

// storing the input initials and score in local storage 
var setScore = function (event) {
    // preventing intials from triggering a refresh
    event.preventDefault();

    var initials = initialsEl.value; 

    // storing high score as an object
    var highScore = {
        initialsKey: initials,
        scoreKey: score
    };

    // checking local storage for any high score list
    highScoresLS = JSON.parse(localStorage.getItem("highScores"));
    if (score===0) {

    } else if (score > 0 && !highScoresLS) {
        highScoreLS = [highScore];
    } else {
        highScoresLS.unshift(highScore);

        sortHighScores(highScoresLS);
        if (highScoresLS.length === 6) {
            highScoresLS.pop();
        }
    }

    // updating the high scores list in LS after adding current score
    localStorage.setItem("highScores", JSON.stringify(highScoresLS));

    displayHighScoresHandler();
};

// retrieving high scores and input initials from LS
var getHighScores = function () {
    // resetting high score elements
    highScoresListEl.textContent = "";

    // getting update of high scores from LS
    highScoresLS = JSON.parse(localStorage.getItem("highScores"));

    // create html elements for high scores
    for (let i=0; i < 5; i++) {
        var highScoresListItemEl = document.createElement("li");
        if (highScoresLS !== null && i < highScoresLS.length) {
            highScoresListEl.textContent =
            highScoresLS[i].initialsKey + " - " + highScoresLS[i].scoreKey;
        } else {
            highScoresListItemEl.textContent = "";
        }
        highScoresListEl.appendChild(highScoresListItemEl);
    }
};

// clearing high scores in LS
var clearHighScoreHandler = function () {
    localStorage.removeItem("highScores");
    getHighScores();
};


// event handlers
// calling function to start quiz
startBtn.onclick = startQuizHandler; 

// calling function to display next question
questionEl.onclick = nextQuestion;

// triggers saving initials and score
highScoreFormEl.addEventListener("submit", setScore);

// displaying high scores screen
viewHighScoresEl.onclick = displayHighScoresHandler;

// triggers clearing high scores list
clearHighScoresBtn.onclick = clearHighScoreHandler;

// reset quiz from the high scores screen
goBackBtn.onclick = displayStartQuizHandler;


//========================
// Game Object ===========
//========================

const Game = {
  // Control flow for question difficulty
  question: 0,
  // Updates money tracker
  money: '',
  // Updates timer bar
  time: 0,
  // Control switch for pausing timer bar
  pauseTimer: false,
  // Control flow for progress bar
  // Progress Bar functionality inspired by https://codepen.io/volt122/pen/wbLrXm
  progress: 0,
  // Null variable to clearInterval on new question
  timer: 0,
  // Pulled to questionGetter to get random category from the API and filter out unwanted categories
  category: ["9", "10", "11", "12", "14", "17", "18", "20", "21", "22", "23", "24", "25", "26", "27"],

  // Starts game on page load
  start: () => {
    const $modal = $('#modal')
    $modal.show()
    $closeBtn = $('#close')
    $closeBtn.on('click', ()=> {
      $modal.hide()
      questionGetter()
      
    })
  },

  // Checks if user wants to continue
  // Calls questionGetter() if yes
  // Alert "Thanks for playing" if no
  keepGoing: () => {
    const $continue = $('<div>').attr('id', 'continue').html(`
      <div id="continue-text">
        <h5>You currently have ${Game.money}. Do you want to keep going for the million?</h5>
        <div id="continue-footer">
          <button class="continue-buttons" id="more">I want to be a millionaire!</button>
          <button class="continue-buttons" id="done">I'll take the money Reej</button>
        </div>
      </div>
    `).insertAfter('#modal')
    $continue.show()
    $('.continue-buttons').on('click', (e) => {
      if ($(e.target).text() === "I want to be a millionaire!") {
        $continue.remove()
        questionGetter()
      } else if ($(e.target).text() === "I'll take the money Reej"){
        $continue.remove()
        alert("Thanks for playing!")
        ('.container').empty()
      }
    })
  },

  // Populates the DOM with final answer modal
  finalAnswer: () => {
    const $final = $('<div>').attr('id', 'final-answer').html(`
    <div id="final-answer-text">
      <h5>Is that your final answer?</h5>
      <div id="final-answer-footer">
        <button class="final-answer-buttons" id="yes" href="#">Final Answer</button>
        <button class="final-answer-buttons" id="no" href="#">On second thought...</button>
      </div>
    </div>
    `).insertAfter('#modal')
    $final.show()
  },

  // Populates the DOM with timer bar and starts on each new question
  // If time runs out ends game
  // Sets interval to keep progressing the timer bar
  // generateQ clears the interval if correct
  startTimer: () => {
    $('<div>').addClass('progress').attr('id', 'timer-bar').html(`
    <div id="timer" class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
  `).insertAfter('#score-bar')
    Game.pauseTimer = false;
    Game.timer = setInterval(timeIncrease, 300);
    function timeIncrease() {
      if (Game.pauseTimer === false) {
        if (Game.time >= 100) {
          clearInterval(Game.timer);
          Game.endGame()
        } else {
          Game.time++;
          $('#timer').width(Game.time + '%');
        }
      } 
    }
  },

  // On correct answer updates Game and clears the DOM for the next question
  checker: () => {
    if (Game.question !== 15) {
      if (Game.question === 1) {
        Game.money = '$500'
        $('#first').css('color', 'gold')
      } else if (Game.question === 2) {
        Game.money = '$1,000'
        $('#second').css('color', 'gold')
      } else if (Game.question === 3) {
        Game.money = '$2,000'
        $('#third').css('color', 'gold')
      } else if (Game.question === 4) {
        Game.money = '$3,000'
        $('#fourth').css('color', 'gold')
      } else if (Game.question === 5) {
        Game.money = '$5,000'
        $('#fifth').css('color', 'gold')
      } else if (Game.question === 6) {
        Game.money = '$7,500'
        $('#sixth').css('color', 'gold')
      } else if (Game.question === 7) {
        Game.money = '$10,000'
        $('#seventh').css('color', 'gold')
      } else if (Game.question === 8) {
        Game.money = '$15,000'
        $('#eighth').css('color', 'gold')
      } else if (Game.question === 9) {
        Game.money = '$25,000'
        $('#ninth').css('color', 'gold')
      } else if (Game.question === 10) {
        Game.money = '$50,000'
        $('#tenth').css('color', 'gold')
      } else if (Game.question === 11) {
        Game.money = '$75,000'
        $('#eleventh').css('color', 'gold')
      } else if (Game.question === 12) {
        Game.money = '$150,000'
        $('#twelfth').css('color', 'gold')
      } else if (Game.question === 13) {
        Game.money = '$250,000'
        $('#thirteenth').css('color', 'gold')
      } else if (Game.question === 14) {
        Game.money = '$500,000'
        $('#fourteenth').css('color', 'gold')
      } 
      Game.progress += 6.67
      Game.time = 0
      clearInterval(Game.timer)
      $('#money').text(`${Game.money}`)
      $('#timer').width('0%')
      $('#score').width(Game.progress + '%')
      $('h4').remove()
      $('#timer-bar').remove()
      $('.question').empty()
      Game.keepGoing()
    } else {
      Game.money = '$1,000,000'
      $('#fifteenth').css('color', 'gold').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
      $('.container').empty()
      $('#money').text(`${Game.money}`)
      $('<h1>').text('You\'re a Millionaire!').appendTo('.container')
    }
  },

  // Ends game on incorrect answer or time up
  endGame: () => {
    $('.container').empty()
    $('<h1>').text('YOU LOSE!').css('margin', 'auto').css('margin-top', '25%').addClass('lose').appendTo('.container')
    $('<a>').text('Play Again').addClass('btn btn-primary').attr('href', 'index.html').attr('id', 'playagain').insertAfter('.lose')
  },

}


//========================
// Question Class ========
//========================

class Question {
  constructor (question, correct, incorrectArray) {
    this.question = question;
    this.correct = correct;
    this.incorrectArray = incorrectArray;
    this.questionArray = [correct, incorrectArray[0], incorrectArray[1], incorrectArray[2]];
  }

  // Produces random order of questions from the API
  // Fisher-Yates shuffle algorithm from: http://sedition.com/perl/javascript-fy.html & https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  // Modified to test and understand functionality
  shuffle () {
    let currentIndex = this.questionArray.length;
    let tempValue;
    let randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      tempValue = this.questionArray[currentIndex];
      this.questionArray[currentIndex] = this.questionArray[randomIndex];
      this.questionArray[randomIndex] = tempValue;
    }
    return this.questionArray
  }

  // Calls shuffle on a new instance of Question from questionGetter and populates DOM
  // Adds timer, question, and answers with event handlers
  generateQ () {
    this.shuffle()
    $('<h4>').text(this.question.replace(/&quot;|&ldquo;|&eacute;|&#039;/g, '')).addClass("col-lg-10 col-md-10 col-sm-12 col-xs-12").appendTo('.question-header')
    for (let i = 0; i < this.questionArray.length; i++) {
      if(this.questionArray[i] === this.correct) {
        $('<div>').addClass("col-lg-6 col-md-6 col-sm-8 col-xs-12").html(`
      <div id="correct" class="answer">${this.questionArray[i]}</div>
      `).appendTo('.question')
      } else if (this.questionArray[i] === this.incorrectArray[0]) {
        $('<div>').addClass("col-lg-6 col-md-6 col-sm-8 col-xs-12").html(`
      <div id="dummy" class="answer">${this.questionArray[i]}</div>
      `).appendTo('.question')
      } else {
        $('<div>').addClass("col-lg-6 col-md-6 col-sm-8 col-xs-12").html(`
      <div class="answer wrong">${this.questionArray[i]}</div>
      `).appendTo('.question')
      }
    }
    Game.startTimer()
    $('.lifeline').on('click', (en) => {
      if ($(en.target).text() === "Timeout") {
        Game.pauseTimer = true;
        $('#timeout').remove()
      } else if ($(en.target).text() === "50/50") {
        $('.wrong').remove()
        $('#fifty').remove()
      }
    })
    $('.answer').on('click', (e) => {
      Game.finalAnswer()
      $('.final-answer-buttons').on('click', (ev) => {
        if ($(ev.target).text() === 'On second thought...') {
          $('#final-answer').hide()
        } else if ($(ev.target).text() === 'Final Answer') {
          Game.pauseTimer = true;
          $('#final-answer').remove()
          if ($(e.target).attr('id') === 'correct') {
            // Flash effect from https://stackoverflow.com/questions/275931/how-do-you-make-an-element-flash-in-jquery
            $(e.target).css('background-color', '#85bb65').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
            setTimeout(Game.checker, 3000)
          } else {
            $(e.target).css('background-color', '#ff3333').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
            setTimeout(Game.endGame, 3000)
          }
        }
      })
    })    
  }

}

// getQuestion and questionGetter functions created with assistance from General Assembly TA Glenn Brown
// API call
const getQuestion = (apiUrl) => {
  $.ajax({
    url: apiUrl
  }).then((data) => {
    // console.log(data)
    const newQ = new Question(data.results[0].question, data.results[0].correct_answer,data.results[0].incorrect_answers)
    console.log(newQ)
    newQ.generateQ()
  })
}

// Game flow with API calls sorted for difficulty
const questionGetter = () => {
  let randomIndex = Math.floor(Math.random() *15)
  if (Game.question >= 0 && Game.question < 6) {
    getQuestion('https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple&category=' + Game.category[randomIndex]);
    Game.question += 1;
  } else if (Game.question >= 6 && Game.question < 11) {
    getQuestion('https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple&category=' + Game.category[randomIndex]);
    Game.question += 1;
  } else if (Game.question >= 11 && Game.question < 15) {
    getQuestion('https://opentdb.com/api.php?amount=1&difficulty=hard&type=multiple&category=' + Game.category[randomIndex]);
    Game.question += 1;
    console.log(Game.question)
  } else {
    alert("You won!")
  }
}



// Starts game on page load
$(() => {

  Game.start()

})





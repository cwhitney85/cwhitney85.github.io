// Progress Bar functionality inspired by https://codepen.io/volt122/pen/wbLrXm

// getQuestion and questionGetter functions created with assistance from General Assembly TA Glenn Brown
// Control flow for question difficulty
let counter = 1;
// Control flow for progress bar
let progress = 0;

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
  console.log(counter)
  if (counter >= 1 && counter < 4) {
    getQuestion('https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple');
    counter += 1;
    // console.log(counter)
    // questionGetter()
  } else if (counter >= 4 && counter < 8) {
    getQuestion('https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple')
    counter += 1;
    // console.log(counter)
    // questionGetter()
  } else if (counter >= 8 && counter <= 10) {
    getQuestion('https://opentdb.com/api.php?amount=1&category=9&difficulty=hard&type=multiple');
    counter += 1;
    console.log(counter)
    // questionGetter()
  } else {
    alert("You won!")
  }
}

//========================
// Game Object ===========
//========================

const Game = {
  gameOn: true,
  questions: 10,
  money: 0,
  isFinalAnswer: false,
  time: 0,
  pauseTimer: false,

  checker: () => {
    if (this.gameOn === true) {
      questionGetter()
    } else {
      alert("You lose!")
    }
  },

  start: () => {
    const $modal = $('#modal')
    $modal.show()
    $closeBtn = $('#close')
    $closeBtn.on('click', ()=> {
      $modal.hide()
      questionGetter()
      
    })
  },

  keepGoing: () => {
    const $continue = $('<div>').attr('id', 'continue').html(`
      <div id="continue-text">
        <h5>You currently have $${Game.money}. Do you want to keep going for the million?</h5>
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

  startTimer: () => {
    Game.pauseTimer = false;
    let timer = setInterval(timeIncrease, 300);
    function timeIncrease() {
      if (Game.pauseTimer === false) {
        if (Game.time >= 100) {
          clearInterval(timer);
          alert("Time's up!")
          Game.time = 0;
        } else {
          Game.time++;
          $('#timer').width(Game.time + '%');
          console.log(Game.time)
        }
      } 
    }
  }

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

  shuffle () {
    // Fisher-Yates shuffle algorithm from: http://sedition.com/perl/javascript-fy.html & https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    // Modified to test and understand functionality
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

  generateQ () {
    this.shuffle()
    $('<h4>').text(this.question).addClass('question-text').insertBefore('.question')
    for (let i = 0; i < this.questionArray.length; i++) {
      $('<div>').addClass("col-lg-6 col-md-6 col-sm-8 col-xs-12").html(`
      <div class="answer">${this.questionArray[i]}</div>
      `).appendTo('.question')
    }
    Game.startTimer()
    $('.answer').on('click', (e) => {
      Game.pauseTimer = true;
      Game.finalAnswer()
      $('.final-answer-buttons').on('click', (ev) => {
        if ($(ev.target).text() === 'On second thought...') {
          $('#final-answer').hide()
          Game.pauseTimer = false;
        } else if ($(ev.target).text() === 'Final Answer') {
          $('#final-answer').remove()
          if ($(e.target).text() === this.correct) {
            alert("Correct!")
            progress += 10
            Game.time = 0
            
            $('#timer').width('0%')
            $('#score').width(progress + '%')
            $('h4').remove()
            $('.question').empty()
            Game.keepGoing()
          } else {
            alert("WRONG!")
            $('.container').empty()
          }
        }
      })
    })    
  }

}


$(() => {

  Game.start()
  

})





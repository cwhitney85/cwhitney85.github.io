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
  // console.log(Game.question)
  if (Game.question >= 0 && Game.question < 6) {
    getQuestion('https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple');
    Game.question += 1;
    // console.log(Game.question)
    // questionGetter()
  } else if (Game.question >= 6 && Game.question < 11) {
    getQuestion('https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple')
    Game.question += 1;
    // console.log(Game.question)
    // questionGetter()
  } else if (Game.question >= 11 && Game.question < 15) {
    getQuestion('https://opentdb.com/api.php?amount=1&category=9&difficulty=hard&type=multiple');
    Game.question += 1;
    console.log(Game.question)
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
  question: 0,
  money: '',
  isFinalAnswer: false,
  time: 0,
  pauseTimer: false,
  progress: 0,

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
          // console.log(Game.time)
        }
      } 
    }
  },

  // cashCount: () => {
  //   let currentStack = $('#money').text()
  //   let numberStack = currentStack.replace('$', '')
  //   let moneyNumber = Game.money.replace('$', '')
  //   let newStack = parseInt(numberStack.replace(/,/g, ''))
  //   let newMoney = parseInt(moneyNumber.replace(/,/g, ''))
  //   while (newStack < newMoney) {
  //     $('#money').text(`$${newStack}`)
  //     newStack++
  //   }
  // },

  checker: () => {
    if (Game.question !== 15) {
      if (Game.question === 1) {
        Game.money = '$500'
      } else if (Game.question === 2) {
        Game.money = '$1,000'
      } else if (Game.question === 3) {
        Game.money = '$2,000'
      } else if (Game.question === 4) {
        Game.money = '$3,000'
      } else if (Game.question === 5) {
        Game.money = '$5,000'
      } else if (Game.question === 6) {
        Game.money = '$7,500'
      } else if (Game.question === 7) {
        Game.money = '$10,000'
      } else if (Game.question === 8) {
        Game.money = '$15,000'
      } else if (Game.question === 9) {
        Game.money = '$25,000'
      } else if (Game.question === 10) {
        Game.money = '$50,000'
      } else if (Game.question === 11) {
        Game.money = '$75,000'
      } else if (Game.question === 12) {
        Game.money = '$150,000'
      } else if (Game.question === 13) {
        Game.money = '$250,000'
      } else if (Game.question === 14) {
        Game.money = '$500,000'
      } 
      progress += 6.67
      Game.time = 0
      $('#money').text(`${Game.money}`)
      $('#timer').width('0%')
      $('#score').width(progress + '%')
      $('h4').remove()
      $('#timer-bar').remove()
      $('.question').empty()
      Game.keepGoing()
    } else {
      $('.container').empty()
      $('#money').text(`${Game.money}`)
      $('<h1>').text('You\'re a Millionaire!').appendTo('.container')
    }
  },

  endGame: () => {
    $('.container').empty()
    $('h1').text('YOU LOSE!').css('margin', '0 auto').appendTo('.container')
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
    $('<div>').addClass('progress').attr('id', 'timer-bar').html(`
      <div id="timer" class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    `).insertAfter('#score-bar')
    Game.startTimer()
    $('.answer').on('click', (e) => {
      Game.pauseTimer = true;
      Game.finalAnswer()
      $('.final-answer-buttons').on('click', (ev) => {
        if ($(ev.target).text() === 'On second thought...') {
          $('#final-answer').hide()
          
        } else if ($(ev.target).text() === 'Final Answer') {
          $('#final-answer').remove()
          if ($(e.target).text() === this.correct) {
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


$(() => {

  Game.start()
  

})





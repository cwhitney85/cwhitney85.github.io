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
    console.log(data)
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
    console.log(counter)
    // questionGetter()
  } else if (counter >= 4 && counter < 8) {
    getQuestion('https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple')
    counter += 1;
    console.log(counter)
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
    $('.answer').on('click', (e) => {
      $('#final-answer').show()
      $('#no').on('click', () => $('#final-answer').hide())
      $('#yes').on('click', (ev) => {
        ev.stopImmediatePropagation()
        $('#final-answer').hide()
        if ($(e.target).text() === this.correct) {
          alert("Correct!")
          progress += 10;
          $('.progress-bar').width(progress + '%')
          $('h4').remove()
          $('.question').empty()
          questionGetter()
        } else {
          alert("WRONG!")
          $('h4').remove()
          $('.question').empty()
        }
      })
    })
  }

}




$(() => {

  Game.start()
  

})





const Game = {
  gameOver: false,

}

class Question {
  constructor (question, correct, incorrectArray, questionArray) {
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
    $('<h4>').text(this.question).insertAfter('h1')
    for (let i = 0; i < this.questionArray.length; i++) {
      $('<div>').text(this.questionArray[i]).addClass('question').appendTo('.container')
    }
  }

}

// const EventHandlers = {
//   checker: (e) => {
//     if ($(e.target).text() === )
//   }
// }

class Level {
  constructor (questions) {
    this.questions = questions;
    this.level = [];
  }

  generateLevel () {
    for (let i = 0; i < this.questions.length; i++) {
      const newQuestion = new Question(this.questions[i].question, this.questions[i].correct_answer, this.questions[i].incorrect_answers)
      this.level.push(newQuestion)
    }
    
  }

  playLevel () {
    if (this.level.length > 0) {
      let newQ = this.level.shift()
      newQ.generateQ()
      $('.question').on('click', (event) => {
        if ($(event.target).text() === newQ.correct) {
          alert("Correct!")
          $('h4').remove()
          $('.container').empty()
          this.playLevel()
        } else {
          alert("WRONG!")
          $('h4').remove()
          $('.container').empty()
        }
      })
    } else {
      alert("You won!")
    }
  }

}


$(() => {
  // $.ajax({
  //   url: "https://opentdb.com/api.php?amount=1&category=9&type=multiple"
  // }).then((data) => {
  //   console.log(data)
  //   const newQuestion = new Question(data.results[0].question, data.results[0].correct_answer, data.results[0].incorrect_answers)
  //   newQuestion.generateQ();
  // })
  $.ajax({
    url: "https://opentdb.com/api.php?amount=3&category=9&difficulty=easy&type=multiple"
  }).then((data) => {
    console.log(data)
    const newLevel = new Level(data.results)
    console.log(newLevel)
    newLevel.generateLevel()
    console.log(newLevel.level)
    newLevel.playLevel()
  })

  
})





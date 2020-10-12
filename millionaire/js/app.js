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


$(() => {
  $.ajax({
    url: "https://opentdb.com/api.php?amount=1&category=9&type=multiple"
  }).then((data) => {
    console.log(data)
    const newQuestion = new Question(data.results[0].question, data.results[0].correct_answer, data.results[0].incorrect_answers)
    newQuestion.generateQ();
  })
  // $.ajax({
  //   url: "https://opentdb.com/api.php?amount=4&category=9&type=multiple",
  // }).then((data) => {
  //   console.log(data)
  //   const qArr = [data.results[0].correct_answer]
  //   $('<h3>').text(data.results[0].question).insertAfter('h1')
  //   for (let i = 0; i < data.results[0].incorrect_answers.length; i++){
  //     qArr.push(data.results[0].incorrect_answers[i])
  //   }
  //   shuffle(qArr);
  //   console.log(qArr);
  //   for (let i = 0; i < qArr.length; i++) {
  //     $('<div>').text(qArr[i]).addClass('question').appendTo('.container')
  //   }
  //   $('.question').on('click', (event) => {
  //     if ($(event.target).text() === data.results[0].correct_answer) {
  //       alert("Correct!")
  //       $('.container').empty()
  //     } else {
  //       alert("WRONG!")
  //     }
  //   })
  // })
})





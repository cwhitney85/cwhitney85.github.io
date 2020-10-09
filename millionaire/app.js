// Fisher-Yates shuffle algorithm from: http://sedition.com/perl/javascript-fy.html & https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Modified to test and understand functionality
function shuffle(array) {
  let currentIndex = array.length;
  let tempValue;
  let randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    tempValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = tempValue;
  }

  return array;
}


$(() => {
  $.ajax({
    url: "https://opentdb.com/api.php?amount=1&type=multiple",
  }).then((data) => {
    console.log(data)
    const qArr = [data.results[0].correct_answer]
    $('<h3>').text(data.results[0].question).insertAfter('h1')
    for (let i = 0; i < data.results[0].incorrect_answers.length; i++){
      qArr.push(data.results[0].incorrect_answers[i])
    }
    shuffle(qArr);
    console.log(qArr);
    for (let i = 0; i < qArr.length; i++) {
      $('<div>').text(qArr[i]).addClass('question').appendTo('.container')
    }
    $('.question').on('click', (event) => {
      if ($(event.target).text() === data.results[0].correct_answer) {
        alert("Correct!")
      } else {
        alert("WRONG!")
      }
    })
  })
})





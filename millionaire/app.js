
$(() => {
  $.ajax({
    url: "https://opentdb.com/api.php?amount=1&type=multiple",
  }).then((data) => {
    console.log(data)
    $('<h3>').text(data.results[0].question).insertAfter('h1')
    $('<div>').text(data.results[0].correct_answer).addClass('question').attr('id', 'correct').appendTo('.container')
    for (let i = 0; i < data.results[0].incorrect_answers.length; i++){
      $('<div>').text(data.results[0].incorrect_answers[i]).addClass('question').attr('id', 'wrong').appendTo('.container')
    }
    
  })
})
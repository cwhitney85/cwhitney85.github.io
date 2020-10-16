Who Wants to be a Millionaire? The classic gameshow recreated using HTML, CSS, JavaScript and jQuery.

On page load the user is greeted with a modal welcoming them and emploring them to play the game. Upon clicking "Let's go" the program immediately starts. Using a public trivia API, a random multiople choice question is populated into the DOM using jQuery. When the user clicks, they are asked if that is their final answer. If it is, a flash of green (correct) or red (incorrect) occurs and the game continues or ends. Each question is timed for 30 seconds and the user needs to get 15 correct to win.

The logic is mostly stored within a Game object that directs most of the game flow with the exception of a Question class that generates the questions and pushes them to the DOM and adds event listeners.

Styling and responsiveness was mostly done using the Bootstrap layout which worked well for the answer tiles on smaller screens. Some media queries were required to handle the money tracker. On large screens its a sidebar and on smaller screens it disappears and is replaced by a simple h1 and h2 tag.

Try for yourself:

https://cwhitney85.github.io/millionaire/index.html

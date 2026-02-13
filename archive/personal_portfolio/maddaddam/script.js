/* Goal
 *  Program should display text&paths and show next text & paths based on selected path.
 *
 * Approach
 *  Each story has 'id', 'text' 'paths'
 *  Each path has 'target' which should point to specific story id and 'text' as display value.
 *
 * Task left to owner
 *  As this structure is very very rough draft, it is very fragile
 *  So your task is build more solid structure and use this code as a rough guide.
 */


$(document).ready(function() {
  // jQuery targets
  var
    $storyContainer = $("#story-container"),
    $pathContainer = $("#path-container"),
    $imgContainer = $("#img-container");

  // Sample stories (hard coded!!)
  // This is just a data used to represent story&paths
  // You can probably make constructor for both story and path
  var stories = [
    {
      id: 0,
      text: "Hello, welcome to Extincathon. Please enter your name<span>_</span>",
      paths: [
        {target: 1, text: "RedNeckCrake"},
        {target: 2, text: "New"}
      ]
    },
    {
      id: 1,
      text: "Would you like to play with another Master or a Regular?",
      paths: [
        {target: 3, text: "Master"},
        {target: 2, text: "Regular"}
      ]
    },
    {
      id: 2,
      text: "Welcome RedNeckCrake to Extincathon! The game will be starting once you are matched with another player ... (assumed waiting time: #### seconds)",
      paths:[
        {target: 4, text: "No players found. Try again?"}
      ]
    },
    {
      id: 3,
      text: "Welcome RedNeckCrake. Adam named the living animals. MaddAddam names the dead ones. Do you want to play? <span>_</span>",
      paths:[
        {target: 4, text: "<a href='picture.html'>Yes</a>"},
        {target: 4, text: "No"}
      ]
    },
    {
      id: 4,
      text: "",
    },
  ]

  // Takes paths object and return it as button element with custom attribute.
  function getPathHTML(paths) {
    return paths.map(function(path) {
      return '<button class="path-btn" data-target=' + path.target + '>' + path.text + '</button>'
    }).concat();
  }

  // Takes story object and return paragraph element with story text.
  function getStoryHTML(story) {
    return '<p class="story-text">' + story.text + '</p>'
  }

  // Check if the story is ending story.
  function isEnded(story) {
    if (story.paths)
      return false;
    return true;
  }

  // Takes id and displays interactive story.
function displayInteractiveStory(stories, id) {
    var story = stories[id];

    var $story = $(getStoryHTML(story));
    $story.hide();
    $story.fadeIn(1000);

    $storyContainer.append($story);
    if (isEnded(story))
      $pathContainer.html('<button class="path-btn" data-target="replay">Replay?</button>');
    else
      $pathContainer.html(getPathHTML(story.paths));
  }

  // Event handler that will setup and invoke displayInteractiveStory()
  // Event delegation makes sure child element of $pathContainer listens to event.
  $pathContainer.click(function(event) {
    var $pathBtn = $(event.target);
    var nextStoryId = $pathBtn.attr('data-target');
    // You definitely want to refactor this part as it looks ugly and easily breaks.
    if (nextStoryId === 'replay') {
      $storyContainer.html('');
      $pathContainer.html('');
      displayInteractiveStory(stories, 0);
    } else
      displayInteractiveStory(stories, nextStoryId);
  });


  // Display initial story on inital render
  // story with id 0 refers to start of the story.
  displayInteractiveStory(stories, 0);
});

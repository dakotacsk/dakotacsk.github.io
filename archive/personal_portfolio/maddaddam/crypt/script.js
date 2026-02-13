$(document).ready(function() {
  // jQuery targets
  var
    $storyContainer = $("#story-container"),
    $pathContainer = $("#path-container"),
    $imgContainer = $("#img-container");

  var stories = [
    {
      id: 0,
      text: "<p>Last login: Mon Apr 18 10:23:59 on console <br>The default interactive shell is now zsh.<br>To update your account to use zsh, please run `chsh -s /bin/zsh`. <br>For more details, please visit https://support.maddaddam.com/kb/HT20<br>(base)<br><br></p><p style='color:#82FFFF';>crake<p>@</p><p style='color:#FF0000'>RedNeckCrake</p><p>-mbp:~$</p> ",
      paths: [
        {target: 1, text: "Explore Desktop"},
      ]
    },
    {
      id: 1,
      text: "<p>cd Desktop</p> <br></p><p style='color:#82FFFF';>crake<p>@</p><p style='color:#FF0000'>RedNeckCrake</p><p>-mbp:~$</p> <p>ls <br> craker_progress.jpg<br>oryx_files<br>rakunk_file.exe<br>key<br>neutronemail.exe<br>ubuntu.exe<br>theExecution.mp4<br>BlyssPlusPills_files<br>jimmy_files<br>Screenshot 2e10-05-23 10:30:56.png<br>Screenshot 2e10-07-18 00:56:12.png<br></p>",
      paths: [
        {target: 2, text: "BlyssPlusPills_files"},
        {target: 12, text: "jimmy_files"},
        {target: 19, text: "oryx_files"},
        {target: 24, text: "key"}
      ]
    },
    {
      id: 2,
      text: "<br><p style='color:#82FFFF';>crake<p>@</p><p style='color:#FF0000'>RedNeckCrake</p><p>-mbp:~$</p><p>cd BlyssPlusPills_files</p> <br></p><p style='color:#82FFFF';>crake<p>@</p><p style='color:#FF0000'>RedNeckCrake</p><p>-mbp:~$</p> <p>ls <br> <br> gene_v1.atcg<br>README.md <br>staff.csv</p>",
      paths: [
        {target: 3, text: "README.md"},
      ]
    },
    {
      id: 3,
      text: "<br><br><p style='color:#82FFFF';>crake<p>@</p><p style='color:#FF0000'>RedNeckCrake</p><p>-mbp:~$</p><p>open README.md <br> ENTER PASSWORD <br> hint: fridge magnets. </p>",
      paths: [
        {target: 4, text: "God has no religion."},
        {target: 5, text: "Where God is, Man is not."},
      ]
    },
    {
      id: 4,
      text: "<br> Imposter detected, lockdown mode activated.",
      paths: [
        {target: 4, text: "<a href='/../maddaddam/index.html'>Restart?<a>"},
      ]
    },
    {
      id: 5,
      text: "",
      paths: [
        {target: 6, text: "There are two moons, the one you can see and <br>         the one you can't"},
        {target: 4, text: "Aim for the moon. If you miss, you may hit a star."},
      ]
    },
    {
      id: 6,
      text: "",
      paths: [
        {target: 7, text: "Du musz dein Leben andern."},
        {target: 4, text: "You must change your life -- Peter Slotedjek"},
      ]
    },
    {
      id: 7,
      text: "",
      paths: [
        {target: 4, text: "We are ignorant at its most intelligent form."},
        {target: 8, text: "We understand more than we know."},
      ]
    },
    {
      id: 8,
      text: "",
      paths: [
        {target: 9, text: "I think, therfore."},
        {target: 4, text: "I think, therfore I am."},
      ]
    },
    {
      id: 9,
      text: "",
      paths: [
        {target: 10, text: "To stay human is to break a limitation."},
        {target: 4, text: "I have a dream."},
      ]
    },
    {
      id: 10,
      text: "",
      paths: [
        {target: 11, text: "Dream steals from its lair towards its prey."},
        {target: 4, text: "Dreams don't work unless you do."},
      ]
    },
    {
      id: 11,
      text: "<br> Congratulations. Access granted.",
      paths: [
        {target: 11, text: "<a href='README.html'>open README.md</a> <br><br><br><br>"},
      ]
    },
    {
      id: 12,
      text: "<br><p style='color:#82FFFF';>crake<p>@</p><p style='color:#FF0000'>RedNeckCrake</p><p>-mbp:~$</p><p>cd jimmy_files</p> <br></p><p style='color:#82FFFF';>crake<p>@</p><p style='color:#FF0000'>RedNeckCrake</p><p>-mbp:~$</p> <p>ls <br> <br> jimmy_emails.txt <br>jimmy_mom.txt <br>jimmy_oryx.txt</p>",
      paths: [
        {target: 13, text: "open jimmy_emails.txt"},
        {target: 15, text: "open jimmy_mom.txt"},
        {target: 17, text: "open jimmy_oryx.txt"},
      ]
    },
    {
      id: 13,
      text: "<br><br><p> What do you get when you mix a snowman and a wolfdog?</p>",
      paths: [
        {target: 4, text: "Woolf! Woolf!"},
        {target: 14, text: "Frostbite"},
      ]
    },
    {
      id: 14,
      text: "<br><br> <p style='color:#00bb00'>Access granted.</p>",
      paths: [
        {target: 14, text: "<a href='jimmy_emails.html'>Open jimmy_emails </a>"},
      ]
    },
    {
      id: 15,
      text: "<br><br><p> What is Jimmy's pet's name?</p>",
      paths: [
        {target: 16, text: "Killer"},
        {target: 4, text: "Chlorox"},
      ]
    },
    {
      id: 16,
      text: "<br><br> <p style='color:#00bb00'>Access granted.</p>",
      paths: [
        {target: 16, text: "<a href='jimmy_mom.html'>Open jimmy_mom.txt </a>"},
      ]
    },
    {
      id: 17,
      text: "<br><br> <p>A grey parrot and the subject of a thirty-year experiment</p>",
      paths: [
        {target: 18, text: "Alex"},
        {target: 4, text: "Dolly"},
      ]
    },
    {
      id: 18,
      text: "<br><br> <p style='color:#00bb00'>Access granted.</p>",
      paths: [
        {target: 16, text: "<a href='jimmy_oryx.html'>Open jimmy_oryx.txt </a>"},
      ]
    },
    {
      id: 19,
      text: "<br><p style='color:#82FFFF';>crake<p>@</p><p style='color:#FF0000'>RedNeckCrake</p><p>-mbp:~$</p><p>cd oryx_files</p> <br></p><p style='color:#82FFFF';>crake<p>@</p><p style='color:#FF0000'>RedNeckCrake</p><p>-mbp:~$</p> <p>ls <br> <br> PictureOfOryx.heic<br>oryx_bio.txt<br>oryx_contract.docx<br>oryx_travel_plans.csv</p>",
      paths: [
        {target: 20, text: "oryx_bio.txt"},
        {target: 22, text: "oryx_contract.docx"},
        // {target: 16, text: "oryx_travel_plans.csv"},
      ]
    },
    {
      id: 20,
      text: "<br><br><p>How do you stop a rakunk from smelling?</p>",
      paths: [
        {target: 4, text: "Hold its nose."},
        {target: 21, text: "It's a rakunk? they don't smell?"},
        {target: 4, text: "Neutralise its gas through genetic engineering."},
      ]
    },
    {
      id: 21,
      text: "<br><br> <p style='color:#00bb00'>Access granted.</p>",
      paths: [
        {target: 16, text: "<a href='oryx_bio.html'>Open oryx_bio.txt </a>"},
      ]
    },
    {
      id: 22,
      text: "<br><br><p>What car does a rakunk drive?</p>",
      paths: [
        {target: 4, text: "A Honba."},
        {target: 4, text: "A Texla."},
        {target: 23, text: "A Furrari."},
      ]
    },
    {
      id: 23,
      text: "<br><br> <p style='color:#00bb00'>Access granted.</p>",
      paths: [
        {target: 16, text: "<a href='oryx_contract.html'>Open oryx_contract.txt </a>"},
      ]
    },
    {
      id: 24,
      text: "<br><br> <p style='color:#00bb00'>Are you sure?</p>",
      paths: [
        {target: 24, text: "<a href='/../maddaddam/crypt/final_level/index.html'>Unlock</a>"},
        {target: 24, text: "<a href='index.html'>No</a>"},
      ]
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

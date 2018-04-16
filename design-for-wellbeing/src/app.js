// SDK Needs to create video and canvas nodes in the DOM in order to function
// Here we are adding those nodes a predefined div.
const divRoot = $("#affdex_elements")[0];
const width = 640;
const height = 480;
const faceMode = affdex.FaceDetectorMode.LARGE_FACES;
//Construct a CameraDetector and specify the image width / height and face detector mode.
const detector = new affdex.CameraDetector(divRoot, width, height, faceMode);
detector.detectAllEmotions();
//Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", _ => {
  //Display canvas instead of video feed because we want to draw the feature points on it
  $("#face_video_canvas").css("display", "block");
  $("#face_video").css("display", "none");
});

const renderCard = async (emotion) => {
  if (emotion !== "joy") return
  const recipeData = await fetch("data/recipes.json").then(r => r.json())
  //randomly pick a recipe for teh selected emotion
  const choices = recipeData[emotion] || []
  const recipe = choices[Math.floor(Math.random() * choices.length)]

  $("#recipe-title").text(recipe.title)
  $("#recipe-img").attr("src", recipe.link)
  $("#recipe-steps").html("")
  $.each(recipe.steps, i => {
    $("#recipe-steps").append(`<li> ${recipe.steps[i]} </li>`)
  })
}

const log = (node_name, msg) => {
  $(node_name).append("<span>" + msg + "</span><br />")
}

//function executes when Start button is pushed.
$('#start').click(() => {
  if (detector && !detector.isRunning) {
    $("#logs").html("");
    detector.start();
  }
})

//function executes when the Stop button is pushed.
$('#stop').click(() => {
  if (detector && detector.isRunning) {
    detector.removeEventListener();
    detector.stop();
  }
})

//function executes when the Reset button is pushed.
$('#reset').click(() => {
  if (detector && detector.isRunning) {
    detector.reset();
    $('#results').html("");
  }
})

//Add a callback to receive the results from processing an image.
//The faces object contains the list of the faces detected in an image.
//Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", (faces, image) => {
  $('#results').html("");
  if (faces.length > 0) {

    const faceEmos = faces[0].emotions
    delete faceEmos.valence
    delete faceEmos.engagement

    const emotion = Object
      .keys(faceEmos)
      .reduce((x, y) => faceEmos[x] > faceEmos[y] ? x : y)
      .toLowerCase()

    log('#results', "Emotions: " + emotion);
    renderCard(emotion)
    drawFeaturePoints(image, faces[0].featurePoints);
  }
});

//Draw the detected facial feature points on the image
const drawFeaturePoints = (img, featurePoints) => {
  const contxt = $('#face_video_canvas')[0].getContext('2d');

  const hRatio = contxt.canvas.width / img.width;
  const vRatio = contxt.canvas.height / img.height;
  const ratio = Math.min(hRatio, vRatio);

  contxt.strokeStyle = "#FFFFFF";
  for (let id in featurePoints) {
    contxt.beginPath();
    contxt.arc(featurePoints[id].x,
      featurePoints[id].y, 2, 0, 2 * Math.PI);
    contxt.stroke();
  }
}

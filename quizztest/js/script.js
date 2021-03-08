//Immediately Invoke Function Expression (IIFE)
(function () {
  // Functions
  function buildQuiz() {
    // variable to store the HTML output
    const output = [];

    // variable to store the HTML summary output
    const outputSummary = [];

    /* other way to write the following json.forEach
    for(let questionNumber = 0; questionNumber < json.length; questionNumber++) {
      currentQuestion = json[questionNumber]
    }
     */
    // for each question...
    json.forEach((currentQuestion, questionNumber) => {
      // variable to store the list of possible answers
      const answers = [];

      // and for each available answer...
      for (letter in currentQuestion.answers) {
        // ...add an HTML radio button
        answers.push(
          `<label>
              <input type="radio" name="question${questionNumber}" value="${letter}">
              ${letter} :
              ${currentQuestion.answers[letter]}
            </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
        `<div class="slide">
                <div class="question"> ${currentQuestion.question} </div>
                <div class="answers"> ${answers.join("")} </div>
                </div>`
      );

      outputSummary.push(`<li>${currentQuestion.question}</li>`);
    });
    console.info(outputSummary);

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join("");

    summaryContainer.innerHTML = `<ul>${outputSummary.join("")}</ul>`;
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll(".answers");

    const elementsSummaryContainer = summaryContainer.getElementsByTagName(
      "li"
    );

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    json.forEach((currentQuestion, questionNumber) => {
      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if (userAnswer === currentQuestion.correctAnswer) {
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        answerContainers[questionNumber].style.color = "#1dca1d";
        elementsSummaryContainer[questionNumber].style.color = "#1dca1d";
      }
      // if answer is wrong or blank
      else {
        // color the answers red
        answerContainers[questionNumber].style.color = "red";
        elementsSummaryContainer[questionNumber].style.color = "red";
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${json.length}`;
  }

  function showSlide(n) {
    slides[currentSlide].classList.remove("active-slide");
    slides[n].classList.add("active-slide");
    currentSlide = n;
    if (currentSlide === 0) {
      previousButton.style.display = "none";
    } else {
      previousButton.style.display = "inline-block";
    }
    if (currentSlide === slides.length - 1) {
      nextButton.style.display = "none";
      submitButton.style.display = "inline-block";
    } else {
      nextButton.style.display = "inline-block";
      submitButton.style.display = "none";
    }
  }

  function showNextSlide() {
    showSlide(currentSlide + 1);
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  //PAGE INDICATOR
  function setPageNumber() {
    const descr = document.getElementById("pagenumber");
    const selectedquestionindex =
      currentSlide + 1; /*because Arrays start counting at 0*/
    descr.innerHTML = `Question ${selectedquestionindex} of ${json.length}`;
  }

  //Variables
  const quizContainer = document.getElementById("quiz");
  const summaryContainer = document.getElementById("summary");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");

  //External JSON
  function Questions(url) {
    const request = new XMLHttpRequest();

    request.overrideMimeType("application/json");
    request.open("GET", url, false);
    request.send();

    if (request.readyState === 4 && request.status === 200)
      return request.responseText;
  }

  // An example using ipify api (An IP Address API)
  const json = JSON.parse(
    Questions("https://www.json-generator.com/api/json/get/cfJMtaNoqG?indent=2")
  );

  // display quiz right away
  buildQuiz();

  // Pagination, next and previous buttons
  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  // Show the first slide
  showSlide(currentSlide);

  // Event listeners
  submitButton.addEventListener("click", showResults, setPageNumber);
  previousButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);
})();

// JavaScript
const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");

const startBtn = document.querySelector(".start");
const numQuestions = document.querySelector("#num-questions");
const category = document.querySelector("#category");
const difficulty = document.querySelector("#difficulty");
const timePerQuestion = document.querySelector("#time");

const quiz = document.querySelector(".quiz");
const startScreen = document.querySelector(".start-screen");
const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");

const endScreen = document.querySelector(".end-screen");
const finalScore = document.querySelector(".final-score");
const totalScore = document.querySelector(".total-score");
const restartBtn = document.querySelector(".restart");

let questions = [],
    score = 10,
    currentQuestion = 0,
    time = 30,
    timer;

// Update progress bar and text
const progress = (val) => {
  const percent = (val / time) * 100;
  progressBar.style.width = `${percent}%`;
  progressText.textContent = val;
};

// Start quiz
startBtn.addEventListener("click", () => {
  const num = numQuestions.value;
  const cat = category.value;
  const diff = difficulty.value;

  time = parseInt(timePerQuestion.value);
  fetch(`https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`)
    .then(res => res.json())
    .then(data => {
      questions = data.results;
      currentQuestion = 0;
      score = 0;
      startScreen.classList.add("hide");
      quiz.classList.remove("hide");
      showQuestion();
    });
});

// Show each question
function showQuestion() {
  clearInterval(timer);
  const q = questions[currentQuestion];
  const answers = [...q.incorrect_answers, q.correct_answer];
  answers.sort(() => Math.random() - 0.5);

  document.querySelector(".question").innerHTML = q.question;
  document.querySelector(".number").innerHTML = `Question <span class="current">${currentQuestion + 1}</span> <span class="total">/${questions.length}</span>`;

  const wrapper = document.querySelector(".answer-wrapper");
  wrapper.innerHTML = "";
  answers.forEach((ans) => {
    const div = document.createElement("div");
    div.classList.add("answer");
    div.innerHTML = `
      <span class="text">${ans}</span>
      <span class="checkbox"><i class="fas fa-check"></i></span>`;
    div.addEventListener("click", () => {
      if (!div.classList.contains("checked")) {
        document.querySelectorAll(".answer").forEach(a => a.classList.remove("selected"));
        div.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
    wrapper.appendChild(div);
  });

  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
  submitBtn.disabled = true;
  startTimer(time);
}

// Timer
function startTimer(seconds) {
  let t = seconds;
  progress(t);
  timer = setInterval(() => {
    t--;
    progress(t);
    if (t < 0) {
      clearInterval(timer);
      checkAnswer();
    }
  }, 1000);
}

// Check answer
submitBtn.addEventListener("click", checkAnswer);

function checkAnswer() {
  clearInterval(timer);
  const selected = document.querySelector(".answer.selected");
  const correct = questions[currentQuestion].correct_answer;

  document.querySelectorAll(".answer").forEach((ans) => {
    ans.classList.add("checked");
    const text = ans.querySelector(".text").textContent;
    if (text === correct) {
      ans.classList.add("correct");
    } else if (ans.classList.contains("selected")) {
      ans.classList.add("wrong");
    }
  });

  if (selected && selected.querySelector(".text").textContent === correct) {
    score++;
  }

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
}

// Go to next question
nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

// Show final score
function showScore() {
  quiz.classList.add("hide");
  endScreen.classList.remove("hide");
  finalScore.textContent = score;
  totalScore.textContent = `/${questions.length}`;
}

// Restart
restartBtn.addEventListener("click", () => {
  window.location.reload();
});



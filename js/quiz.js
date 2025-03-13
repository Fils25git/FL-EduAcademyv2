document.addEventListener("DOMContentLoaded", function () {
    let questionText = document.getElementById("question-text");
    let answerContainer = document.getElementById("answers");
    let nextButton = document.getElementById("next-question");

    // Get the part number from the URL
    let urlParams = new URLSearchParams(window.location.search);
    let partNumber = urlParams.get("part");

    // Example questions for each part (can be expanded)
    const quizzes = {
        "1": [
            {
                question: "What is reproduction?",
                answers: ["A. The process of making food", "B. The process of producing offspring", "C. The process of breathing"],
                correct: 1
            },
            {
                question: "Which type of reproduction involves two parents?",
                answers: ["A. Asexual", "B. Sexual", "C. Budding"],
                correct: 1
            }
        ],
        "2": [
            {
                question: "Which organ produces sperm in males?",
                answers: ["A. Ovaries", "B. Testes", "C. Uterus"],
                correct: 1
            }
        ]
    };

    let currentQuestionIndex = 0;
    let score = 0;
    let questions = quizzes[partNumber];

    if (!questions) {
        questionText.innerText = "No quiz found!";
        return;
    }

    function loadQuestion() {
        let question = questions[currentQuestionIndex];
        questionText.innerText = question.question;
        answerContainer.innerHTML = "";

        question.answers.forEach((answer, index) => {
            let btn = document.createElement("button");
            btn.innerText = answer;
            btn.classList.add("answer-btn");
            btn.addEventListener("click", () => checkAnswer(index));
            answerContainer.appendChild(btn);
        });
    }

    function checkAnswer(selectedIndex) {
        let correctIndex = questions[currentQuestionIndex].correct;
        if (selectedIndex === correctIndex) {
            score++;
        }
        nextButton.disabled = false;
    }

    nextButton.addEventListener("click", function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
            nextButton.disabled = true;
        } else {
            localStorage.setItem("quiz-score-" + partNumber, score);
            window.location.href = `quiz-results.html?part=${partNumber}&score=${score}`;
        }
    });

    loadQuestion();
});

const questions = [
    {
        question: "How frequently do you experience sleep disturbances?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How often do you notice changes in your appetite?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How frequently do you feel fatigued or low on energy?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How often do you feel worthless or experience excessive guilt?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How frequently do you have difficulty concentrating?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How often do you experience physical agitation?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How frequently do you have thoughts of self-harm or suicide?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How often do you have issues with sleeping?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How frequently do you feel aggressive?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How often do you experience panic attacks?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How frequently do you feel hopeless?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How often do you feel restless?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    },
    {
        question: "How frequently do you lack energy?",
        options: ["Never", "Always", "Often", "Rarely", "Sometimes", "Not at all"]
    }
];
let currentQuestionIndex = 0;
const totalQuestions = questions.length;
const answers = new Array(totalQuestions).fill(null);

const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');

function showQuestion() {
    const questionData = questions[currentQuestionIndex];
    questionContainer.innerHTML = `
        <div class="question">${questionData.question}</div>
        <ul class="options">
            ${questionData.options.map((option, index) => `
                <li>
                    <label>
                        <input type="radio" name="option" value="${index + 1}" />
                        ${option}
                    </label>
                </li>
            `).join('')}
        </ul>
        <button onclick="previousQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>&#11160;</button>
        <button onclick="nextQuestion()">&#11162;</button>
    `;
    questionContainer.classList.add('active');
}

function nextQuestion() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
        alert("Please select an option");
        return;
    }

    answers[currentQuestionIndex] = parseInt(selectedOption.value);

    currentQuestionIndex++;

    if (currentQuestionIndex < totalQuestions) {
        showQuestion();
    } else {
        showResult();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function showResult() {
    questionContainer.classList.remove('active');
    resultContainer.classList.add('active');
    
    // Send the answers to the backend to get the prediction
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        resultContainer.innerHTML = `
            <div class="result">
                <h2>Your Depression Level</h2>
                <p>${data.result}</p>
            </div>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        resultContainer.innerHTML = `
            <div class="result">
                <h2>Error</h2>
                <p>There was an error processing your request. Please try again.</p>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', showQuestion);
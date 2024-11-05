const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const explanationText = document.getElementById('explanation-text');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
const TOTAL_QUESTIONS = 90;
const NUM_LESSONS = 20;  // Tổng số bài học
const CORRECT_BONUS = 1;

// Hàm lấy giá trị của tham số URL
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

let currentLesson = getParameterByName('lesson');
if (!currentLesson) {
    currentLesson = 1;  // Nếu không có bài học nào, mặc định là bài học 1
}

let MAX_QUESTIONS;

async function loadQuestions() {
    if (currentLesson === 'test') {
        await loadQuestionsByLesson();  // Tải câu hỏi từ tất cả các bài học
    } else {
        await loadQuestionsFromFile(currentLesson);  // Tải câu hỏi từ bài học cụ thể
    }
    startGame();  // Bắt đầu trò chơi khi đã tải xong câu hỏi
}

// Hàm trộn mảng
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Hoán đổi vị trí
    }
    return array;
}

// Hàm tải câu hỏi từ một bài học cụ thể
async function loadQuestionsFromFile(lesson) {
    const jsonFile = `lesson${lesson}.json`;
    try {
        const res = await fetch(jsonFile);
        const loadedQuestions = await res.json();
        questions = loadedQuestions;
        MAX_QUESTIONS = questions.length;
    } catch (err) {
        console.error(`Error loading questions from ${jsonFile}:`, err);
    }
}

// Hàm tải câu hỏi từ tất cả bài học và chọn ngẫu nhiên 90 câu theo tỷ lệ
async function loadQuestionsByLesson() {
    questions = [];
    let totalQuestionsInLessons = 0;
    let lessonData = [];

    for (let lesson = 1; lesson <= NUM_LESSONS; lesson++) {
        const jsonFile = `lesson${lesson}.json`;
        try {
            const res = await fetch(jsonFile);
            const lessonQuestions = await res.json();
            lessonData.push({ lessonQuestions, count: lessonQuestions.length });
            totalQuestionsInLessons += lessonQuestions.length;
        } catch (err) {
            console.error(`Error loading questions from ${jsonFile}:`, err);
        }
    }

    lessonData.forEach(({ lessonQuestions, count }) => {
        const questionsToTake = Math.round((count / totalQuestionsInLessons) * TOTAL_QUESTIONS);
        shuffle(lessonQuestions);  // Trộn ngẫu nhiên câu hỏi của mỗi bài học
        questions.push(...lessonQuestions.slice(0, questionsToTake));  // Lấy số câu theo tỷ lệ
    });

    shuffle(questions);  // Trộn ngẫu nhiên tất cả câu hỏi đã chọn
    questions = questions.slice(0, TOTAL_QUESTIONS);  // Đảm bảo chỉ lấy đúng 90 câu
    MAX_QUESTIONS = questions.length;
}

// Bắt đầu trò chơi
function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        localStorage.setItem('currentLesson', currentLesson);
        localStorage.setItem('max_questions', MAX_QUESTIONS);
        setTimeout(() => {
            window.location.assign('end.html');
        }, 100);
        return;
    }

    questionCounter++;
    progressText.innerText = `Câu ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    let numbers = [1, 2, 3, 4];
    // shuffle(numbers);  // Trộn thứ tự lựa chọn

    choices.forEach((choice, index) => {
        const number = numbers[index];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
}

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth' // Thêm hiệu ứng cuộn mượt mà
    });
}


// Hàm mở popup
function openPopup() {
    document.getElementById('explanation-popup').style.display = 'block';
    document.getElementById('explanation-content').style.display = 'flex';
    explanationText.innerText = currentQuestion.explanation;
    scrollToBottom();
}

let globalClassToApply;
let selectedChoice;
// Hàm đóng popup
function closePopup() {
    document.getElementById('explanation-popup').style.display = 'none';
    document.getElementById('explanation-content').style.display = 'none';
    selectedChoice.parentElement.classList.remove(globalClassToApply);
    // Xóa lớp "correct" khỏi tất cả các lựa chọn
    choices.forEach((choice) => {
        choice.parentElement.classList.remove('correct');
    });
    getNewQuestion()
}

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        selectedChoice = e.target;
        const selectedAnswer = selectedChoice.innerText;

        globalClassToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        // Lưu câu hỏi và câu trả lời người dùng
        // userAnswers.push({
        //     question: currentQuestion.question,
        //     selectedAnswer: selectedAnswer,
        //     correctAnswer: currentQuestion.answer,
        //     explanation: currentQuestion.explanation,
        // });

        if (globalClassToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
            document.getElementById('explanation-content').style.backgroundColor = 'rgb(83, 170, 72)';
        } else {
            document.getElementById('explanation-content').style.backgroundColor = 'rgb(218, 96, 93)';
            // Tìm và tô xanh đáp án đúng
            choices.forEach((choice) => {
                if (choice.innerText === currentQuestion.answer) {
                    choice.parentElement.classList.add('correct');  // Tô xanh đáp án đúng
                }
            });
        }

        selectedChoice.parentElement.classList.add(globalClassToApply);

        // Hiển thị giải thích
        openPopup()
    });
});


function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}

// Gọi hàm loadQuestions khi bắt đầu game
loadQuestions();

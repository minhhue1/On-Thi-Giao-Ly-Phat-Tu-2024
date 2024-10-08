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
let availableQuesions = [];

// Hàm lấy giá trị của tham số URL
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

let currentLesson = getParameterByName('lesson'); // Lấy chương từ URL
if (!currentLesson) {
    currentLesson = 1;  // Nếu không có chương nào, mặc định là chương 1
}

let questions = [];
let MAX_QUESTIONS;

// Hàm tải câu hỏi theo chương
function loadQuestions(lesson) {
    const jsonFile = `lesson${lesson}.json`;  // Tải file JSON tương ứng
    fetch(jsonFile)
        .then((res) => res.json())
        .then((loadedQuestions) => {
            questions = loadedQuestions;
            MAX_QUESTIONS = questions.length;
            startGame();  // Bắt đầu trò chơi khi đã tải xong câu hỏi
        })
        .catch((err) => console.error(err));
}

// Gọi hàm tải câu hỏi khi bắt đầu game
loadQuestions(currentLesson);

//CONSTANTS
const CORRECT_BONUS = 1;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

let userAnswers = [];

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        localStorage.setItem('currentLesson', currentLesson);
        localStorage.setItem('max_questions', MAX_QUESTIONS);
        //go to the end page
        setTimeout(() => {
            // Chuyển đến trang end.html
            window.location.assign('end.html');
        }, 100);
    }
    questionCounter++;
    progressText.innerText = `Câu ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    // choices.forEach((choice) => {
    //     const number = choice.dataset['number'];
    //     choice.innerText = currentQuestion['choice' + number];
    // });

    // Hàm trộn mảng (shuffle array)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];  // Hoán đổi vị trí
        }
        return array;
    }

    // Tạo mảng chứa các số từ 1 đến 4
    let numbers = [1, 2, 3, 4];

    // // Trộn mảng để đảm bảo các số ngẫu nhiên và không trùng lặp
    // numbers = shuffle(numbers);

    // Đặt nội dung cho các lựa chọn dựa trên số ngẫu nhiên
    choices.forEach((choice, index) => {
        const number = numbers[index];  // Lấy số ngẫu nhiên từ mảng đã trộn
        choice.innerText = currentQuestion['choice' + number];  // Đặt nội dung cho lựa chọn
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

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
        userAnswers.push({
            question: currentQuestion.question,
            selectedAnswer: selectedAnswer,
            correctAnswer: currentQuestion.answer,
            explanation: currentQuestion.explanation,
        });

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

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};

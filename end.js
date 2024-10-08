const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const currentLesson = localStorage.getItem('currentLesson');

// Hiển thị điểm số cuối cùng
finalScore.innerText = mostRecentScore;

// Tìm phần tử link "Làm lại"
const retryBtn = document.querySelector('a[href="game.html"]');

// Cập nhật link "Làm lại" với lesson hiện tại
retryBtn.href = `game.html?lesson=${currentLesson}`;

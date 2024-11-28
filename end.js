const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const currentLesson = localStorage.getItem('currentLesson');
const currentRegion = localStorage.getItem('currentRegion');
const max_questions = localStorage.getItem('max_questions');

if (currentRegion) {
    const head = document.querySelector('head');
    
    // Tạo và thêm thẻ link cho app.css
    const appStylesheet = document.createElement('link');
    appStylesheet.rel = 'stylesheet';
    appStylesheet.href = `region/${currentRegion}/app.css`;
    head.appendChild(appStylesheet);

    // Tạo và thêm thẻ link cho game.css
    const endStylesheet = document.createElement('link');
    endStylesheet.rel = 'stylesheet';
    endStylesheet.href = `region/${currentRegion}/end.css`;
    head.appendChild(endStylesheet);
}

// Hiển thị điểm số cuối cùng
finalScore.innerText = mostRecentScore + "/" + max_questions;

// Hiển thị câu sai
const userAnswers = JSON.parse(localStorage.getItem('userAnswers'));
const incorrectAnswersContainer = document.getElementById('incorrectAnswers');

userAnswers.forEach((answer) => {
    if (answer.selectedAnswer !== answer.correctAnswer) {
        const questionElement = document.createElement('div');
        questionElement.classList.add('incorrect-answer');

        // Hiển thị câu hỏi
        const questionText = document.createElement('p');
        questionText.innerText = answer.question;

        // Hiển thị đáp án đã chọn (tô đỏ)
        const selectedAnswer = document.createElement('p');
        selectedAnswer.innerText = `Đáp án đã chọn: ${answer.selectedAnswer}`;
        selectedAnswer.classList.add('incorrect');

        // Hiển thị đáp án đúng (tô xanh lá)
        const correctAnswer = document.createElement('p');
        correctAnswer.innerText = `Đáp án đúng: ${answer.correctAnswer}`;
        correctAnswer.classList.add('correct');

        // Thêm các phần tử vào questionElement
        questionElement.appendChild(questionText);
        questionElement.appendChild(selectedAnswer);
        questionElement.appendChild(correctAnswer);

        // Thêm questionElement vào container
        incorrectAnswersContainer.appendChild(questionElement);
    }
});

// Cập nhật link "Làm lại" với lesson hiện tại
const retryBtn = document.querySelector('a[href="game.html"]');
retryBtn.href = `game.html?region=${currentRegion}&lesson=${currentLesson}`;

// Cập nhật link "Trang chủ" với region hiện tại
const homeBtn = document.querySelector('a[href="index.html"]');
homeBtn.href = `${currentRegion}.html`;

const nextLessonBtn = document.querySelector('a[href="game.html"]:last-of-type'); // Lấy nút "Bài tiếp theo"

// Danh sách tiêu đề bài học
const lessonTitles = {
    duchoa: {
        1: "Đạo Phật",
        2: "Lược Sử Đức Phật (từ Đản sanh đến Thành đạo)",
        3: "Lược Sử Đức Phật (từ Thành đạo đến Niết bàn)",
        4: "Quy Y Tam Bảo",
        5: "Ngũ Giới và Bát Quan Trai Giới",
        6: "Sám Hối; Thờ Phật, Cúng Phật, Lễ Phật; Tụng Kinh, Trì Chú, Niệm Phật; Ăn Chay",
        7: "Bổn Phận Phật Tử Tại Gia",
        8: "Vu Lan Bồn",
        9: "Vô Thường và Thiểu Dục Tri Túc",
        10: "Nhân Quả và Luân Hồi",
        11: "Thập Thiện; Tứ Nhiếp Pháp; Lục Hoà",
        12: "Tịnh Độ",
        13: "Khổ Đế",
        14: "Tập Đế",
        15: "Diệt Đế và Tứ Niệm Xứ",
        16: "Tứ Chánh Cần; Ngũ Căn Ngũ Lực; Thất Bồ Đề Phần; Bát Chánh Đạo",
        17: "Quán Bất Tịnh; Quán Nhân Duyên; Lục Độ",
        18: "Tứ Vô Lượng Tâm; Ngũ Minh",
        19: "Lịch Sử và Hiến Chương Phật Giáo Việt Nam"
    },
    district: {
        1: "Đạo Phật",
        2: "Lược Sử Đức Phật (từ Đản sanh đến Thành đạo)",
        3: "Lược Sử Đức Phật (từ Thành đạo đến Niết bàn)",
        4: "Quy Y Tam Bảo",
        5: "Ngũ Giới",
        6: "Sám Hối",
        7: "Thờ Phật, Cúng Phật, Lễ Phật",
        8: "Tụng Kinh, Trì Chú, Niệm Phật",
        9: "Ăn Chay",
        10: "Bát Quan Trai Giới",
        11: "Bổn Phận Phật Tử Tại Gia",
        12: "Vu Lan Bồn",
        13: "Vô Thường",
        14: "Thiểu Dục Tri Túc",
        15: "Nhân Quả",
        16: "Luân Hồi",
        17: "Thập Thiện",
        18: "Tứ Nhiếp Pháp",
        19: "Lục Hoà",
        20: "Tịnh Độ"
    },
    city: {
        1: "Tứ Diệu Đế",
        2: "Khổ Đế",
        3: "Tập Đế",
        4: "Diệt Đế",
        5: "Tứ Niệm Xứ",
        6: "Tứ Chánh Cần",
        7: "Tứ Như Ý Túc",
        8: "Ngũ Căn, Ngũ Lực",
        9: "Thất Bồ Đề Phần",
        10: "Chánh Chánh Đạo",
        11: "Quán Sổ Tức",
        12: "Quán Bất Tịnh",
        13: "Quán Từ Bi",
        14: "Quán Nhân Duyên",
        15: "Quán Giới Phân Biệt",
        16: "Lục Độ",
        17: "Tứ Vô Lượng Tâm",
        18: "Ngũ Minh",
        19: "Phật Giáo Việt Nam",
        20: "Hiến Chương"
    }
};

// Chuyển đổi `currentLesson` thành số nguyên
if (!isNaN(parseInt(currentLesson))) {
    const nextLesson = parseInt(currentLesson) + 1;
    const titles = lessonTitles[currentRegion];

    // Kiểm tra xem bài tiếp theo có tồn tại trong danh sách
    if (titles && titles[nextLesson]) {
        nextLessonBtn.href = `game.html?region=${currentRegion}&lesson=${nextLesson}`;
        nextLessonBtn.innerText = `Bài tiếp theo:\n ${titles[nextLesson]}`;
    } else {
        // Nếu không có bài tiếp theo, dẫn tới bài kiểm tra thử
        nextLessonBtn.href = `game.html?region=${currentRegion}&lesson=test`;
        nextLessonBtn.innerText = "Bài Kiểm Tra Thử";
    }
} else {
    // Ẩn nút nếu `currentLesson` không hợp lệ
    nextLessonBtn.style.display = "none";
}

// Danh sách video YouTube tương ứng với bài học
const lessonVideos = {
    duchoa: {

    },
    district: {

    },
    city: {
        1: { url: "https://www.youtube.com/embed/HAtEJQ0f7GM" },
        4: { url: "https://www.youtube.com/embed/Y8tiXqWmifc?si=ivAKWq098rY2HblQ" },
        5: { url: "https://www.youtube.com/embed/NjbV2uPJ-dg?si=9VmndFKFTHR_WUvp" },
        6: { url: "https://www.youtube.com/embed/6tqugmRLUcc?si=UuYc3RV5zUNiMsKZ" },
        7: { url: "https://www.youtube.com/embed/6M1UCYIw6q8?si=1wOkQ-T_NuGw3hfY" },
        8: { url: "https://www.youtube.com/embed/0T0Rl5lxLOY?si=h5bKA9lQdLOhR7og" },
        9: { url: "https://www.youtube.com/embed/3d5mg5SiBl8?si=oppuCvw81BBToBuB" },
        10:{ url: "https://www.youtube.com/embed/5D83HbXhDOo?si=rVW_4g868IW-RPVZ" },
        11:{ url: "https://www.youtube.com/embed/CmaNhHW-_Tw?si=ddcOUOTHv6-kDFmD" }
    }
};

if (!isNaN(parseInt(currentLesson))) {
    const lessonNumber = parseInt(currentLesson);
    const regionVideos = lessonVideos[currentRegion];

    if (regionVideos && regionVideos[lessonNumber]) {
        const videoData = regionVideos[lessonNumber];
        let videoSrc = videoData.url;

        // Kiểm tra và thêm start hoặc end nếu có
        if (videoData.start) {
            videoSrc += `?start=${videoData.start}`;
        }
        if (videoData.end) {
            videoSrc += videoData.start ? `&end=${videoData.end}` : `?end=${videoData.end}`;
        }

        // Tạo iframe
        const videoIframe = document.createElement('iframe');
        videoIframe.width = "560";
        videoIframe.height = "315";
        videoIframe.src = videoSrc;
        videoIframe.title = "YouTube video player";
        videoIframe.frameBorder = "0";
        videoIframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        videoIframe.allowFullscreen = true;

        videoContainer.appendChild(videoIframe);
    } else {
        videoContainer.style.display = "none";
    }
} else {
    videoContainer.style.display = "none";
}

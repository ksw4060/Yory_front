

// 푸터 가져오기

document.addEventListener("DOMContentLoaded", function () {

    // 푸터를 삽입할 위치
    var footerContainer = document.querySelector("#footer-container");

    if (footerContainer) {
        // base-footer.html 파일을 가져와서 푸터 위치에 삽입
        fetch("base-footer.html")
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(error => {
                console.error("Error fetching footer:", error);
            });
    }
});


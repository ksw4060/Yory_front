// 이미지 업로드 미리보기
function setThumbnail(event) {
    let reader = new FileReader();

    reader.onload = function (event) {
        let img = document.createElement("img");
        img.setAttribute("src", event.target.result);

        // 썸네일 크기 조절
        img.style.width = "550px"; // 너비 500px로 설정
        img.style.height = "auto"; // 높이 자동 설정
        document
            .querySelector("#imgthumbnail")
            .appendChild(img);
    };

    reader.readAsDataURL(event.target.files[0]);
}

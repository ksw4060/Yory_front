import { writePosting } from "./community-api.js";

// writePosting으로 게시글 작성
function handleSubmitButtonClick() {
    writePosting();
}

// 게시글 작성 버튼 클릭 시 handleSubmitButtonClick 호출
const submitBtn = document.getElementById("writeButton");
submitBtn.addEventListener("click", handleSubmitButtonClick);
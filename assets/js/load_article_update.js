import { getUpdeteArticle, findSelectedCategory, updateArticle } from "./article_update.js";


// 게시글 수정 페이지 로드 시 기존 게시글 정보를 입력
window.onload = async function loadUpdateArticle() {

    const article = await getUpdeteArticle()

    const titleInput = document.querySelector("#update_article_title");
    titleInput.value = article.title;

    $('#summernote').summernote('code', article.content);

    findSelectedCategory(article.category)

    if (article.image != null) {
        const filename = document.getElementById("current_article_image");
        filename.innerText = `현재 이미지: ${article.image.slice(23)}`;
    }
}

// 수정 버튼을 클릭 시 handleUpdateButtonClick 호출
const updateBtn = document.getElementById("update_article_button");
updateBtn.addEventListener("click", handleUpdateButtonClick);

// UpdatePosting으로 게시글 수정
function handleUpdateButtonClick() {
    updateArticle();
}
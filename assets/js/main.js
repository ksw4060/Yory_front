
const proxy = "https://api.bechol.com";
const token = localStorage.getItem("access");


// Article 리스트 GET 요청
async function getArticle() {
    const url = `${proxy}/articles/`;
    const response = await fetch(url, {
        method: "GET",
    });

    if (response.status == 200) {
        const response_json = await response.json();
        return response_json;
    } else {
        console.log("잠시 후 다시 시도해주세요");
    }
}


export async function viewArticleList() {

    // 게시글 전체 가져오기
    const articles = await getArticle();

    const article_list = document.getElementById("article-list");

    articles.forEach((article) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-4");

        // 디폴트 이미지
        let imagePath = "assets/images/headerimg.png";

        if (article.image) {
            imagePath = proxy + "/" + article.image;
        }

        // 게시글 카드 생성
        template.innerHTML = `<div class="card h-100">
                                <a style="cursor: pointer;" onclick="location.href='article_detail.html?id=${article.id}'"><img src="${imagePath}" class="card-img-top" alt="..."></a>
                                <div class="card-body">
                                    <h5 class="card-title">${article.title}</h5>
                                    <h6 class="card-text">${article.user.nickname}</h6>
                                    <h6 class="card-text" align="right">댓글 ${article.comment_count}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❤️ ${article.like_count}</h6>
                                </div>
                            </div>`;

        article_list.appendChild(template);
    })

    /* 게시글 미리보기 엔터 연타 방지 */
    const pTags = document.querySelectorAll("p");
    for (let i = 0; i < pTags.length; i++) {
        if (pTags[i].childElementCount === 0) {
            pTags[i].parentNode.removeChild(pTags[i]);
        }
    }
}


// 로그인 X: 나의 게시물 버튼 삭제
export function loadNavMenu() {

    const mybutton = document.getElementById("main_mybutton")

    if (token == null) {
        mybutton.remove()
    }
}


// 글쓰기 버튼 클릭 시 작성페이지로 이동
export function handleCreateButtonClick() {

    if (token) {
        window.location.href = "article_create.html";
    }
    else {
        alert("로그인한 사용자만 작성할 수 있습니다!")
    }
}
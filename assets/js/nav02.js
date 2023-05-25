const proxy = 'http://127.0.0.1:8000/';

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


async function viewMyArticleList() {

    // access token에서 user_id 얻기
    const access = localStorage.getItem("access")
    const base64Url = access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const my_id = JSON.parse(jsonPayload).user_id

    // 게시글 전체 가져오기
    const articles = await getArticle();

    // 내가 작성한 게시글만 필터링
    const my_articles = articles.filter((value) => value.user.pk == my_id)

    const article_list = document.getElementById("article-list");

    // 기존 게시글 삭제
    article_list.innerHTML = ""

    // 게시글 카드 하나씩 생성 후 추가
    my_articles.forEach((article) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-4");

        // 디폴트 이미지
        let imagePath = "assets/images/headerimg.png";

        if (article.image) {
            imagePath = proxy + article.image;
        }

        template.innerHTML = `<div class="card h-100">
                                <a style="cursor: pointer;" onclick="location.href='article_detail.html?id=${article.id}'"><img src="${imagePath}" class="card-img-top" alt="..."></a>
                                <div class="card-body">
                                    <h5 class="card-title">${article.title}</h5>
                                    <h6 class="card-text">${article.content}</h6>
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


async function viewCategorizedArticleList(category_id) {

    // 게시글 전체 가져오기
    const articles = await getArticle();

    // 입력받은 category_id로 게시글 필터링
    const categorized_articles = articles.filter((value) => value.category == category_id)

    const article_list = document.getElementById("article-list");

    // 기존 게시글 삭제
    article_list.innerHTML = ""

    // 게시글 카드 하나씩 생성 후 추가
    categorized_articles.forEach((article) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-4");

        // 디폴트 이미지
        let imagePath = "assets/images/headerimg.png";

        if (article.image) {
            imagePath = proxy + article.image;
        }

        template.innerHTML = `<div class="card h-100">
                                <a style="cursor: pointer;" onclick="location.href='article_detail.html?id=${article.id}'"><img src="${imagePath}" class="card-img-top" alt="..."></a>
                                <div class="card-body">
                                    <h5 class="card-title">${article.title}</h5>
                                    <h6 class="card-text">${article.content}</h6>
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

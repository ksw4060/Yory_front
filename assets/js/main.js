
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


export async function viewArticleList() {

    const articles = await getArticle();

    articles.forEach((article) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-4");
        let imagePath = "assets/images/headerimg.png";
        if (article.image) {
            imagePath = proxy + "/" + article.image;
        }
        template.innerHTML = `<div class="card h-100">
                                <a style="cursor: pointer;" onclick="location.href='article_detail.html?id=${article.id}'"><img src="${imagePath}" class="card-img-top" alt="..."></a>
                                <div class="card-body">
                                    <h5 class="card-title">${article.title}</h5>
                                    <h6 class="card-text">${article.content}</h6>
                                </div>
                            </div>`;
        const article_list = document.getElementById("article-list");
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

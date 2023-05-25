
const proxy = 'http://127.0.0.1:8000/';  // 게시글 API 엔드포인트


// Article 리스트 GET 요청
// async function getArticle(Article_ID = null) {
// if (Article_ID == null) {
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
// }

export async function viewArticleList() {
    console.log("페이지 로드 시 함수 작동 테스트")
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

// 게시글 목록 보여주기
export async function viewProductList() {
    const products = await getProduct();
    products.forEach((product) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-4 col-12-medium");
        // console.log(product)
        // 이미지 필드가 존재하는 경우에만 경로를 동적으로 변경
        let imagePath = "images/pic01.jpg"; // 기본 이미지 경로
        if (product.image) {
            imagePath = BACK_BASE_URL + "/" + product.image; // 이미지 경로를 적절히 수정해야 합니다.
        }
        console.log(product);
        template.innerHTML = `<div class="col-4 col-12-medium" data-product-id="${product.id}">
                                  <section class="box feature">
                                      <a onclick="productDetail(${product.id})" class="image featured"><img src="${imagePath}" alt="" /></a>
                                      <div class="inner">
                                          <header>
                                              <h2>${product.name}</h2>
                                              <h5>${product.brand}</h5>
                                              <h6>likes:${product.likes_count}</h6>
                                          </header>
                                      </div>
                                  </section>
                              </div>`;
        const posting_list = document.getElementById("jy-product");
        posting_list.appendChild(template);

        /* 게시글 미리보기 엔터 연타 방지 */
        const pTags = document.querySelectorAll("p");
        for (let i = 0; i < pTags.length; i++) {
            if (pTags[i].childElementCount === 0) {
                pTags[i].parentNode.removeChild(pTags[i]);
            }
        }
    });
}

async function fetchPosts() {
    try {
        const response = await fetch(`${proxy}/articles/`);

        if (!response.ok) {
            throw new Error('게시글을 가져오는데 실패하였습니다.');
        }

        const data = await response.json();

        // 받아온 게시글 데이터를 처리하여 HTML 생성
        data.articles.forEach((article) => {
            articleBox.innerHTML = `
            <div class="col">
            <div class="card h-100">
                <img src="https://i.ibb.co/8MVT3Bk/img.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">This is a longer card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.</p>
                </div>
            </div>
        </div>
            `
        });

    } catch (error) {
        console.error('게시글 가져오기 실패:', error);
    }
}

// fetchPosts();

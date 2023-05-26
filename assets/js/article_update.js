const proxy = "https://api.bechol.com";

// 수정할 게시글 정보 가져오기
export async function getUpdeteArticle() {
    const article_id = new URLSearchParams(window.location.search).get("id");

    const url = `${proxy}/articles/${article_id}/`
    const response = await fetch(url, {
        method: 'GET'
    })
    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        console.log("잠시 후 다시 시도해주세요")
    }
}


// 선택된 카테고리 option selected로 만들어주기
export function findSelectedCategory(category_id) {
    var article_category = document.getElementById("category");

    for (var i = 1, j = 6; i < j; i++) {
        if (article_category.options[i].value == category_id) {
            article_category[i].selected = true;
            break;
        }
    }
}


// 게시글 수정 PUT 요청
export async function updateArticle() {
    const article_id = new URLSearchParams(window.location.search).get("id");

    const access = localStorage.getItem("access")

    const new_title = document.getElementById("update_article_title").value;
    const new_content = $('#summernote').summernote('code');

    const formdata = new FormData();
    formdata.append('title', new_title);
    formdata.append('content', new_content);

    // value 확인하기 
    console.log(new_title)
    for (let value of formdata.values()) {
        console.log(value);
    }

    const url = `${proxy}/articles/${article_id}/`
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${access}`
        },
        body: formdata
    })

    if (response.status == 200) {
        alert("수정 완료");
        window.location.replace(`article_detail.html?id=${article_id}`);
    }
}
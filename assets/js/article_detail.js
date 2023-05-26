const proxy = 'http://127.0.0.1:8000';  // 게시글 API 엔드포인트

// 글 상세보기

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search).get('id');
    ArticleDetail(urlParams);
    loadComments(urlParams);
    CountHeart();
}

const article_id = new URLSearchParams(window.location.search).get('id');
async function ArticleDetail(article_id) {


    const response = await fetch(`${proxy}/articles/${article_id}`, {
        method: 'GET',
    })

    response_json = await response.json()
    console.log(response_json)

    const category = document.querySelector('#category');
    // 딱히 안써도 가져와지는것같아서 주석처리했습니댜
    const author = document.querySelector('#author');
    const article_title = document.querySelector('#article-title');
    const article_created_at = document.querySelector('#article-created-at');
    const article_updated_at = document.querySelector('#article-updated-at');
    const article_content = document.querySelector('#article-content');
    //백 이미지 링크를 통해 가져오도록 햇습니댜
    const article_img_url = `${proxy}${response_json.image}`;
    const article_img_element = document.getElementById("article_img")
    // console.log(article_img_element)

    // const detail_product_img_url = `${BACKEND_API}/${response_json.image}`
    // detail_product_img.setAttribute('src', detail_product_img_url)

    author.innerText = response_json.user.nickname
    article_title.innerText = response_json.title
    article_created_at.innerText = response_json.created_at
    article_updated_at.innerText = response_json.updated_at
    article_content.innerHTML = response_json.content
    //이미지 스크린에 아티클 이미지 url들을 각각 불러오도록 했습니댜

    // 게시글에 이미지가 있으면 보여주고 없으면 이미지칸 지우기
    if (response_json.image) {
        article_img_element.setAttribute("src", article_img_url)
    } else {
        article_img_element.remove()
    }

    // access token에서 user_id 얻기
    const access = localStorage.getItem("access")
    const base64Url = access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const my_id = JSON.parse(jsonPayload).user_id

    if (response_json.user.pk != my_id) {
        const author_only_buttons = document.getElementById("article_detail_author_only_button")
        author_only_buttons.remove()
    }

    const category_dict = { "1": "한식", "2": "중식", "3": "일식", "4": "양식", "5": "그외" }
    category.innerText = category_dict[response_json.category]

}

// 수정 페이지로 이동
function redirectUpdatePage() {
    window.location.href = `article_update.html?id=${article_id}`;
}


// 글 삭제

async function ArticleDelete() {
    if (confirm("삭제하시겠습니까?")) {
        const response = await fetch(`${proxy}/articles/${article_id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access"),
                'content-type': 'application/json',
            },
            method: 'DELETE',
        })
        if (response.status === 204) {
            alert("삭제 완료!")
            location.replace('index.html')
        } else {
            alert("권한이 없습니다.")
        }
    }
}


// 댓글 작성

async function save_comment() {
    const comment = document.getElementById("comment").value

    const token = localStorage.getItem("access")

    const response = await fetch(`${proxy}/articles/${article_id}/comments/`, {
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + token,
        },
        method: 'POST',
        body: JSON.stringify({
            "content": comment,

        })
    })

    if (response.status == 201) {
        alert("댓글 작성 완료")
        location.reload();
    } else if (comment == '') {
        alert("댓글을 입력해 주세요.")
    }

}

// 댓글 불러오기

async function loadComments(article_id) {
    const response = await fetch(`${proxy}/articles/${article_id}/comments/`);
    const comments = await response.json();
    console.log(comments)




    comments.forEach((comment) => {
        const commentList = document.getElementById('comment-list');
        commentList.insertAdjacentHTML('beforeend', `

        <div  class="card-header">
                <a>${comment.user.nickname}</a>
            </div>
            <div id="comment-${comment.id}" class="card-body" style="max-width: 1000px;">
                <div class="row g-5">
                    
                    <!-- 댓글 제목과 내용 입력-->
                    <div class="col">
                        <div class="card-body">
                            <p class="card-text" id="comment-content-${comment.id}">${comment.content}</p>

                        </div>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <a href="#" onclick = "editComment(${comment.id})" class="btn btn-secondary btn-sm me-md-2">댓글수정</a>
                            <a href="#" onclick = "CommentDelete(${comment.id})" class="btn btn-secondary btn-sm">댓글삭제</a>
                        </div>
                        <p class="card-text"><small class="text-muted">${comment.created_at}</small></p>
                    </div>
                </div>
            </div>


        `);
    });
}


// 댓글 수정 폼 열기
async function editComment(comment_id) {
    event.preventDefault();

    const commentCard = document.getElementById(`comment-${comment_id}`);
    const before_comment = document.getElementById(`comment-content-${comment_id}`);

    const editForm = document.createElement('div');
    editForm.classList.add('edit-form');

    const textarea = document.createElement('textarea');
    textarea.classList.add('form-control');
    console.log(before_comment.innerText)
    textarea.value = before_comment.innerText;

    const saveButton = document.createElement('button');
    saveButton.classList.add('btn', 'btn-primary', 'btn-sm');
    saveButton.textContent = '수정 완료';
    saveButton.addEventListener('click', () => {
        updateComment(comment_id, textarea.value);
    });

    editForm.appendChild(textarea);
    editForm.appendChild(saveButton);

    commentCard.querySelector('.card-body').appendChild(editForm);
    before_comment.style.display = 'none'; // 기존 댓글 숨기기
}
// 댓글 수정 저장하기
async function updateComment(commentId, newContent) {
    const token = localStorage.getItem('access');
    const response = await fetch(`${proxy}/articles/comments/${commentId}/`, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        method: 'PUT',
        body: JSON.stringify({
            'content': newContent,
        }),
    });

    if (response.status === 200) {
        alert('댓글이 수정되었습니다.');
        location.reload();
    } else if ((response.status === 403)) {
        alert(response.message);
    } else {
        alert('댓글 수정에 실패했습니다.');
    }
}



// 댓글 삭제
async function CommentDelete(comment_id) {

    if (confirm("삭제하시겠습니까?")) {
        const response = await fetch(`${proxy}/articles/comments/${comment_id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access"),
                'content-type': 'application/json',
            },
            method: 'DELETE',
        })
        if (response.status === 204) {
            alert("삭제 완료!")
            location.reload();
        } else {
            alert("권한이 없습니다.")
        }
    }
}

// 좋아요 누르기
async function ClickHeart() {

    const response = await fetch(`${proxy}/articles/${article_id}/like/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'POST',
    })
    if (response.status === 200) {
        alert("❤️")
        location.reload();
    }
}


// 좋아요 갯수
async function CountHeart() {

    const response = await fetch(`${proxy}/articles/${article_id}/`, {
        headers: {

            'content-type': 'application/json',
        },
        method: 'GET',
    })
    response_json = await response.json()
    document.getElementById('heart-count').innerText = response_json.like_count
}

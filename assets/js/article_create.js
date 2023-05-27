const proxy = "https://api.bechol.com"

function handleCreateArticle(event) {
    event.preventDefault(); // 제출 버튼을 눌렀을 때 새로고침 방지

    const title = document.getElementById('article_title').value;
    const category = document.getElementById('category').value;
    const image = document.getElementById('myFile').files[0];
    const content = $('#summernote').summernote('code');


    // FormData를 사용하면 header에 "application/json"을 담지 않아도 됨
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('content', content);
    formData.append('image', image);
    console.log(title, category, image, content);
    console.log(formData.keys());

    createArticle(formData);
};

async function createArticle(formData) {
    try {

        // formData의 빈칸 확인
        if (formData.get("title") == "" || formData.get("content") == "<p><br></p>") {
            alert("제목과 내용은 필수입니다.");
        } else if (formData.get("category") == "--선택--") {
            alert("카테고리를 선택해주세요.");
        }

        // 로컬스토리지에서 엑세스 토큰 가져옴
        const accessToken = localStorage.getItem('access');

        const response = await fetch(`${proxy}/articles/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('게시글 작성에 실패하였습니다.');
        }

        const data = await response.json();
        console.log(data.message);
        // 회원가입 완료 후 메인 페이지로 이동
        window.location.href = "main.html"
    } catch (error) {
        console.error('Error:', error);
    }
};

const createButton = document.getElementById("createButton");
createButton.addEventListener('click', handleCreateArticle);
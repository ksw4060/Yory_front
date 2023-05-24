const proxy = 'http://127.0.0.1:8000/';  // 게시글 API 엔드포인트
const articleBox = document.getElementById('article_box');  // 게시글을 표시할 컨테이너 요소

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

fetchPosts();

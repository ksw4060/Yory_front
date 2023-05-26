import { loadNavMenu, viewArticleList } from './main.js';


// 메인페이지 로드 시 실행
window.onload = async function handleArticleList() {
    loadNavMenu();  // 로그인 여부 판단하여 나의 게시물 버튼 보여주기/없애기
    viewArticleList();  // 전체 게시글 가져오기
}
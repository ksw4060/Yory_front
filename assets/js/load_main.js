import { loadNavMenu, viewArticleList } from './main.js';

// 로드 시 게시글 목록 가져오기
window.onload = async function handleArticleList() {
    loadNavMenu();
    viewArticleList();
}
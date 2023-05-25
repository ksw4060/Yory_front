console.log(1)
const proxy = "http://127.0.0.1:8000"
let userProfile = null

// 사용자 정보
const userImage = document.getElementById('main_nickname');
const userNickName = document.getElementById('main_email');

// 로그인 상태 체크 함수
function isLoggedIn() {
    // 로컬 스토리지에 토큰 정보가 있는지 여부 확인
    const accessToken = localStorage.getItem('access');
    return accessToken !== null;    // 토큰정보가 null이면 false 반환
}

// 사용자 이미지 및 이름 업데이트 함수
function updateUserProfile(image, nickname) {
    userImage.src = proxy + image;
    userNickName.textContent = nickname;
}

// 사용자 정보 가져오기
async function fetchUserProfile() {
    try {
        // 로컬스토리지에서 엑세스 토큰 가져옴
        const accessToken = localStorage.getItem('access');

        // 헤더에 토큰정보를 싣고 백엔드에 get요청
        const response = await fetch(`${proxy}/users/mypage/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('프로필 정보를 가져오는데 실패하였습니다.');
        }

        // 요청성공하면 받은데이터를 json으로 변환
        userProfile = await response.json();

        // 백엔드에서 받아온 사용자 정보를 업데이트
        const imageUrl = userProfile.image;
        const nickName = userProfile.nickname;
        updateUserProfile(imageUrl, nickName);

    } catch (error) {
        console.error('사용자 정보를 가져오는 동안 오류가 발생했습니다:', error);
    }
}

// 페이지 로드 시 로그인 상태 체크하여 UI 업데이트
window.addEventListener('load', async function () {
    console.log(1)
    if (isLoggedIn()) {
        // 로그인 상태일 경우
        await fetchUserProfile(); // 사용자 정보 가져오기
    } else {
        // 비로그인 상태일 경우
        userImage.style.display = 'none'; // 사용자 이미지 숨김
        userNickName.style.display = 'none'; // 사용자 이름 숨김
    }
});

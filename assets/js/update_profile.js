const proxy = "http://127.0.0.1:8000"

let userProfile = null; // 사용자 프로필 데이터를 전역변수로 저장
let userId = null;  // 사용자 pk값을 전역변수로 저장

// 사용자 데이터를 가져오는 함수
async function fetchUserProfile() {
    try {
        // 로컬스토리지에서 엑세스 토큰 가져옴
        const accessToken = localStorage.getItem('access');
        // 엑세스 토큰에서 id값 추출하는 함수 호출
        userId = getPKFromAccessToken(accessToken);

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

        loadProfileForm(userProfile);

    } catch (error) {
        console.error('Error:', error);
    }
}

function loadProfileForm(userProfile) {
    const nicknameInput = document.getElementById('update_nickname');
    const bioInput = document.getElementById('update_bio');

    // 입력창에 기존 정보 채우기
    nicknameInput.value = userProfile.nickname;
    bioInput.value = userProfile.bio;
}

async function updateProfile() {
    try {
        const accessToken = localStorage.getItem('access');

        const nickname = document.getElementById('update_nickname').value;
        const bio = document.getElementById('update_bio').value;

        // FormData를 사용하면 header에 "application/json"을 담지 않아도 됨
        const formData = new FormData();

        formData.append('nickname', nickname);
        formData.append('bio', bio);

        const response = await fetch(`${proxy}/users/${userId}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('프로필 수정 요청이 실패하였습니다.');
        }

        console.log('프로필 정보 수정에 성공했습니다.');

        window.location.href = 'mypage.html';

    } catch (error) {
        console.error('Error:', error);
    }
}

function getPKFromAccessToken(accessToken) {
    const tokenParts = accessToken.split('.');  // 토큰 값을 .으로 나눔
    const payloadBase64 = tokenParts[1];    // 나눠진 토큰중 1번 인덱스에 해당하는 값을 저장

    // atob 함수는 base64로 인코딩된 문자열을 디코딩하는 함수
    // JSON.parse 함수로 json문자열을 javascript 객체로 변환
    const payload = JSON.parse(atob(payloadBase64));
    userId = payload.user_id;
    return userId;
}

const updateButton = document.getElementById('update_user_profile');
updateButton.addEventListener('click', updateProfile);
// 페이지 진입 시 기존 사용자 정보를 불러오는 함수 호출
fetchUserProfile();

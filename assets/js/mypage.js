// 유저정보를 요청하는 함수
async function fetchUserProfile() {
    try {
        // 로컬스토리지에서 엑세스 토큰 가져옴
        const accessToken = localStorage.getItem('access_token');

        // 헤더에 토큰정보를 싣고 백엔드에 get요청
        const response = await fetch('http://127.0.0.1:8000/users/mypage/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('프로필 정보를 가져오는데 실패하였습니다.');
        }

        // 요청성공하면 받은데이터를 json으로 변환 후 함수로 전달
        const userProfile = await response.json();
        loadMyPage(userProfile);
        loadFollowPage(userProfile);

    } catch (error) {
        console.error('Error:', error);
    }
}

// 반환된 데이터를 가지고 마이페이지에 넣어주는 함수
function loadMyPage(userProfile) {
    // 추후 html에 있는 id로 교체해야함
    const profileImage = document.getElementById('profile_image');
    // 프로필 사진
    profileImage.src = 'http://127.0.0.1:8000/' + userProfile.image;

    // 프로필 박스에 넣는 데이터들
    // 추후 html에 있는 id로 교체해야함
    // 밑에 요소들이 백엔드에서 넘어올 수 있는지 확인해야 함
    const profileElement = document.getElementById('profile');
    profileElement.innerHTML = `
    <p>닉네임: ${userProfile.nickname}</p>
    <p>이메일: ${userProfile.email}</p>
    <p>자기 소개: ${userProfile.bio}</p>
    <p>작성한 게시글 수: ${userProfile.article_count} 개</p>  
    <p>팔로워: ${userProfile.follow_count} 명</p>
    <p>팔로잉: ${userProfile.following_count} 명</p>
    <p>좋아하는 음식: ${userProfile.likefood}</p>
    `
}

// 팔로워, 팔로잉 유저정보 함수
// html과 해당 id 대조 후 변경 필요
async function loadFollowPage(userProfile) {
    const followerElement = document.getElementById('follower');
    const followingElement = document.getElementById('following');

    // 팔로워 표시, 받은 id값을 for문으로 하나씩 백엔드에 요청
    for (const followerId of userProfile.followers) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${followerId}/`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`팔로워 정보를 가져오는데 실패하였습니다. (ID: ${followerId})`);
            }

            // json으로 변환
            const followerData = await response.json();

            // 유저하나당 div하나씩 할당
            const followerContainer = document.createElement('div');

            // 팔로워 이미지 넣는 부분인데, 이미지 div를 따로 만드신건지 확인 필요
            const followerProfileImage = document.createElement('img');
            followerProfileImage.src = 'http://127.0.0.1:8000/' + followerData.image;
            followerContainer.appendChild(followerProfileImage);

            // 유저 이름 추가
            const followerName = document.createElement('p');
            followerName.textContent = followerData.name;
            followerContainer.appendChild(followerName);

            // 만들어진 div를 html에 만들어진 div에 추가
            followerElement.appendChild(followerContainer);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // 팔로잉 표시
    for (const followingId of userProfile.followings) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${followingId}/`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`사용자 정보를 가져오는데 실패하였습니다. (ID: ${followingId})`);
            }

            const followingData = await response.json();

            const followingContainer = document.createElement('div');

            const followingProfileImage = document.createElement('img');
            followingProfileImage.src = 'http://127.0.0.1:8000/' + followingData.image;
            followingContainer.appendChild(followingProfileImage);

            const followingName = document.createElement('p');
            followingName.textContent = followingData.name;
            followingContainer.appendChild(followingName);

            followingElement.appendChild(followingContainer);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// js파일 로드 시 바로 함수 실행
fetchUserProfile();

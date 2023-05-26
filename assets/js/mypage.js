
const proxy = "http://127.0.0.1:8000"
let userId = null
let id = null
let followingList = []

const mypageProfileNickName = document.getElementById('mypage_profile_nickname');
const profileImage = document.getElementById('profile_image');
const profileNickName = document.getElementById('mypage_nickname');
const profileEmail = document.getElementById('mypage_email');
const profileArticleCount = document.getElementById('mypage_article_count');
const profilePreference = document.getElementById('mypage_preference');
const profileFollower = document.getElementById('mypage_follower');
const profileFollowing = document.getElementById('mypage_following');
const profilebio = document.getElementById('mypage_bio');

// 유저정보를 요청하는 함수
async function fetchUserProfile() {
    try {
        const accessToken = localStorage.getItem('access');

        // URL에서 id 파라미터를 추출
        const urlParams = new URLSearchParams(window.location.search);
        id = parseInt(urlParams.get('id'));

        const response = await fetch(`${proxy}/users/mypage/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error('프로필 정보를 가져오는데 실패하였습니다.');
        }

        const userProfile = await response.json();
        userId = parseInt(userProfile.id);

        for (const followinguser of userProfile.followings) {
            followingList.push(followinguser.id)
        }

        if (!id || id === userId) {
            loadMyPage(userProfile);
            loadFollowPage(userProfile);

        } else {
            // 주소에 id가 있는 경우 타인의 마이페이지를 가져옴
            const response = await fetch(`${proxy}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('타인의 프로필 정보를 가져오는데 실패하였습니다.');
            }

            const userProfile = await response.json();
            userId = userProfile.id;
            loadFollowPage(userProfile);
            loadOtherUserPage(userProfile);


        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// 본인인 경우 수정 버튼과 삭제 버튼을 보이도록 처리하는 함수
function showEditButtons() {
    const updateButton = document.getElementById('user_update_button');
    const deleteButton = document.getElementById('user_delete_button');

    updateButton.style.display = 'block';
    deleteButton.style.display = 'block';
}

// 타인인 경우 수정 버튼과 삭제 버튼을 숨김 처리하는 함수
function hideEditButtons() {
    const editButton = document.getElementById('user_update_button');
    const deleteButton = document.getElementById('user_delete_button');
    const followButton = document.getElementById('user_follow_button');

    editButton.style.display = 'none';
    deleteButton.style.display = 'none';
    followButton.style.display = 'block';


    if (followingList.includes(id)) {
        followButton.textContent = '언팔로우';
    }
}

// 반환된 데이터를 가지고 마이페이지에 넣어주는 함수
function loadMyPage(userProfile) {
    // 프로필 사진
    profileImage.src = proxy + userProfile.image;

    // 프로필 박스에 넣는 데이터들
    // 추후 html에 있는 id로 교체해야함
    // 밑에 요소들이 백엔드에서 넘어올 수 있는지 확인해야 함
    mypageProfileNickName.textContent = userProfile.nickname + '님의 프로필'
    profileNickName.textContent = '닉네임 : ' + userProfile.nickname
    profileEmail.textContent = '이메일 : ' + userProfile.email
    profileArticleCount.textContent = '작성한 게시글 수 : ' + userProfile.article_count
    profilePreference.textContent = '좋아하는 음식 : ' + userProfile.preference
    profileFollower.textContent = '팔로워 : ' + userProfile.follower_count + '명'
    profileFollowing.textContent = '팔로워 : ' + userProfile.following_count + '명'
    profilebio.textContent = '자기소개 : ' + userProfile.bio
}

// 팔로워, 팔로잉 유저정보 함수
// html과 해당 id 대조 후 변경 필요
function loadFollowPage(userProfile) {
    const followerElement = document.getElementById('ji_follower-container');
    const followingElement = document.getElementById('ji_following-container');

    followerElement.innerHTML = "";
    followingElement.innerHTML = "";

    // 팔로워 표시, 받은 id값을 for문으로 하나씩 백엔드에 요청
    for (const follower of userProfile.followers) {
        // 유저하나당 div하나씩 할당
        followerElement.innerHTML += `
        <section class="box feature-ji">
            <div class="row">
                <div class="col-4" style="margin-bottom: -4%;">
                    <a style="cursor: pointer;">
                        <div class="image featured-ji">
                            <img src="${proxy}/media/${follower.image}" alt="" />
                        </div>
                    </a>
                </div>
                <div class="col-8">
                    <h3 style="margin-bottom: 0;">${follower.nickname}</h3>
                    <p style="margin-bottom: 10%;">${follower.email}</p>
                    <button type="button" class="button alt"
                        style="float: right; margin:3% 5% 5% 0;" onclick="redirectToMyPage(${follower.id})">${follower.nickname}의 페이지</button>
                </div>
            </div>
        </section>
        `
    }

    for (const following of userProfile.followings) {
        // 유저하나당 div하나씩 할당

        followingElement.innerHTML += `
        <section class="box feature-ji">
            <div class="row">
                <div class="col-4" style="margin-bottom: -4%;">
                    <a style="cursor: pointer;">
                        <div class="image featured-ji">
                            <img src="${proxy}/media/${following.image}" alt="" />
                        </div>
                    </a>
                </div>
                <div class="col-8">
                    <h3 style="margin-bottom: 0;">${following.nickname}</h3>
                    <p style="margin-bottom: 10%;">${following.email}</p>
                    <button type="button" class="button alt"
                        style="float: right; margin:3% 5% 5% 0;" onclick="redirectToMyPage(${following.id})">${following.nickname}의 페이지</button>
                </div>
            </div>
        </section>
        `
    }
}

// 타인의 페이지 로드 함수
function loadOtherUserPage(userProfile) {
    // 프로필 사진
    profileImage.src = proxy + userProfile.image;

    // 프로필 박스에 넣는 데이터들
    // 추후 html에 있는 id로 교체해야함
    // 밑에 요소들이 백엔드에서 넘어올 수 있는지 확인해야 함
    mypageProfileNickName.textContent = userProfile.nickname + '님의 프로필'
    profileNickName.textContent = '닉네임 : ' + userProfile.nickname
    profileEmail.textContent = '이메일 : ' + userProfile.email
    profileArticleCount.textContent = '작성한 게시글 수 : ' + userProfile.article_count
    profilePreference.textContent = '좋아하는 음식 : ' + userProfile.preference
    profileFollower.textContent = '팔로워 : ' + userProfile.follower_count + '명'
    profileFollowing.textContent = '팔로워 : ' + userProfile.following_count + '명'
    profilebio.textContent = '자기소개 : ' + userProfile.bio

    if (id === userId) {
        hideEditButtons();
    }
}

// 회원탈퇴 함수
async function deleteUser() {
    try {
        const confirmation = confirm('회원 탈퇴하시겠습니까?');

        if (!confirmation) {
            return; // 탈퇴 취소 시 함수 종료
        }

        // 로컬 스토리지에서 엑세스 토큰 가져옴
        const accessToken = localStorage.getItem('access');

        // 백엔드에 회원 탈퇴 요청
        const response = await fetch(`http://127.0.0.1:8000/users/${userId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('회원 탈퇴에 실패하였습니다.');
        }

        alert('회원 탈퇴가 완료되었습니다.');

        // 로그아웃 함수 가져옴, 로그아웃 시 로그인 페이지로 이동
        logout();

    } catch (error) {
        console.error('Error:', error);
    }
}

async function followUser() {
    try {
        // 팔로우 여부 확인
        const isFollowing = followingList.includes(id);

        let confirmation;
        if (isFollowing) {
            confirmation = confirm('언팔로우 하시겠습니까?');
        } else {
            confirmation = confirm('팔로우 하시겠습니까?');
        }

        if (!confirmation) {
            return; // 취소 시 함수 종료
        }

        // 로컬 스토리지에서 엑세스 토큰 가져옴
        const accessToken = localStorage.getItem('access');

        // 백엔드에 팔로우, 언팔로우 요청
        const response = await fetch(`${proxy}/users/${userId}/follow/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('팔로우에 실패하였습니다.');
        }

        if (isFollowing) {
            // 언팔로우 시 동작
            followingList = followingList.filter(followingId => followingId !== id);
            followButton.textContent = '팔로우';
            alert('언팔로우가 완료되었습니다.');
        } else {
            // 팔로우 시 동작
            followingList.push(id);
            followButton.textContent = '언팔로우';
            alert('팔로우가 완료되었습니다.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

function logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = 'login.html';
}

function redirectToMyPage(followId) {
    window.location.href = `mypage.html?id=${followId}`;
}

// js파일 로드 시 바로 함수 실행
fetchUserProfile();
const deleteButton = document.getElementById('user_delete_button');
deleteButton.addEventListener('click', deleteUser);

const followButton = document.getElementById('user_follow_button');
followButton.addEventListener('click', followUser);
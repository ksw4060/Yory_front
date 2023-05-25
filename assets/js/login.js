const proxy = "https://api.bechol.com"

// 입력 받은 값을 login 함수로 전달하는 함수
function handleLogin(event) {
    event.preventDefault(); // 제출 버튼을 눌렀을 때 새로고침 방지

    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    login(email, password);
}

// 전달받은 값을 백엔드에 요청을 보낸 후 토큰을 받아 저장하는 로그인함수
async function login(email, password) {
    try {
        const loginData = {
            email: email,
            password: password
        };

        const response = await fetch(`${proxy}/users/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            throw new Error('로그인 요청이 실패하였습니다.');
        }

        // 반환 값을 json으로 변환 후 각 토큰할당
        const data = await response.json();
        const accessToken = data.access;
        const refreshToken = data.refresh;

        // 로컬스토리지에 각 토큰 저장
        localStorage.setItem('access', accessToken);
        localStorage.setItem('refresh', refreshToken);

        console.log('로그인 성공!');

        // 로그인 성공하면 메인페이지로 가기
        window.location.href = "main.html"
    } catch (error) {
        console.error('로그인 실패:', error);
    }
}
// html에서 login_form이라는 이름을 가진 태그 할당
// submit이라는 버튼이 클릭되면 handleLogin 함수 실행
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
loginButton.addEventListener('click', handleLogin);


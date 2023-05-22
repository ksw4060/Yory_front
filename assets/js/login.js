function handleLogin(event) {
    event.preventDefault(); // 제출 버튼을 눌렀을 때 새로고침 방지

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
}

async function login(email, password) {
    try {
        const loginData = {
            email: email,
            password: password
        };

        const response = await fetch('http://127.0.0.1:8000/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            throw new Error('로그인 요청이 실패하였습니다.');
        }

        const data = await response.json();
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;

        // 토큰을 저장하는 코드 작성예정...

        console.log('로그인 성공!');
    } catch (error) {
        console.error('로그인 실패:', error);
    }
}

const loginForm = document.getElementById('login_form');
loginForm.addEventListener('submit', handleLogin);

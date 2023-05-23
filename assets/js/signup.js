// 입력된 정보를 fomdata형식으로 변환 후 signup함수로 전달하는 함수
function handleSignup(event) {
    event.preventDefault(); // 제출 버튼을 눌렀을 때 새로고침 방지

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const nickname = document.getElementById('nickname').value;
    const image = document.getElementById('image').files[0];
    const bio = document.getElementById('bio').value;

    // FormData를 사용하면 header에 "application/json"을 담지 않아도 됨
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('nickname', nickname);
    formData.append('bio', bio);
    formData.append('image', image);

    if (password !== password2) {
        console.error('비밀번호가 일치하지 않습니다.');
        return;
    }

    signUp(formData);
}

// 전달받은 값으로 백엔드에 요청하는 회원가입 함수
async function signUp(formData) {
    try {
        const response = await fetch('http://127.0.0.1:8000/users/signup/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('회원가입 요청이 실패하였습니다.');
        }

        const data = await response.json();
        console.log(data.message);
        // 회원가입 완료 후 로그인 페이지로 이동
        window.location.href = "login.html"
    } catch (error) {
        console.error('Error:', error);
    }
}

const form = document.getElementById('signup_form');    // signup_form이라는 요소를 찾아 form에 할당
form.addEventListener('submit', handleSignup);  // 이벤트 발생 시 handleSignup함수 실행

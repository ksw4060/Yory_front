document.write('<script src="https://developers.kakao.com/sdk/js/kakao.js"></script>')
const proxy = "https://api.bechol.com"

const kakao_api = config.KAKAO_JS_KEY
Kakao.init(kakao_api)

const image = document.getElementById("kakao-login-button")
image.addEventListener('click', kakaoLogin)

function kakaoLogin() {
    window.Kakao.Auth.login({
        scope: ' ',
        success: async function (authObj) {
            access_token = {
                access_token: authObj.access_token
            }

            const response = await fetch(`${proxy}/users/kakao/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(access_token)
            });

            if (response.ok) {
                const data = await response.json()

                const access = data.access
                const refresh = data.refresh

                localStorage.setItem('access', access)
                localStorage.setItem('refresh', refresh)

                console.log('로그인 성공!')
                window.location.href = 'main.html'
            } else {
                console.log('로그인 실패!')
            }
        }
    })
}

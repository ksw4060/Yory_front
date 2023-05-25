const proxy = "http://127.0.0.1:8000"

// 입력된 정보를 fomdata형식으로 변환 후 이미지 업로드 함수로 전달하는 함수
async function handleImage(event) {
    event.preventDefault(); // 제출 버튼을 눌렀을 때 새로고침 방지

    const image = document.getElementById('chooseFile').files[0];
    const loader = document.querySelector('#loader')

    // FormData를 사용하면 header에 "application/json"을 담지 않아도 됨
    const formData = new FormData();
    formData.append('image', image);

    loader.style.display = 'block'
    await imageUpload(formData);
    loader.style.display = 'none'
}

// 전달받은 값으로 백엔드에 요청하는 이미지 업로드 함수
async function imageUpload(formData) {
    try {
        // 로컬스토리지에서 엑세스 토큰 가져옴
        const accessToken = localStorage.getItem('access');

        const response = await fetch(`${proxy}/joriking/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('?');
        }

        const data = await response.json();
        console.log(data);

        loadJoriking(data);

    } catch (error) {
        console.error('Error:', error);
    }
}

function loadJoriking(data) {

    const imageSrc = proxy + data.data.pred_path;
    const formattedResult = data.result.replace(/\n/g, "<br>");

    const jorikingElement = document.getElementById('joriking');
    jorikingElement.innerHTML = `
    <image src=${imageSrc}></image>
    <p>${formattedResult}</p>
    `

}

function loadFile(input) {
    var file = input.files[0];

    var newImage = document.createElement("img");
    newImage.setAttribute("class", 'img');

    newImage.src = URL.createObjectURL(file);

    // newImage.style.width = "100%";
    // newImage.style.height = "100%";
    // newImage.style.objectFit = "contain";

    var container = document.getElementById('image-show');
    container.innerHTML = '';
    container.appendChild(newImage);
};



const form = document.getElementById('submitButton');    // submitButton이라는 요소를 찾아 form에 할당
form.addEventListener('click', handleImage);  // 이벤트 발생 시 handleSignup함수 실행

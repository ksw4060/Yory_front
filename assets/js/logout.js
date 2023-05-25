function logout() {
    localStorage.removeItem('access');
    window.location.href = 'login.html';
}

export { logout }
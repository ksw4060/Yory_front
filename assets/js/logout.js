function logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = 'login.html';
}

export { logout }
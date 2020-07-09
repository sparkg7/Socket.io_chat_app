const usersButton = document.querySelector('.users-toggle');
const users = document.querySelector('.users');

usersButton.addEventListener('click', () => {
    users.classList.toggle('users-after');
});
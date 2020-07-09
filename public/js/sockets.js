const socket = io.connect();

const forma = document.querySelector('.forma');
const enterUsername = document.querySelector('.enter-username');
const chat = document.querySelector('.chat-div');

forma.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    //const room = e.target.elements.room.value;
    socket.emit('new-user', username);

    socket.on('same-users', err => {
        if(err) {
            //window.location.pathname = '/';
            enterUsername.style.display = "block";
            chat.style.display = "none";
            document.querySelector('.error').style.display = 'inline';
        } else {
            enterUsername.style.display = "none";
            chat.style.display = "block";
        }
    });

    enterUsername.style.display = "none";
    chat.style.display = "block";
});

const usersDiv = document.querySelector('.usersDiv');

socket.on('usern', usernames => {
    usersDiv.innerHTML = '';
    for(user in usernames) {
        const p = document.createElement('p');
        p.classList.add('user-chat');
        p.innerHTML = usernames[user];
        usersDiv.appendChild(p); 
    }
});

const messagesDiv = document.querySelector('.messages-div');
const form = document.querySelector('.send-msg');

socket.on('message', message => {
    const div = document.createElement('div');
    div.classList.add('bot-message');
    div.innerHTML = `<span>${message}!</span>`;
    messagesDiv.appendChild(div);
});

form.addEventListener('submit', e => {
    e.preventDefault();

    const inputMessage = e.target.elements.inputmsg.value;
    //console.log(inputMessage);
    socket.emit('send-message', inputMessage);

    e.target.elements.inputmsg.value = '';
    e.target.elements.inputmsg.focus();
});

socket.on('new-message', obMessage => {
    const data = new Date();
    const hours = data.getHours();
    const minutes = data.getMinutes();
    const {message, username} = obMessage;


    const div = document.createElement('div');
    div.classList.add('single-message');
    div.innerHTML = `<div class="message-header">
    <span class="message-owner">${username}</span><span class="time">${hours}:${minutes}</span>
</div>
<div class="message-content">
    <p class="txts">${message}</p>
</div>`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
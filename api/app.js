const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const crypto = require('crypto');

const getMd5 = function (source) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(source);
    const str = md5sum.digest('hex');
    return str;
}

const getImageUrl = function (source) {
  return `https://www.gravatar.com/avatar/${getMd5(source.trim().toLowerCase())}`;
}

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('join', (msg) => {
    const msgObj = JSON.parse(msg);
    const result = {
      image: getImageUrl(msgObj.email),
      message: `${msgObj.username} has joined the r18 chat.`
    }
    console.log(result)
    io.emit('join', JSON.stringify(result));
  }),
  socket.on('message', (msg) => {
    const msgObj = JSON.parse(msg);
    const result = {
      username: msgObj.username,
      image: getImageUrl(msgObj.email),
      message: msgObj.message
    }
    console.log(result);
    io.emit('message', JSON.stringify(result));
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
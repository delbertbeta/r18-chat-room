<template>
  <div id="app">
    <function-bar></function-bar>
    <div class="personal-info-wrapper" :class="{'show': isShow}">
      <div class="personal-info">
        <label for="username">Username</label>
        <input name="username" v-model="username" type="text" />
        <label for="email">Email</label>
        <input name="email" v-model="email" type="email"/>
        <div @click="editInfo" class="submit-button">OK</div>
      </div>
    </div>
    <div id="panel" class="chat-panel hide-scroll">
      <div v-for="(message, index) in messages" :key="index" class="single-line">
        <div v-if="message.type === 'message'" class="message-box">
          <div class="face" :style="{backgroundImage: `url(${message.image})`}"></div>
          <div class="wrapper">
            <div class="username">{{message.username}}</div>
            <div class="message">{{message.message}}</div>
          </div>
        </div>
        <div v-if="message.type === 'join'" class="join-box">
          <div class="face" :style="{backgroundImage: `url(${message.image})`}"></div>
          <span class="message">{{message.message}}</span>
        </div>
      </div>
    </div>
    <div class="input-panel">
      <div class="wrapper">
        <input @keypress="keypress" v-model="input" class="chat-input" />
        <div class="send-button" @click="send">Send</div>
      </div>
    </div>
  </div>
</template>

<script>
import functionBar from "./components/functionBar";
import io from "socket.io-client";

export default {
  name: "r18-chat-room-client",
  data() {
    return {
      username: "",
      email: "",
      input: "",
      isShow: true,
      messages: [],
      socket: io('http://ali.delbertbeta.cc:4222')
    };
  },
  components: {
    functionBar
  },
  methods: {
    editInfo() {
      this.isShow = false;
      const that = this;
      this.socket.emit('join', JSON.stringify({
        username: that.username,
        email: that.email
      }))
    },
    keypress(e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        this.send();
      }
    },
    send() {
      this.socket.emit('message', JSON.stringify({
        username: this.username,
        email: this.email,
        message: this.input
      }))
      this.input = '';
    }
  },
  mounted() {
    const scrollToBottom = function() {
      setTimeout(() => {
        const panel = document.getElementById('panel');
        panel.scrollTop = panel.scrollHeight;
      }, 20)
    }
    this.socket.on('message', (m) => {
      const mObj = JSON.parse(m);
      this.messages.push({
        type: 'message',
        username: mObj.username,
        image: mObj.image,
        message: mObj.message,
      })
      scrollToBottom();
    });
    this.socket.on('join', (m) => {
      const mObj = JSON.parse(m);
      this.messages.push({
        type: 'join',
        message: mObj.message,
        image: mObj.image
      })
      scrollToBottom();
    })
  }
};
</script>

<style>
/* CSS */
#app {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

html {
  height: 100%;
  width: 100%;
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  user-select: none;
  cursor: default;
  font-family: "lucida grande", "lucida sans unicode", lucida, helvetica,
    "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}

body {
  margin: 0;
  height: 100%;
  width: 100%;
}

.personal-info-wrapper {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: all 0.5s ease;
  z-index: 1;
}

.personal-info {
  width: 80vw;
  height: 60vw;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.personal-info > label {
  margin: 20px 0 10px 0;
}
.personal-info > label:nth-child(1) {
  margin-top: 0;
}

.submit-button {
  border-radius: 4px;
  border: 2px solid black;
  margin-top: 20px;
  width: 96px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease;
  cursor: pointer;
}

.submit-button:hover {
  background-color: black;
  color: white;
}

.show {
  opacity: 1;
  pointer-events: initial;
}

.chat-panel{
  padding-top: 32px;
  width: 100%;
  height: 100%;
  padding-bottom: 48px;
  box-sizing: border-box;
  overflow: auto;
}

.hide-scroll {
  crollbar-3dlight-color:transparent;
  scrollbar-highlight-color:transparent;

  scrollbar-face-color:transparent;

  scrollbar-arrow-color:transparent;

  scrollbar-shadow-color:transparent;

  scrollbar-darkshadow-color:transparent;
  scrollbar-base-color:transparent;
  scrollbar-track-color:transparent;
}

.single-line {
  padding: 10px 10px;
  border-bottom: 2px dashed lightslategray;
}

.message-box > .face {
  width: 48px;
  height: 48px;
  display: inline-block;
  margin-right: 10px;
  background-size: cover;
  background-position: center;
  vertical-align: top;
}

.message-box > .wrapper {
  display: inline-block;
  width: calc(100% - 72px);
  vertical-align: top;
}

.message-box > .wrapper > .username {
  color: lightslategray;
}

.join-box > .face {
  width: 22px;
  height: 22px;
  display: inline-block;
  margin-right: 10px;
  background-size: cover;
  background-position: center;
  vertical-align: top;
}

.input-panel {
  height: 48px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 0;
}

.input-panel > .wrapper {
  height: 36px;
  width: 90%;
  border: 2px solid black;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-panel > .wrapper > .chat-input {
  flex-grow: 1;
  outline: none;
  padding: 0 10px;
  border: none;
  background-color: transparent;
  font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
}

.input-panel > .wrapper > .send-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 48px;
  transition: all 0.5s ease;
}

.input-panel > .wrapper > .send-button:hover {
  cursor: pointer;
  background-color: black;
  color: white;

}
</style>

<template>
  custom
  <video id="remote-control" style="height: 100%" autoplay />
  <button @click="connect">click me</button>
</template>
<script setup lang="ts">
import { ref } from "vue";

const peer = ref();
import { io } from "socket.io-client";
const socket = io("");
const channel = ref();
socket.on("connect", () => {
  // 1.初始化peer
  const PeerConnection =
    window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection;
  peer.value = new PeerConnection({
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"],
      },
      {
        urls: ["turn:wangxiang.website:3478"],
        username: "admin",
        credential: "admin",
      },
    ],
  });

  // 2.创建数据通道
  // channel.value = peer.value.createDataChannel("messagechannel");
  // console.log("数据通道", channel.value);
  // channel.value.onopen = (event) => {
  //   console.log("数据通道 链接成功!");

  //   document.addEventListener("mousewheel", (e) => {
  //     const msg = {};
  //     msg.type = 4;
  //     if (e.wheelDelta < 0) {
  //       msg.event = 3;
  //     } else {
  //       msg.event = 2;
  //     }
  //     channel.value.send(JSON.stringify(msg));
  //   });
  // };

  // channel.value.onmessage = (e) => {
  //   const m = JSON.parse(e.data);
  //   console.log("channel onmessage", m);
  // };

  peer.value.ondatachannel = function (event) {
    var channel = event.channel;
    channel.onopen = function (event) {
      console.log("onopen");
      // channel.send("Hi back!");
      document.addEventListener("mousewheel", (e) => {
        const msg = {};
        msg.type = 4;
        if (e.wheelDelta < 0) {
          msg.event = 3;
        } else {
          msg.event = 2;
        }
        channel.send(JSON.stringify(msg));
      });
    };
    channel.onmessage = function (event) {
      console.log("onmessage");
      console.log(event.data);
    };
  };

  socket.on("offer", async (offer) => {
    await peer.value.setRemoteDescription(offer);
    let remoteAnswer = await peer.value.createAnswer();
    await peer.value.setLocalDescription(remoteAnswer);
    socket.emit("answer", remoteAnswer);
  });

  socket.on("toCustomCandidate", async (candidate) => {
    console.log("candidate", candidate);
    const vid2 = document.getElementById("remote-control");
    peer.value.ontrack = (e) => {
      vid2.srcObject = e.streams[0];
      vid2.oncanplay = () => vid2.play();
    };
    await peer.value.addIceCandidate(candidate);
  });
  let timer;
  peer.value.onaddstream = (e) => {
    console.log("add", e);
    try {
      const vid2 = document.getElementById("remote-control");
      vid2.srcObject = e.stream;
      vid2.onloadedmetadata = function () {
        vid2.play();
      };
    } catch (ex) {}
  };

  peer.value.onicecandidate = (event) => {
    console.log("custom", event);
    if (event.candidate) {
      // peer.value.addIceCandidate(event.candidate);
      socket.emit("toUserCandidate", event.candidate);
    }
  };
});

function connect() {
  // 3.发送ready消息
  socket.emit("ready");
}
</script>
<style lang="scss" scoped></style>

<template>
  <video id="local-control" playsinline style="height: 100%" autoplay />
  user
</template>
<script setup lang="ts">
import { ref } from "vue";

import { io } from "socket.io-client";
const socket = io("");
const peer = ref();
const channel = ref();

socket.on("connect", () => {
  console.log("user success"); // x8WIv

  socket.on("ready", async () => {
    console.log("表示座席已经ready");
    let localStream;
    try {
      localStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      document.getElementById("local-control").srcObject = localStream;
    } catch (error) {
      console.log("error", error);
    }

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
    channel.value = peer.value.createDataChannel("messagechannel");
    console.log("数据通道", channel.value);
    channel.value.onopen = (event) => {
      console.log("数据通道 链接成功!");
    };

    channel.value.onmessage = (e) => {
      const m = JSON.parse(e.data);
      console.log("channel onmessage", m);
    };

    // peer.value.ondatachannel = function (event) {
    //   var channel = event.channel;
    //   channel.onopen = function (event) {
    //     channel.send("Hi back!");
    //   };
    //   channel.onmessage = function (event) {
    //     console.log(event.data);
    //   };
    // };

    localStream.getTracks().forEach((track) => {
      peer.value.addTrack(track, localStream);
    });

    // const videoTrack = localStream.getVideoTracks()[0];
    // peer.value.addTrack(videoTrack, localStream);

    peer.value.onicecandidate = (event) => {
      console.log("localPc:", event.candidate, event);
      if (event.candidate) {
        socket.emit("toCustomCandidate", event.candidate);
      }
    };

    socket.on("toUserCandidate", (candidate) => {
      console.log("toUserCandidate");
      peer.value.addIceCandidate(candidate);
    });

    let offer = await peer.value.createOffer();
    // 保存为本地描述
    await peer.value.setLocalDescription(offer);

    // 通过信令服务器发送到对端
    socket.emit("offer", offer);
    const userMouse = document.createElement("div");
    userMouse.id = "userMouse";
    userMouse.style.width = "10px";
    userMouse.style.height = "10px";
    userMouse.style.backgroundColor = "red";
    userMouse.style.position = "absolute";
    document.body.appendChild(userMouse);
    socket.on("mousemove", (params) => {
      console.log("mousemove", params);
      userMouse.style.left = params.x + "px";
      userMouse.style.top = params.y + "px";
    });
  });

  socket.on("answer", async (answer) => {
    await peer.value.setRemoteDescription(answer);
  });
});
</script>
<style lang="scss" scoped></style>

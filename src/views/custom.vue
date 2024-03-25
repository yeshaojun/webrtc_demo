<template>
  custom
  <video id="remote-control" style="height: 100%" autoplay />
  <button @click="connect">click me</button>
  <button @click="test">test</button>
</template>
<script setup lang="ts">
import { ref } from "vue";

const peer = ref();
import { io } from "socket.io-client";
const socket = io("");
const channel = ref();
socket.on("connect", () => {
  console.log("connect");
  // 1.初始化peer
  const PeerConnection =
    window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection;
  peer.value = new PeerConnection({
    iceServers: [
      {
        urls: ["stun:stun1.l.google.com:19302"],
      },
      {
        urls: ["turn:wangxiang.website:3478"],
        username: "admin",
        credential: "admin",
      },
      // {
      //   urls: "turn:numb.viagenie.ca",
      //   credential: "muazkh",
      //   username: "webrtc@live.com",
      // },
      // {
      //   urls: "turn:192.158.29.39:3478?transport=udp",
      //   credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      //   username: "28224511:1379330808",
      // },
      // {
      //   urls: "turn:192.158.29.39:3478?transport=tcp",
      //   credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      //   username: "28224511:1379330808",
      // },
      // {
      //   urls: "turn:turn.bistri.com:80",
      //   credential: "homeo",
      //   username: "homeo",
      // },
      // {
      //   urls: "turn:turn.anyfirewall.com:443?transport=tcp",
      //   credential: "webrtc",
      //   username: "webrtc",
      // },
    ],
  });

  peer.value.ondatachannel = function (event) {
    var channel = event.channel;
    channel.onopen = function () {
      console.log("onopen");
      document.addEventListener("wheel", (event) => {
        console.log(
          "wheel",
          JSON.stringify({ x: event.clientX, y: event.clientY })
        );
        channel.send(
          JSON.stringify({ x: event.clientX, y: event.clientY, type: "scroll" })
        );
      });

      document.addEventListener("click", (event) => {
        console.log(
          "click",
          JSON.stringify({ x: event.clientX, y: event.clientY })
        );
        channel.send(
          JSON.stringify({ x: event.clientX, y: event.clientY, type: "click" })
        );
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

function test() {
  var params = encodeURIComponent("param1=value1&param2=value2"); // 你要传递的参数
  var url = "remote://custom-path?" + params;
  window.location.href = url;
}

function connect() {
  // 3.发送ready消息
  socket.emit("ready");
}
</script>
<style lang="scss" scoped></style>

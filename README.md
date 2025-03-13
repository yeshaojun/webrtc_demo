## 1.web

npm run dev

启动 web 服务，custom 表示客服，user 表示用户

## 2.socket

进入 serve 文件夹

node app.js 启动 socket 服务

## 3. 如果需要 electron 端

请访问 https://github.com/yeshaojun/webrtc_electron

# 实现思路
思路是这样的，
1.首先通过IM，客服向用户发送远程邀请。
2.用户接到邀请后，唤起桌面应用（或者你直接在桌面应用开发也可以）
3.建立webRTC协议； 
4.建立协议之后，用户端将媒体流传过去； 
5.客服端展示媒体流； 
6.客服端鼠标，键盘操作通过webRTC协议传给用户端； 
7.用户端收到之后操作本机电脑

单纯两个web端无法实现远程控制，只能实现在线视频，因为浏览器没有操作系统的权限，所以我额外开发了一个electron的demo


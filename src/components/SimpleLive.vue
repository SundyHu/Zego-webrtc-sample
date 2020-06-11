<template>

    <div class="container">
        <el-form ref="form" v-model="form" label-width="80px">
            <el-form-item label="房间号">
                <el-input v-model="form.roomId"/>
            </el-form-item>

            <el-form-item>
                <el-button type="success" @click="submitForm">登录房间</el-button>

                <el-button type="info" @click="sendMessage">发送消息</el-button>
            </el-form-item>
        </el-form>

        <div class="previewVideo">
            <video ref="previewVideo"></video>
        </div>
    </div>
</template>

<script lang="ts">

    import {ZegoExpressEngine} from 'zego-express-engine-webrtc'
    import {Vue, Component} from 'vue-property-decorator'

    const config = {
        appId: 873296761,
        serverUrl: "wss://webliveroom-test.zego.im/ws",
        logUrl: "wss://weblogger-test.zego.im/log",
        tokenUrl: "https://wsliveroom-alpha.zego.im:8282/token"
    }

    const zg = new ZegoExpressEngine(config.appId, config.serverUrl)

    @Component
    export default class SimpleLive extends Vue {

        form = {
            roomId: ''
        }

        $refs!: {
            form: HTMLFormElement;
            previewVideo: HTMLVideoElement;
        }

        constructor() {
            super();
        }

        submitForm() {

            const {roomId} = this.form;

            if (!roomId || '' == roomId.trim()) {
                this.$message({
                    type: 'error',
                    message: '房间号不能为空'
                })

                return;
            }

            //获取令牌
            const userID = "live-" + new Date().getTime();
            fetch(config.tokenUrl + "?app_id=" + config.appId + "&id_name=" + userID, {
                method: 'GET'
            }).then(res => {
                res.text().then(token => {

                    //登录房间
                    zg.loginRoom(roomId, token, {userID, userName: 'Jason.Lee'})
                        .then(loginSuccess => {
                            if (loginSuccess) {

                                //添加IM回调
                                zg.on('IMRecvBroadcastMessage', (roomID, chatData) => {

                                    console.log('+++ 广播消息回调：');
                                    console.log('+++ 房间：' + roomID);
                                    console.log('+++ 聊天消息：' + chatData);

                                    chatData.forEach(item => {
                                        const {fromUser, messageID, message, sendTime} = item;
                                        this.$message({
                                            type: 'info',
                                            message: '收到' + fromUser.userName + "的消息" + message
                                        })
                                    })
                                });

                                //建流
                                zg.createStream({
                                    camera: {
                                        audio: true,
                                        videoQuality: 3,
                                        video: true
                                    }
                                }).then(localVideoStream => {
                                    this.$refs.previewVideo.autoplay = true;
                                    this.$refs.previewVideo.muted = true;
                                    this.$refs.previewVideo.srcObject = localVideoStream;
                                    this.$refs.previewVideo.requestFullscreen();
                                });
                            }
                        }).catch(err => {
                        this.$message({
                            type: 'error',
                            message: err
                        })
                    })

                })
            }).catch(err => {
                this.$message({
                    type: 'error',
                    message: '获取令牌失败 ' + err
                })
            })
        }

        sendMessage() {
            zg.sendBroadcastMessage(this.form.roomId, "测试下发送消息");
        }
    }
</script>

<style scoped>

</style>
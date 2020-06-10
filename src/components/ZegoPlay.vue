<template>
    <div class="container">

        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="房间号：">
                <el-input v-model="form.roomId"></el-input>
                <el-input type="hidden" v-model="form.streamId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="loginRoom" :disabled="isLogin">登录房间(不推流)</el-button>
                <el-button type="default" @click="leave" :disabled="isLogout">退出</el-button>
            </el-form-item>

        </el-form>

        <div class="previewVideo">
            <video ref="previewVideo" autoplay muted></video>
        </div>
    </div>
</template>

<script lang="ts">

    import {ZegoExpressEngine} from 'zego-express-engine-webrtc';
    import {Vue, Component} from 'vue-property-decorator';

    const config = {
        appId: 873296761,
        serverUrl: 'wss://webliveroom-test.zego.im/ws',
        logUrl: 'wss://weblogger-test.zego.im/log',
        tokenUrl: 'https://wsliveroom-alpha.zego.im:8282/token'
    };

    const zg = new ZegoExpressEngine(config.appId, config.serverUrl);

    @Component
    export default class ZegoPlay extends Vue {

        isLogin = false
        isLogout = true
        form = {
            roomId: "",
            streamId: ""
        }

        $refs!: {
            previewVideo: HTMLVideoElement;
            form: HTMLFontElement;
        }

        constructor() {
            super();

            zg.on('roomUserUpdate', (roomID, updateType, userList) => {
                console.log('++++++++++++++++++++++++++++++++++ 更新房间用户 ++++++++++++++++++++++++++++++++++++++++++++++++');
                console.log('房间号：' + roomID);
                console.log('状态：' + updateType);
                console.log('用户列表：' + userList);
                console.log('++++++++++++++++++++++++++++++++++ end +++++++++++++++++++++++++++++++++++++++++++++++++++++++')
            });

            zg.on("roomStateUpdate", (roomID, state, errorCode, extendedData) => {
                console.log('------------------------------------------- 房间状态发生改变-------------------------------------');
                console.log('房间号：' + roomID);
                console.log('状态：' + state);
                console.log('错误码：' + errorCode);
                console.log('扩展数据：' + extendedData);
                console.log('------------------------------------------ end -----------------------------------------------')
            })

            zg.on('roomStreamUpdate', (roomID, updateType, streamList) => {
                console.log('===================================== 房间流更新 ================================================')
                console.log('房间ID: ' + roomID);
                console.log('更新状态：' + updateType);
                console.log('流列表：' + streamList);

                if (streamList && streamList.length > 0) {

                    streamList.forEach(item => {
                        const {streamID} = item;

                        //开始拉流
                        zg.startPlayingStream(streamID).then(pullStream => {
                            this.form.streamId = streamID;


                            this.$refs.previewVideo.srcObject = pullStream;
                            //显示控制
                            this.$refs.previewVideo.controls = true;
                            //this.$refs.previewVideo.width = screen.width / 2;
                            //全屏
                            //this.$refs.previewVideo.requestFullscreen();

                        })
                    })
                }
                console.log('===================================== end =====================================================');
            })

            zg.on('playerStateUpdate', (result) => {
                console.log(' ======================== 拉流状态回调 ==========================================================');
                console.log(' result ' + result);
                console.log(' ======================== end ==================================================================');
            });

            zg.on('playQualityUpdate', (streamID, playStats) => {
                console.log(' ------------------------ 拉流播放质量回调 --------------------------------------------------------');
                console.log(' streamID: ' + streamID);
                console.log(' 播放状态：' + playStats);
                console.log(' ------------------------ end -------------------------------------------------------------------')
            });

            zg.on('IMRecvBroadcastMessage', (roomID, chatData) => {

                console.log('=================================== 广播消息接收回调 ====================================')
                console.log('roomID: ' + roomID);
                console.log('chatData: ' + JSON.stringify(chatData));
                console.log('=================================== end ===============================================')

            });

            zg.on('IMRecvBarrageMessage', (roomID, chatData) => {
                console.log('=================================== 弹幕消息接收回调 ====================================')
                console.log('roomID: ' + roomID);
                console.log('chatData: ' + JSON.stringify(chatData));
                console.log('=================================== end ===============================================')
            });

        }

        loginRoom(): void {

            if ('' == this.form.roomId || '' == this.form.roomId.trim()) {
                alert('请输入房间号');
                return;
            }

            const userId = 'player_' + new Date().getTime();
            fetch(config.tokenUrl + "?app_id=" + config.appId + "&id_name=" + userId, {
                method: 'GET'
            }).then(res => {
                res.text().then(token => {
                    //登录房间
                    zg.loginRoom(this.form.roomId, token, {userID: userId, userName: 'Joe.Lee'})
                        .then(loginSuccess => {
                            if (loginSuccess) {
                                this.isLogin = true;
                                this.isLogout = false;
                            }

                        }).catch(err => {
                        alert('登录房间失败' + err);
                    })
                })
            }).catch(err => {
                alert('获取Token失败' + err);
            })
        }

        leave() {

            const {streamId, roomId} = this.form;
            if (streamId) {
                zg.stopPlayingStream(streamId);
            }

            if (roomId) {
                zg.logoutRoom(roomId);
            }

            this.isLogin = false;
            this.isLogout = true;

            //zg.stopPlayingStream(this.streamID);

            //zg.logoutRoom(this.roomId);
        }
    }
</script>

<style scoped>

</style>
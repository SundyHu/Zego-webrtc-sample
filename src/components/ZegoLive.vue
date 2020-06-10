<template>
    <div id="app">
        <el-form ref="form" v-model="form" label-width="80px">
            <el-form-item label="音频">
                <el-select v-model="form.audioDevice">
                    <el-option v-for="item in microphoneDeviceList" v-bind:key="item.deviceID"
                               v-bind:value="item.deviceID">{{item.deviceName}}
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="视频">
                <el-select v-model="form.videoDevice">
                    <el-option v-for="item in cameraDeviceList" v-bind:key="item.deviceID"
                               v-bind:value="item.deviceID">{{item.deviceName}}
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="扬声器">
                <el-select v-model="form.speakerDevice">
                    <el-option v-for="item in speakerDeviceList" v-bind:key="item.deviceID"
                               v-bind:value="item.deviceID">{{item.deviceName}}
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="房间号">
                <el-input v-model="form.roomId"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="joinRoom">加入房间(推流)</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
    import {ZegoExpressEngine} from 'zego-express-engine-webrtc'
    import {Vue, Component} from 'vue-property-decorator'

    const config = {
        appId: 873296761,
        serverUrl: 'wss://webliveroom-test.zego.im/ws',
        logUrl: 'wss://weblogger-test.zego.im/log',
        tokenUrl: 'https://wsliveroom-alpha.zego.im:8282/token'
    }

    const zg = new ZegoExpressEngine(config.appId, config.serverUrl)

    @Component
    export default class ZegoLive extends Vue {

        form = {
            audioDevice: '',
            videoDevice: '',
            speakerDevice: '',
            roomId: ''
        }

        speakerDeviceList: { deviceID: string; deviceName: string }[] = [];
        cameraDeviceList: { deviceID: string; deviceName: string }[] = [];
        microphoneDeviceList: { deviceID: string; deviceName: string }[] = [];
        $refs!: {
            form: HTMLFontElement;
        }

        mounted() {
            zg.enumDevices().then(res => {
                const {microphones, cameras, speakers} = res;

                this.speakerDeviceList = speakers;
                this.microphoneDeviceList = microphones;
                this.cameraDeviceList = cameras;

            })
        }

        joinRoom(): void {

            zg.enumDevices().then(res => {
                const {cameras} = res;
                alert(JSON.stringify(cameras));
            });
        }

    }
</script>

<style scoped>

</style>
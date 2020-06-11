<template>
    <div class="container">

        <div>
<!--            <label>Test: </label>-->
<!--            <select v-model="type">-->
<!--                <option v-for="item in list" :key="item.id" v-bind:value="item.id">{{item.name}}</option>-->
<!--            </select>-->

<!--            <button @click="exportExcel" style="display: none">确定</button>-->

            <el-button @click="exportExcel">导出</el-button>
        </div>
    </div>
</template>

<script lang="ts">

    import {Vue, Component} from 'vue-property-decorator'

    @Component
    export default class Demo extends Vue {

        type = 0;
        list: { id: number; name: string }[] = [{id: 1, name: 'test'}]

        mounted(): void {

            console.log('do mounted');

        }

        constructor() {
            super();

            this.list = [];
            for (let i = 1; i < 10; i++) {


                this.list.push({id: i, name: 'test-' + i});
            }
        }

        exportExcel() {
            fetch('http://192.168.2.3:9000/export/export', {
                method: 'GET',
                headers: {
                    'ResponseType': 'blob'
                }
            }).then(res => {

                res.blob().then(stream => {
                    const blob = new Blob([stream], {type: "application/vnd.ms-excel;charset=utf-8"});
                    const fileName = "111.xlsx";
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                })
            })
        }
    }
</script>

<style scoped>

</style>
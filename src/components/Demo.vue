<template>
    <div class="container">

        <div>
            <label>Test: </label>
            <select v-model="type">
                <option v-for="item in list" :key="item.id" v-bind:value="item.id">{{item.name}}</option>
            </select>

            <button @click="confirm">确定</button>

            <el-button>测试</el-button>
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

        confirm() {
            alert(this.type);
        }
    }
</script>

<style scoped>

</style>
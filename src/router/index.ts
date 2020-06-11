import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Home from '../views/Home.vue'
import Demo from "@/components/Demo.vue";
import ZegoPlay from "@/components/ZegoPlay.vue";
import ZegoLive from "@/components/ZegoLive.vue";
import SimpleLive from "@/components/SimpleLive.vue";
import SimplePlay from "@/components/SimplePlay.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }, {
        path: '/demo',
        name: 'Demo',
        component: Demo
    },
    {
        path: '/play',
        name: 'Play',
        component: ZegoPlay
    },
    {
        path: '/live',
        name: 'Live',
        component: ZegoLive
    },
    {
        path: '/simpleLive',
        name: 'SimpleLive',
        component: SimpleLive
    },
    {
        path: '/simplePlay',
        name: 'SimplePlay',
        component: SimplePlay
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

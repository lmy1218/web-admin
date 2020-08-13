<template>
    <el-container class="home-container">
        <!-- 导航栏 -->
        <el-header height="80px">
            <div>
                <img class="logImg" src="../assets/img/log.jpg" alt="">
                <span>王者营地</span>
            </div>
            <div>
                <el-button size="mini" type="warning" icon="iconfont icontuichu" @click="logout" round>安全退出</el-button>
            </div>
        </el-header>
        <el-container>

            <!-- 侧边栏 -->
            <el-aside :width="isshowMenu ? '63.98px' : '300px'"  >
                <el-row type="flex" justify="end"> 
                     <el-button size="medium" v-if="isshowMenu" type="warning" @click="menuShow" icon="el-icon-caret-right" ></el-button>
                     <el-button size="medium" v-else  type="warning" @click="menuShow" icon="el-icon-caret-left"></el-button>
                </el-row>
            

                <el-menu  background-color="#120706" text-color="#eee" active-text-color="#B39960" 
                    :collapse="isshowMenu" :collapse-transition="true" :router="true" :default-active="activePath" >
                    <el-submenu :index="menu.id + ''" v-for="menu in menuList" :key="menu.id" >
                        <template slot="title">
                            <i :class="menu.icon"></i> &ensp; 
                            <span v-text="menu.title">导航一</span>
                        </template>
                        <el-menu-item :index="smenu.path" v-for="smenu in menu.slist" @click="saveActive(smenu.path)" :key="smenu.id">
                            <template slot="title">
                                <i :class="smenu.icon"></i> &ensp;  
                                <span v-text="smenu.title">222</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            
            <el-container>
                <!-- 中间 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
                <!-- 底部 -->
                <el-footer>
                    <div class="footClass">
                        <p>Copyright © 2020 · 王者营地 · 备案号：蜀ICP备 20018651号</p>
                    </div>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 菜单列表
            menuList: [

            ],
            isshowMenu: true,
            activePath: '/welcome'
        }
    },
    created() {
        // 查询出 menu
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath');
    },   
    methods: {
        // 登录退出
        logout() {
            // 清楚storage中的用户信息
            window.sessionStorage.clear();
            // 跳到登录页面
            this.$router.push("/login");

        },
        // 获取菜单数据
        async getMenuList() {
            const res = await this.$http.get("/getMenu");
            if(res.status != 200) return this.$massage.error("获取菜单列表失败！");

            this.menuList = res.data;
        },
        menuShow() {
            this.isshowMenu = !this.isshowMenu
        },
        // 保存路径
        saveActive(activePath) {
            window.sessionStorage.setItem("activePath", activePath);
            this.activePath = activePath;
        }

    },
}
</script>

<style lang="less" scope>
    .home-container {
        height: 100%
    }

    .el-header {
        background-color: #120706;
        display: flex;
        justify-content: space-between;
        padding-left: 0%;
        color: #B39960;
        font-size: 20px;
        font-weight: 900;
        >div {
            display: flex;
            align-items: center;
            span {
                margin-left: 15px;
            }
        }
        
    }

    .el-aside {
        background-color: #120706;
        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .el-footer {
        background-color: #B39960;
    }

    .logImg {
        width: 135px;
        height: 80px;
    }

    .footClass {
        margin: 0 auto;
        text-align: center;
    }
    
</style>
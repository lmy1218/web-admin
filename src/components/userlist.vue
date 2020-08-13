<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主题 -->
        <el-card>

            <el-row :gutter="25">
                <el-col :span="10">
                    <!-- 搜索栏 -->
                    <el-input placeholder="请输入搜索内容" @keyup.enter.native="getUserList" v-model="queryInfo.search" clearable @clear.="getUserList" >
                        <el-button slot="append" icon="el-icon-search" @click="getUserList" ></el-button>
                    </el-input>
                </el-col>
               
                <el-col :span="4">
                    <!-- 添加用户按钮 -->
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" ></el-table-column>
                <el-table-column prop="username" label="用户名" ></el-table-column>
                <el-table-column prop="email" label="邮箱" ></el-table-column>
                <el-table-column prop="role" label="角色" ></el-table-column>
                <el-table-column label="状态" prop="state">
                <!--作用域插槽 scope.row 存储了当前行的信息 -->
                    <template slot-scope="scope">
                        <!--数据模板-->
                        <el-switch active-color="#13ce66" inactive-color="#ff4949" @change="userStateChanged(scope.row)" v-model="scope.row.state" ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template >
                        <!-- 修改 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" ></el-button>
                        <!-- 权限 -->
                        <!--文字提示 enterable 隐藏-->
                        <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.page"
                :page-sizes="[6, 10, 50, 100]"
                :page-size="queryInfo.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

        </el-card>

    </div>
</template>

<script>
export default {
    created() {
       // 获取所有用户信息
       this.getUserList(); 
    },
    data() {
        return {
            // 查询实体
            queryInfo: {
                page: 1,
                size: 6,
                search: ""
            },
            userList: [], // 用户列表信息
            total: 0, // 总数
        }
    },
    methods: {
        async getUserList() {
            const res = await this.$http.get("/getUserList", {params: this.queryInfo});
            this.userList = res.data.list;
            this.total = res.data.total;
        },
        // 最大数变化
        handleSizeChange(newSize) {
            this.queryInfo.size = newSize;
            this.getUserList();
        },
        // page发生变化
        handleCurrentChange(newPage) {
            this.queryInfo.page = newPage;
            this.getUserList();
        },
        // 状态修改
        async userStateChanged(row) {
            const res = await this.$http.put(`editState?id=${row.id}&state=${row.state}`);
            if(res.status != 200) {
                row.id = !row.id;
                return this.$message.error("操作失败！");
            }
            this.$message.success("操作成功！");
        }
    },
}
</script>

<style lang="less" scope>
    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 17px;
    }
    
</style>
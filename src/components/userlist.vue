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
                    <template slot-scope="scope"  >
                        <!-- 修改 -->
                        <el-button type="primary" @click="showEdit(scope.row.id)" icon="el-icon-edit" size="mini" ></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)" ></el-button>
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

        <!-- 添加用户卡片 -->
        <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <el-form :model="userForm" :rules="saveUserRules" ref="saveUserFormRef" label-width="100px"> 
                <!-- 用户名 -->
                <el-form-item label="用户名"  prop="username">
                    <el-input v-model="userForm.username" placeholder="请输入用户名" prefix-icon="iconfont icondenglu" ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password" >
                    <el-input type="password" v-model="userForm.password" placeholder="请输入密码" prefix-icon="iconfont iconmima" ></el-input>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item label="邮箱" prop="email" >
                    <el-input v-model="userForm.email" placeholder="请输入邮箱" prefix-icon="iconfont iconyouxiang" ></el-input>
                </el-form-item>
            </el-form>
            <!-- 操作 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false" >取消</el-button>
                <el-button type="primary" @click="saveUser">添加</el-button>
            </span>

        </el-dialog>

         <!-- 修改用户卡片 -->
        <el-dialog title="提示" :visible.sync="isShowEditDialog" width="50%" @close="editDialogClose">
            <el-form :model="editUserParams" :rules="editUserRules" ref="editUserFormRef" label-width="100px"> 
                <!-- 用户名 -->
                <el-form-item label="用户名"  prop="username">
                    <el-input v-model="editUserParams.username" prefix-icon="iconfont icondenglu" disabled></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password" >
                    <el-input type="password" v-model="editUserParams.password" placeholder="请输入密码" prefix-icon="iconfont iconmima" ></el-input>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item label="邮箱" prop="email" >
                    <el-input v-model="editUserParams.email" placeholder="请输入邮箱" prefix-icon="iconfont iconyouxiang" ></el-input>
                </el-form-item>
            </el-form>
            <!-- 操作 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowEditDialog = false" >取消</el-button>
                <el-button type="primary" @click="editUser">修改</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
import {validateEMail} from '@/utils/validator'


export default {


    created() {
       // 获取所有用户信息
       this.getUserList(); 
    },
    data() {
        return {
            /* ======== 用户查询 ======= */

            // 查询实体
            queryInfo: {
                page: 1,
                size: 6,
                search: ""
            },
            userList: [], // 用户列表信息
            total: 0, // 总数
            /*========== 用户添加 =========== */

            addDialogVisible: false, // 添加用户框的展示  
            // 添加的用户数据
            userForm: {
                username: '',
                password: '',
                email: ''
            },
            // 添加用户表单验证
            saveUserRules: {
                // 校验用户名
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                // 校验密码
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ],
                // 邮箱
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator: validateEMail, trigger: 'blur'}
                ],
            },
            /*======= 用户修改 ======= */

            // 修改的用户信息
            editUserParams: {}, 
            // 显示/隐藏修改用户栏
            isShowEditDialog: false,
             // 修改用户表单验证
            editUserRules: {
                // 校验密码
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ],
                // 邮箱
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator: validateEMail, trigger: 'blur'}
                ],
            }                            
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
        },
        // 添加用户卡片关闭
        addDialogClose() {
            this.$refs.saveUserFormRef.resetFields();
        },
        // 保存用户
        saveUser() {
            this.$refs.saveUserFormRef.validate(
                async valid => {
                    // 验证未通过
                    if(!valid) return;
                    // 请求后台数据
                    const res = await this.$http.post("addUser", this.userForm);
                    // 校验结果
                    if(res.status != 200) {
                        return this.$message.error("添加失败！");
                    } 
                    this.$message.success("添加成功！");
                    this.addDialogVisible = false;
                    this.getUserList();

                }
            );
        },
        // 根据主键删除用户
        async deleteUser(id) {
            const confirmRes =  await this.$confirm('确认要删除宝宝吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if(confirmRes != 'confirm') {
                return this.$message.info("已取消");
            }
            // 调用后台删除
            const res = await this.$http.delete("deleteUser?id=" + id);

            if(res.status !=200) {
                return this.$message.error("删除失败！");
            }
            this.$message.success("删除成功！");
            this.getUserList();
        },
        // 显示修改框并获取数据
        async showEdit(id) {
            // 查询出用户信息
            const res = await this.$http.get("/findUserById?id=" + id);
            this.editUserParams = res.data;
            // 打开窗口
            this.isShowEditDialog = true;
        },
        // 修改用户卡片关闭
        editDialogClose() {
            this.$refs.editUserFormRef.resetFields();
        },

        // 修改用户
        editUser() {
            this.$refs.editUserFormRef.validate(
                async valid => {
                    // 验证未通过
                    if(!valid) return;
                    // 请求后台数据
                    const res = await this.$http.post("editUser", this.editUserParams);
                    // 校验结果
                    if(res.status != 200) {
                        return this.$message.error("修改失败！");
                    } 
                    this.$message.success("修改成功！");
                    this.isShowEditDialog = false;
                    this.getUserList();
                }
            );
        },
    },
}
</script>

<style lang="less" scope>
    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 17px;
    }
    
</style>
<template>
    <div class="login_container">
        <!-- 登录块 -->
        <div class="login_box">
            <!-- logo -->
            <div class="avatar_box">
                <img src="@/assets/logo.jpg" alt="">
            </div>
            <!-- 表单 -->
            <el-form ref="loginFormRef"  :rules="loginRules" :model="loginParams" class="login_form" label-width="100px">
                <!-- 用户名 -->
                <el-form-item label="用户" prop="username">
                    <el-input v-model="loginParams.username" placeholder="请输入用户名" prefix-icon="iconfont icondenglu" ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码"  prop="password" >
                    <el-input type="password" v-model="loginParams.password" placeholder="请输入密码" prefix-icon="iconfont iconmima" ></el-input>
                </el-form-item>
                <!-- 提交按钮 -->
                <el-form-item class="btns" >
                    <el-button @click="login" type="primary">提交</el-button>
                    <el-button @click="resetLoginForm" type="info">重置</el-button> 
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 表单数据
            loginParams: {
                username: "admin",
                password: "121891"
            },
            // 验证
            loginRules: {
                // 校验用户名
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                // 校验密码
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 重置表单
        resetLoginForm:function() {
            this.$refs.loginFormRef.resetFields()
        },

        // 登录
        login:function() {
            this.$refs.loginFormRef.validate(
                async valid => {
                    // 未通过验证
                    if(!valid) return;
                    // 访问后台
                    const res = await this.$http.post("/login", this.loginParams);
                    // 判断是否访问成功
                    if(res.status == 200) {
                        this.$message.success("登录成功！");
                        // 存入用户信息
                        window.sessionStorage.setItem("user", res.data);
                        // 跳转到主页
                        this.$router.push({
                            path: "/home"
                        });   
                    } else if (res.status == 204){
                        this.$message.error("用户名或密码错误！");
                        return;
                    } else {
                        this.$message.error("登录失败！");
                        return;
                    }                                 
            })
        }
    },
    
}
</script>

<style lang="less" scope>
    .login_container {
        background: #e7f7f6;
        height: 100%;
    }

    .login_box {
        width: 500px;
        height: 300px;
        margin: 0 auto;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }

    .login_form {
        box-sizing: border-box;
    }
    
</style>
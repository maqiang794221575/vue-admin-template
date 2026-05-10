<template>
  <div class="app-container">
    <el-card v-loading="loading">
      <el-button @click="goBack" style="margin-bottom: 20px">返回列表</el-button>
      
      <el-form label-width="120px" v-if="userInfo">
        <el-form-item label="用户ID">
          <span>{{ userInfo.id }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span>{{ userInfo.nickname }}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{ userInfo.phone }}</span>
        </el-form-item>
        <el-form-item label="头像">
          <img :src="userInfo.avatar" alt="" style="width: 100px; height: 100px; border-radius: 50%" />
        </el-form-item>
        <el-form-item label="余额">
          <span>{{ userInfo.balance }}</span>
        </el-form-item>
        <el-form-item label="待提余额">
          <span>{{ userInfo.pending_balance }}</span>
        </el-form-item>
        <el-form-item label="已提余额">
          <span>{{ userInfo.withdrawn_balance }}</span>
        </el-form-item>
        <el-form-item label="代理等级">
          <span>{{ userInfo.agent_level > 0 ? `代理${userInfo.agent_level}` : '普通用户' }}</span>
        </el-form-item>
        <el-form-item label="邀请码">
          <span>{{ userInfo.invite_code }}</span>
        </el-form-item>
        <el-form-item label="注册时间">
          <span>{{ userInfo.created_at }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-tag :type="userInfo.status === 1 ? 'success' : 'danger'">
            {{ userInfo.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/pos'

export default {
  name: 'UserDetail',
  data() {
    return {
      loading: false,
      userInfo: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const res = await getUserInfo(this.$route.params.id)
        if (res.code === 20000) {
          this.userInfo = res.data
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    goBack() {
      this.$router.push('/user/list')
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
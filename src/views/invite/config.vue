<template>
  <div class="app-container">
    <el-card v-loading="loading">
      <el-form :model="form" label-width="120px">
        <el-form-item label="邀请奖励金额">
          <el-input v-model.number="form.reward_amount" type="number" />
        </el-form-item>
        <el-form-item label="奖励条件">
          <el-select v-model="form.reward_condition" placeholder="请选择奖励条件">
            <el-option label="注册即奖励" :value="1" />
            <el-option label="激活机具后奖励" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="多级奖励">
          <el-switch v-model="form.enable_multi_level" />
        </el-form-item>
        <el-form-item label="二级奖励比例(%)" v-if="form.enable_multi_level">
          <el-input v-model.number="form.second_level_rate" type="number" />
        </el-form-item>
        <el-form-item label="三级奖励比例(%)" v-if="form.enable_multi_level">
          <el-input v-model.number="form.third_level_rate" type="number" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getInviteConfig, updateInviteConfig } from '@/api/pos'

export default {
  name: 'InviteConfig',
  data() {
    return {
      loading: false,
      form: {
        reward_amount: 0,
        reward_condition: 2,
        enable_multi_level: false,
        second_level_rate: 0,
        third_level_rate: 0
      }
    }
  },
  created() {
    this.fetchConfig()
  },
  methods: {
    async fetchConfig() {
      this.loading = true
      try {
        const res = await getInviteConfig()
        if (res.code === 20000) {
          this.form = res.data
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async handleSubmit() {
      try {
        const res = await updateInviteConfig(this.form)
        if (res.code === 20000) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.message || '保存失败')
        }
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
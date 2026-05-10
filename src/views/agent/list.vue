<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" placeholder="请输入用户名" style="width: 200px" />
      </el-form-item>
      <el-form-item label="代理等级">
        <el-select v-model="searchForm.level" placeholder="请选择等级" style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="一级代理" :value="1" />
          <el-option label="二级代理" :value="2" />
          <el-option label="三级代理" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="nickname" label="用户名" width="120" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="agent_level" label="代理等级" width="120">
        <template slot-scope="scope">
          <el-tag type="success">代理{{ scope.row.agent_level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="agent_balance" label="代理余额" width="120" />
      <el-table-column prop="total_invited" label="邀请人数" width="100" />
      <el-table-column prop="total_earnings" label="累计收益" width="120" />
      <el-table-column prop="created_at" label="开通时间" width="180" />
      <el-table-column prop="expire_at" label="到期时间" width="180" />
    </el-table>

    <el-pagination
      :current-page="pagination.page"
      :page-size="pagination.size"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getAgentList } from '@/api/pos'

export default {
  name: 'AgentList',
  data() {
    return {
      searchForm: {
        username: '',
        level: ''
      },
      tableData: [],
      loading: false,
      pagination: {
        page: 1,
        size: 10,
        total: 0
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          size: this.pagination.size,
          ...this.searchForm
        }
        const res = await getAgentList(params)
        if (res.code === 20000) {
          this.tableData = res.data.items || []
          this.pagination.total = res.data.total || 0
        } else {
          this.tableData = []
        }
      } catch (error) {
        console.error(error)
        this.tableData = []
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.pagination.page = 1
      this.fetchData()
    },
    handleReset() {
      this.searchForm = { username: '', level: '' }
      this.pagination.page = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pagination.size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.search-form {
  margin-bottom: 20px;
}
</style>
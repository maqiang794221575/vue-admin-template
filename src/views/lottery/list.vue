<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="用户ID">
        <el-input v-model="searchForm.user_id" placeholder="请输入用户ID" style="width: 150px" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="已中奖" :value="1" />
          <el-option label="已领取" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="user_id" label="用户ID" width="100" />
      <el-table-column prop="prize_name" label="奖品名称" width="150" />
      <el-table-column prop="amount" label="金额" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 2 ? 'success' : 'warning'">
            {{ scope.row.status === 2 ? '已领取' : '已中奖' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="中奖时间" width="180" />
      <el-table-column prop="claimed_at" label="领取时间" width="180" />
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
import { getLotteryList } from '@/api/pos'

export default {
  name: 'LotteryList',
  data() {
    return {
      searchForm: {
        user_id: '',
        status: ''
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
        const res = await getLotteryList(params)
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
      this.searchForm = { user_id: '', status: '' }
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
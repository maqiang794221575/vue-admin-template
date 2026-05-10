<template>
  <div class="app-container">
    <el-button @click="goBack" style="margin-bottom: 20px">返回列表</el-button>
    
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="开始时间">
        <el-date-picker v-model="searchForm.start_date" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="searchForm.end_date" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="trans_time" label="交易时间" width="180" />
      <el-table-column prop="amount" label="交易金额" width="120" />
      <el-table-column prop="trans_status" label="交易状态" width="120" />
      <el-table-column prop="trans_type" label="交易类型" width="120" />
      <el-table-column prop="card_no" label="卡号" width="150" />
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
import { getDeviceTransaction } from '@/api/pos'

export default {
  name: 'DeviceTransaction',
  data() {
    return {
      searchForm: {
        start_date: '',
        end_date: ''
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
        const res = await getDeviceTransaction(this.$route.params.sn, params)
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
      this.searchForm = { start_date: '', end_date: '' }
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
    },
    goBack() {
      this.$router.push('/device/list')
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
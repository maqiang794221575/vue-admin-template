<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="机具号">
        <el-input v-model="searchForm.device_sn" placeholder="请输入机具号" style="width: 250px" />
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="searchForm.user_id" placeholder="请输入用户ID" style="width: 150px" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="已激活" :value="1" />
          <el-option label="未激活" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="device_sn" label="机具号" width="200" />
      <el-table-column prop="user_id" label="用户ID" width="100" />
      <el-table-column prop="name" label="机具名称" width="120" />
      <el-table-column prop="phone" label="预留手机" width="130" />
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
            {{ scope.row.status === 1 ? '已激活' : '未激活' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="bind_time" label="绑定时间" width="180" />
      <el-table-column prop="activated_time" label="激活时间" width="180" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleTransaction(scope.row)">交易记录</el-button>
          <el-button v-if="scope.row.status === 0" size="mini" type="success" @click="handleActivate(scope.row)">激活</el-button>
        </template>
      </el-table-column>
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
import { getDeviceList, activateDevice } from '@/api/pos'

export default {
  name: 'DeviceList',
  data() {
    return {
      searchForm: {
        device_sn: '',
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
        const res = await getDeviceList(params)
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
      this.searchForm = { device_sn: '', user_id: '', status: '' }
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
    handleTransaction(row) {
      this.$router.push(`/device/transaction/${row.device_sn}`)
    },
    async handleActivate(row) {
      this.$confirm('确认激活该机具？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        try {
          const res = await activateDevice(row.id)
          if (res.code === 20000) {
            this.$message.success('激活成功')
            this.fetchData()
          } else {
            this.$message.error(res.message || '操作失败')
          }
        } catch (error) {
          this.$message.error('操作失败')
        }
      }).catch(() => {})
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
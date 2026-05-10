<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" placeholder="请输入用户名" style="width: 200px" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchForm.phone" placeholder="请输入手机号" style="width: 200px" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="正常" :value="1" />
          <el-option label="禁用" :value="0" />
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
      <el-table-column prop="balance" label="余额" width="120" />
      <el-table-column prop="pending_balance" label="待提余额" width="120" />
      <el-table-column prop="withdrawn_balance" label="已提余额" width="120" />
      <el-table-column prop="agent_level" label="代理等级" width="100">
        <template slot-scope="scope">
          <span :class="scope.row.agent_level > 0 ? 'agent-tag' : ''">
            {{ scope.row.agent_level > 0 ? `代理${scope.row.agent_level}` : '普通用户' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="注册时间" width="180" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDetail(scope.row)">详情</el-button>
          <el-button size="mini" @click="handleToggleStatus(scope.row)">
            {{ scope.row.status === 1 ? '禁用' : '启用' }}
          </el-button>
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
import { getUserList, updateUserStatus } from '@/api/pos'

export default {
  name: 'UserList',
  data() {
    return {
      searchForm: {
        username: '',
        phone: '',
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
        const res = await getUserList(params)
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
      this.searchForm = { username: '', phone: '', status: '' }
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
    handleDetail(row) {
      this.$router.push(`/user/detail/${row.id}`)
    },
    async handleToggleStatus(row) {
      const confirmText = row.status === 1 ? '禁用' : '启用'
      this.$confirm(`确认${confirmText}该用户？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        try {
          const res = await updateUserStatus(row.id, row.status === 1 ? 0 : 1)
          if (res.code === 20000) {
            this.$message.success(`${confirmText}成功`)
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
.agent-tag {
  color: #E6A23C;
  font-weight: bold;
}
</style>
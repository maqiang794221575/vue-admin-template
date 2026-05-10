<template>
  <div class="app-container">
    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="user_id" label="用户ID" width="100" />
      <el-table-column prop="nickname" label="用户名" width="120" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="agent_level" label="申请等级" width="120">
        <template slot-scope="scope">
          <el-tag type="warning">代理{{ scope.row.agent_level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="支付金额" width="120" />
      <el-table-column prop="pay_type" label="支付方式" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 0 ? 'warning' : (scope.row.status === 1 ? 'success' : 'danger')">
            {{ scope.row.status === 0 ? '待审核' : (scope.row.status === 1 ? '已通过' : '已拒绝') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="申请时间" width="180" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0" size="mini" type="success" @click="handleApprove(scope.row)">通过</el-button>
          <el-button v-if="scope.row.status === 0" size="mini" type="danger" @click="handleReject(scope.row)">拒绝</el-button>
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
import { getAgentAuditList, auditAgent } from '@/api/pos'

export default {
  name: 'AgentAudit',
  data() {
    return {
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
          status: 0
        }
        const res = await getAgentAuditList(params)
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
    handleSizeChange(val) {
      this.pagination.size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.fetchData()
    },
    async handleApprove(row) {
      this.$confirm('确认通过该代理升级申请？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        try {
          const res = await auditAgent(row.id, 1, '')
          if (res.code === 20000) {
            this.$message.success('审核通过')
            this.fetchData()
          } else {
            this.$message.error(res.message || '操作失败')
          }
        } catch (error) {
          this.$message.error('操作失败')
        }
      }).catch(() => {})
    },
    async handleReject(row) {
      this.$prompt('请输入拒绝理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async ({ value }) => {
        try {
          const res = await auditAgent(row.id, 2, value)
          if (res.code === 20000) {
            this.$message.success('已拒绝')
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
</style>
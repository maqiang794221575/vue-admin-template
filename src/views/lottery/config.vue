<template>
  <div class="app-container">
    <el-card v-loading="loading">
      <el-form :model="form" label-width="120px">
        <el-form-item label="每日抽奖次数">
          <el-input v-model.number="form.daily_limit" type="number" />
        </el-form-item>
        <el-form-item label="单次抽奖消耗">
          <el-input v-model.number="form.cost" type="number" />
        </el-form-item>
        <el-form-item label="奖池金额">
          <el-input v-model.number="form.prize_pool" type="number" />
        </el-form-item>
        <el-form-item label="奖品设置">
          <el-table :data="form.prizes" border>
            <el-table-column prop="id" label="ID" width="60" />
            <el-table-column prop="name" label="奖品名称" width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" />
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="120">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.amount" type="number" />
              </template>
            </el-table-column>
            <el-table-column prop="probability" label="概率(%)" width="120">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.probability" type="number" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" @click="removePrize(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="addPrize">添加奖品</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getLotteryConfig, updateLotteryConfig } from '@/api/pos'

export default {
  name: 'LotteryConfig',
  data() {
    return {
      loading: false,
      form: {
        daily_limit: 3,
        cost: 0,
        prize_pool: 0,
        prizes: [
          { id: 1, name: '一等奖', amount: 88, probability: 1 },
          { id: 2, name: '二等奖', amount: 28, probability: 5 },
          { id: 3, name: '三等奖', amount: 10, probability: 10 },
          { id: 4, name: '四等奖', amount: 8.8, probability: 15 },
          { id: 5, name: '五等奖', amount: 6.8, probability: 20 },
          { id: 6, name: '六等奖', amount: 3.8, probability: 25 },
          { id: 7, name: '七等奖', amount: 3.3, probability: 15 },
          { id: 8, name: '八等奖', amount: 2.8, probability: 9 }
        ]
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
        const res = await getLotteryConfig()
        if (res.code === 20000) {
          this.form = res.data
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    addPrize() {
      const maxId = Math.max(...this.form.prizes.map(p => p.id))
      this.form.prizes.push({
        id: maxId + 1,
        name: `奖品${maxId + 1}`,
        amount: 0,
        probability: 0
      })
    },
    removePrize(index) {
      if (this.form.prizes.length <= 1) {
        this.$message.warning('至少保留一个奖品')
        return
      }
      this.form.prizes.splice(index, 1)
    },
    async handleSubmit() {
      try {
        const res = await updateLotteryConfig(this.form)
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
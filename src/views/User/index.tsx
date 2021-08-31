import type { Form } from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'
import { getUserPages, forbidUser } from '@/services/user'
import type { IUser } from '@/services/user'

@Component({
  name: 'UserIndex',
})
export default class UserIndex extends Vue {
  private filterForm = {
    currentPage: 1,
    pageSize: 100,
    phone: '',
    startCreateTime: '',
    endCreateTime: '',
    rangeDate: [],
  }

  private loading = true
  private users: IUser[] = []

  private async loadUsers() {
    this.loading = true
    const { rangeDate } = this.filterForm
    if (rangeDate && rangeDate.length) {
      this.filterForm.startCreateTime = rangeDate[0]
      this.filterForm.endCreateTime = rangeDate[1]
    } else {
      this.filterForm.startCreateTime = ''
      this.filterForm.endCreateTime = ''
    }

    const { data } = await getUserPages(this.filterForm)
    this.users = data.data.records
    this.loading = false
  }

  private async handleForbidUser(user: IUser): Promise<void> {
    const { data } = await forbidUser(user.id)
    console.log(data)
  }

  private handleReset() {
    this.filterForm.currentPage = 1
    this.loadUsers()
  }

  private handleQuery() {
    ;(this.$refs['filter-form'] as Form).resetFields()
    this.loadUsers()
  }

  private created() {
    this.loadUsers()
  }

  protected render(): JSX.Element {
    return (
      <div class="users">
        <el-card>
          <div slot="header">
            <el-form
              ref="filter-form"
              label-width="70px"
              props={{ model: this.filterForm }}
            >
              <el-form-item label="手机号" prop="phone">
                <el-input v-model={this.filterForm.phone}></el-input>
              </el-form-item>

              <el-form-item label="注册时间" prop="rangeDate">
                <el-date-picker
                  v-model={this.filterForm.rangeDate}
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>

              <el-form-item>
                <el-button disabled={this.loading} onClick={this.handleReset}>
                  重置
                </el-button>
                <el-button
                  type="primary"
                  onClick={this.handleQuery}
                  disabled={this.loading}
                >
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    )
  }
}

import type { Form } from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'
import { getUserPages, forbidUser } from '@/services/user'
import { getAllRoles, getUserRoles, allocateUserRoles } from '@/services/role'
import type { IUser } from '@/services/user'

@Component({
  name: 'UserIndex',
})
export default class UserIndex extends Vue {
  private filterForm = {
    currentPage: 1,
    pageSize: 10,
    phone: '',
    startCreateTime: '',
    endCreateTime: '',
    rangeDate: [],
    total: 0,
  }

  private loading = true
  private users: IUser[] = []
  private dialogVisible = false
  private currentUser: IUser | null = null
  private roles = []
  private roleIdList: number[] = []

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
    this.filterForm.total = data.data.total
    this.loading = false
  }

  private handleSizeChange(value: number) {
    this.filterForm.pageSize = value
    this.filterForm.currentPage = 1
    this.loadUsers()
  }

  private handleCurrentChange(value: number) {
    this.filterForm.currentPage = value
    this.loadUsers()
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

  private async handleSelectRole(role: IUser) {
    this.currentUser = role
    const { data } = await getAllRoles()
    this.roles = data.data
    const {
      data: { data: userRoles },
    } = await getUserRoles(this.currentUser.id)

    this.roleIdList = userRoles.map((role: IUser) => role.id)
    this.dialogVisible = true
  }

  private async handleAllocRole() {
    const data = await allocateUserRoles({
      userId: this.currentUser?.id,
      roleIdList: this.roleIdList,
    })
    console.log(data)
    this.$message.success('操作成功')
    this.dialogVisible = false
  }

  private created() {
    this.loadUsers()
  }

  protected render(): JSX.Element {
    const slots = {
      avatar: (scope: any) => (
        <img
          width="30px"
          src={
            scope.row.portrait ||
            'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
          }
        />
      ),
      status: (scope: any) => (
        <el-switch
          v-model={scope.row.status}
          activeValue="ENABLE"
          inactiveValue="DISABLE"
          activeColor="#13ce66"
          inactiveColor="#ff4949"
          onChange={() => this.handleForbidUser(scope.row)}
        ></el-switch>
      ),
      allocationRole: (scope: any) => (
        <el-button type="text" onClick={() => this.handleSelectRole(scope.row)}>
          分配角色
        </el-button>
      ),
    }
    return (
      <div class="users">
        <el-card>
          <div slot="header">
            <el-form
              ref="filter-form"
              label-width="70px"
              v-model={this.filterForm}
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
          <el-table
            data={this.users}
            style="width: 100%"
            v-loading={this.loading}
          >
            <el-table-column prop="id" label="用户ID"></el-table-column>
            <el-table-column prop="portrait" label="头像">
              {slots.avatar}
            </el-table-column>
            <el-table-column prop="name" label="用户名"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column
              prop="createTime"
              label="注册时间"
            ></el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              {slots.status}
            </el-table-column>
            <el-table-column label="操作">
              {slots.allocationRole}
            </el-table-column>
          </el-table>
          <el-pagination
            disabled={this.loading}
            current-page={this.filterForm.currentPage}
            {...{
              on: {
                'update:current-page': (value: number) => {
                  this.filterForm.currentPage = value
                },
                'size-change': this.handleSizeChange,
                'current-change': this.handleCurrentChange,
              },
            }}
            pageSizes={[5, 10, 20]}
            pageSize={this.filterForm.pageSize}
            layout="total, sizes, prev, pager, next, jumper"
            total={this.filterForm.total}
          ></el-pagination>
          <el-dialog title="分配角色" visible={this.dialogVisible} width="50%">
            <el-select v-model={this.roleIdList} multiple placeholder="请选择">
              {this.roles &&
                this.roles.length > 0 &&
                this.roles.map((role: any) => (
                  <el-option
                    key={role.id}
                    label={role.name}
                    value={role.id}
                  ></el-option>
                ))}
            </el-select>
            <span slot="footer" class="dialog-footer">
              <el-button onClick={() => (this.dialogVisible = false)}>
                取 消
              </el-button>
              <el-button type="primary" onClick={this.handleAllocRole}>
                确 定
              </el-button>
            </span>
          </el-dialog>
        </el-card>
      </div>
    )
  }
}

import { Component, Vue } from 'vue-property-decorator'
import { getRoles, deleteRole } from '@/services/role'
import type { RoleRecord } from '@/services/role'
import type { TableColumnRow } from '@/services/base.dto'

import { AxiosError } from 'axios'
import { Form } from 'element-ui'
import RoleEditForm from './EditForm'

@Component({
  name: 'RoleList',
  components: {
    RoleEditForm,
  },
})
export default class Home extends Vue {
  private form = {
    current: 1,
    size: 50,
    name: '',
  }

  private loading = false
  private roles: Array<RoleRecord> = []
  private isDialogOpen = false

  private isEditValue!: boolean
  private roleIdValue!: number | null

  private async loadRoles() {
    this.loading = true
    const { data } = await getRoles(this.form)
    this.roles = data.data.records
    this.loading = false
  }

  private onSubmit(): void {
    this.loadRoles()
  }

  private onReset(): void {
    ;(this.$refs.form as Form).resetFields()
    this.loadRoles()
  }

  private onSuccess(): void {
    this.isDialogOpen = false
    this.loadRoles()
  }
  private handleAdd(): void {
    this.isEditValue = false
    this.roleIdValue = null
    this.isDialogOpen = true
  }

  private handleEdit(row: RoleRecord): void {
    this.isDialogOpen = true
    this.roleIdValue = row.id
    this.isEditValue = true
  }

  private async handleDelete(row: RoleRecord): Promise<void> {
    try {
      await this.$confirm(`确认删除角色: ${row.name}?`, '删除提示')
      await deleteRole(row.id)
      this.$message.success('删除成功')
      this.loadRoles()
    } catch (err) {
      if (err && (err as AxiosError).response) {
        this.$message.error('删除失败，请重试')
      } else {
        this.$message.info('取消删除')
      }
    }
  }

  public mounted(): void {
    this.loadRoles()
  }

  protected render(): JSX.Element {
    const tableSlots = {
      operations: (scope: TableColumnRow<RoleRecord>) => (
        <div>
          <div>
            <el-button
              type="text"
              onClick={() =>
                this.$router.push({
                  name: 'AllocationMenu',
                  params: { roleId: scope.row.id.toString() },
                })
              }
            >
              分配菜单
            </el-button>
            <el-button
              type="text"
              onClick={() =>
                this.$router.push({
                  name: 'AllocationResource',
                  params: {
                    roleId: scope.row.id.toString(),
                  },
                })
              }
            >
              分配资源
            </el-button>
          </div>
          <div>
            <el-button type="text" onClick={() => this.handleEdit(scope.row)}>
              编辑
            </el-button>

            <el-button type="text" onClick={() => this.handleDelete(scope.row)}>
              删除
            </el-button>
          </div>
        </div>
      ),
    }
    return (
      <div class="role-list">
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <el-form ref="form" props={{ model: this.form }}>
              <el-form-item label="角色名称" prop="name">
                <el-input v-model={this.form.name}></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  onClick={this.onSubmit}
                  disabled={this.loading}
                >
                  查询搜索
                </el-button>

                <el-button onClick={this.onReset} disabled={this.loading}>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-button onClick={this.handleAdd}>添加角色</el-button>

          <el-table data={this.roles} v-loading={this.loading}>
            <el-table-column prop="id" label="编号" />
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="createdTime" label="添加时间" />
            <el-table-column align="center" width="150px" label="操作">
              {tableSlots.operations}
            </el-table-column>
          </el-table>
        </el-card>

        <el-dialog
          title={this.isEditValue ? '编辑角色' : '添加角色'}
          visible={this.isDialogOpen}
          {...{
            on: {
              'update:visible': (val: boolean) => {
                this.isDialogOpen = val
              },
            },
          }}
          width="50%"
        >
          {this.isDialogOpen && (
            <role-edit-form
              roleId={this.roleIdValue}
              isEdit={this.isEditValue}
              onSuccess={this.onSuccess}
              onCancel={() => (this.isDialogOpen = false)}
            />
          )}
        </el-dialog>
      </div>
    )
  }
}

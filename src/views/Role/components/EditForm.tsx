import { Component, Prop, Vue } from 'vue-property-decorator'
import { createOrUpdate, getRoleById } from '@/services/role'

import type { updateRoleParameter } from '@/services/role'

@Component({
  name: 'RoleEditForm',
})
export default class Home extends Vue {
  @Prop([String, Number])
  private readonly roleId!: string | number

  @Prop(Boolean)
  private readonly isEdit!: boolean

  private role: updateRoleParameter = { code: '', name: '', description: '' }

  private async loadRole() {
    const { data } = await getRoleById(this.roleId)
    this.role = data.data
  }

  private async onSubmit(): Promise<void> {
    await createOrUpdate(this.role)
    this.$message.success('操作成功')
    this.$emit('success')
  }

  private created() {
    if (this.isEdit) this.loadRole()
  }

  protected render(): JSX.Element {
    return (
      <div>
        <el-form>
          <el-form-item label="角色名称">
            <el-input v-model={this.role.name} />
          </el-form-item>
          <el-form-item label="角色编码">
            <el-input v-model={this.role.code} />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model={this.role.description} />
          </el-form-item>

          <el-form-item>
            <el-button onClick={() => this.$emit('cancel')}>取消</el-button>
            <el-button type="primary" onClick={() => this.onSubmit()}>
              确认
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    )
  }
}

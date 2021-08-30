import { Component, Vue, PropSync } from 'vue-property-decorator'
import type {Form} from 'element-ui'
import {
  RoleMenu,
  MenuDto,
  getEditMenuInfo,
  createOrUpdateMenu,
} from '@/services/menu'

@Component({
  name: 'MenuCreateOrEdit',
})
export default class MenuCreateOrEdit extends Vue {
  @PropSync('isEdit', { type: Boolean, default: false })
  private readonly isEditValue!: boolean

  private form: MenuDto = {
    parentId: -1,
    name: '',
    href: '',
    icon: '',
    orderNum: 0,
    description: '',
    shown: false,
  }

  private parentMenuList: MenuDto[] = []

  private created() {
    this.loadMenuInfo()
  }

  private async loadMenuInfo() {
    const { data } = await getEditMenuInfo(this.$route.params.id || -1)
    if (data.data.menuInfo) {
      this.form = data.data.menuInfo
    }

    if (data.code === '000000') {
      this.parentMenuList = data.data.parentMenuList
    }
  }

  private async onSubmit() {
    const { data } = await createOrUpdateMenu(this.form)

    if (data.code === '000000') {
      this.$message.success('提交成功')
      this.$router.back()
    } else {
      this.$message.warning(data.mesg)
    }

  }

  private onReset() {
    console.log((this.$refs['form'] as Form).resetFields)
    ;(this.$refs['form'] as Form).resetFields()
  }

  protected render(): JSX.Element {
    return (
      <div class="menu-create">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{this.isEditValue ? '编辑菜单' : '添加菜单'}</span>
          </div>

          <el-form ref="form" props={{ model: this.form }} labelWidth="80px">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model={this.form.name}></el-input>
            </el-form-item>
            <el-form-item label="菜单路径" prop="href">
              <el-input v-model={this.form.href}></el-input>
            </el-form-item>
            <el-form-item label="上级菜单" prop="parentId">
              <el-select
                v-model={this.form.parentId}
                placeholder="请选择上级菜单"
              >
                <el-option value={-1} label="无上级菜单"></el-option>
                {this.parentMenuList.length > 0 &&
                  this.parentMenuList.map(menu => {
                    return (
                      <el-option
                        label={menu.name}
                        value={menu.id}
                        key={menu.id}
                      ></el-option>
                    )
                  })}
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model={this.form.description}></el-input>
            </el-form-item>
            <el-form-item label="前端图标" prop="icon">
              <el-input v-model={this.form.icon}></el-input>
            </el-form-item>
            <el-form-item label="是否显示" prop="shown">
              <el-radio-group v-model={this.form.shown}>
                <el-radio label={true}>是</el-radio>
                <el-radio label={false}>否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="orderNum">
              <el-input-number
                v-model={this.form.orderNum}
                min={1}
                label="描述文字"
              ></el-input-number>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" onClick={this.onSubmit}>
                提交
              </el-button>
              {!this.isEditValue && <el-button onClick={this.onReset}>重置</el-button>}
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    )
  }
}

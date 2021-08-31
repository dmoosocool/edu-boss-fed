import { Component, Vue } from 'vue-property-decorator'
import type { Tree } from 'element-ui'
import type { RoleMenu } from '@/services/menu'

import {
  getRoleMenus,
  getMenuNodeList,
  allocateRoleMenus,
} from '@/services/menu'

@Component({
  name: 'AllocationMenu',
})
export default class Home extends Vue {
  private roleId!: string | number
  public menus: RoleMenu[] = []
  private checkedKeys: number[] = []
  private defaultProps = { children: 'subMenuList', label: 'name' }
  private loading = true

  private async created() {
    const { roleId } = this.$route.params
    this.roleId = roleId
    await this.loadMenus()
    this.loadRoleMenus()
  }

  private async loadRoleMenus() {
    const { data } = await getRoleMenus(this.roleId)
    this.getCheckedKeys(data.data)
  }

  private getCheckedKeys(menus: RoleMenu[]) {
    menus.map((menu: RoleMenu) => {
      if (menu.selected) {
        this.checkedKeys = [...this.checkedKeys, menu.id]
        // this.checkedKeys.push(menu.id)
      }
      if (menu.subMenuList) {
        this.getCheckedKeys(menu.subMenuList)
      }
    })

    this.loading = false
  }

  private async loadMenus() {
    const { data } = await getMenuNodeList()
    this.menus = data.data
  }

  private async onSave() {
    const menuIdList: number[] = (
      this.$refs['menu-tree'] as Tree
    ).getCheckedKeys()

    await allocateRoleMenus({ roleId: this.roleId, menuIdList })
    this.$message.success('操作成功')
    this.$router.back()
  }

  private async onReset() {
    ;(this.$refs['menu-tree'] as Tree).setCheckedKeys([])
  }

  protected render(): JSX.Element {
    return (
      <div class="allocation-menu">
        <el-card>
          <div slot="header">
            <span>分配菜单</span>
          </div>
          <el-tree
            ref="menu-tree"
            data={this.menus}
            v-loading={this.loading}
            nodeKey="id"
            props={{ props: this.defaultProps }}
            defaultCheckedKeys={this.checkedKeys}
            showCheckbox
            defaultExpandAll
          ></el-tree>
          <div style="text-align: center">
            <el-button onClick={this.onReset}>重置</el-button>
            <el-button type="primary" onClick={this.onSave}>
              保存
            </el-button>
          </div>
        </el-card>
      </div>
    )
  }
}

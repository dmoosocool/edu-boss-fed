import { Component, Vue } from 'vue-property-decorator'
import { getAllMenus, deleteMenu } from '@/services/menu'
import type { MenuInfo } from '@/services/menu'
@Component({
  name: 'MenuIndex',
})
export default class MenuIndex extends Vue {
  private menus: MenuInfo[] = []

  private created() {
    this.loadAllMenus()
  }

  private async loadAllMenus() {
    const { data } = await getAllMenus()
    if (data.code === '000000') this.menus = data.data
  }

  private handleEdit(item: any) {
    this.$router.push({ name: 'MenuEdit', params: { id: item.id } })
  }

  private handleDelete(item: any) {
    this.$confirm('确认删除吗?', '删除提示', {})
      .then(async () => {
        const { data } = await deleteMenu(item.id)
        data.code === '000000' &&
          this.$message.success('删除成功') &&
          this.loadAllMenus()
      })
      .catch(() => this.$message.info('已取消删除'))
  }

  protected render(): JSX.Element {
    const slots = {
      operations: (scope: any) => (
        <div>
          <el-button size="mini" onClick={() => this.handleEdit(scope.row)}>
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            onClick={() => this.handleDelete(scope.row)}
          >
            删除
          </el-button>
        </div>
      ),
    }
    return (
      <div class="menu">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button
              onClick={() => this.$router.push({ name: 'MenuCreate' })}
            >
              添加菜单
            </el-button>
          </div>

          <el-table data={this.menus} style="width: 100%">
            <el-table-column
              label="编号"
              min-width="150"
              type="index"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="菜单名称"
              min-width="150"
            ></el-table-column>
            <el-table-column
              prop="level"
              label="菜单级数"
              min-width="150"
            ></el-table-column>
            <el-table-column
              prop="icon"
              label="前端图标"
              min-width="150"
            ></el-table-column>
            <el-table-column
              prop="orderNum"
              label="排序"
              min-width="150"
            ></el-table-column>
            <el-table-column label="操作" min-width="150">
              {slots.operations}
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    )
  }
}

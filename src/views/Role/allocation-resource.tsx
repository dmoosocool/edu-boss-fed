import { Component, Vue } from 'vue-property-decorator'

import {
  getAllResources,
  allocateRoleResources,
  getRoleResources,
  IResource,
  IRoleResource,
} from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import type { ResourceCategory } from '@/services/resource-category'
import type { Tree } from 'element-ui'

@Component({
  name: 'AllocationResource',
})
export default class AllocationResource extends Vue {
  private roleId!: string | number
  public resources!: ResourceCategory[]
  private checkedKeys: Array<number> = []
  private defaultProps = { children: 'children', label: 'name' }
  private loading = true

  private async created() {
    const { roleId } = this.$route.params
    this.roleId = roleId
    await this.loadResources()
    this.loadRoleResources()
  }

  private async loadRoleResources() {
    const [resourceResp, categoryResp] = await Promise.all([
      getAllResources(),
      getResourceCategories(),
    ])

    const { data: resources } = resourceResp.data
    const { data: categories } = categoryResp.data

    resources.map((r: IResource) => {
      const category = categories.find(
        (c: ResourceCategory) => c.id === r.categoryId,
      )
      if (category) {
        category.children = category.children || []
        category.children.push(r)
      }
    })

    categories.map((item: ResourceCategory) => {
      item.id = Math.random()
    })

    this.resources = categories
    this.loading = false
  }

  private async loadResources() {
    const { data } = await getRoleResources(this.roleId)
    this.getCheckedResources(data.data)
  }

  private getCheckedResources(resources: IRoleResource[]) {
    resources.map((r: IRoleResource) => {
      if (r.resourceList) {
        r.resourceList.map((c: IResource) => {
          c.selected && (this.checkedKeys = [...this.checkedKeys, c.id])
        })
      }
    })
  }

  private async onSave() {
    const checkedNodes = (this.$refs['tree'] as Tree).getCheckedNodes()
    const resourceIdList: number[] = []
    checkedNodes.map(node => !node.children && resourceIdList.push(node.id))
    await allocateRoleResources({ roleId: this.roleId, resourceIdList })
    this.$message.success('保存成功')
    this.$router.back()
  }

  private async onReset() {
    ;(this.$refs['tree'] as Tree).setCheckedKeys([])
  }

  protected render(): JSX.Element {
    return (
      <div class="allocation-resource">
        <el-card>
          <div slot="header">
            <span>分配资源</span>
          </div>
          <el-tree
            ref="tree"
            data={this.resources}
            v-loading={this.loading}
            nodeKey="id"
            props={{ props: this.defaultProps }}
            defaultCheckedKeys={this.checkedKeys}
            defaultExpandedKeys={this.checkedKeys}
            showCheckbox
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

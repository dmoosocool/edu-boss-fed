import { Component, Vue } from 'vue-property-decorator'
import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import type { ResourceCategory } from '@/services/resource-category'
import type { getResourcePagesQueryDto } from '@/services/resource'
import type { TableColumnRow } from '@/services/base.dto'
import type { Form } from 'element-ui'

@Component({
  name: 'ResourceList',
})
export default class ResourceList extends Vue {
  private resources: getResourcePagesQueryDto[] = []
  private form = {
    name: '',
    url: '',
    current: 1,
    size: 5,
    categoryId: null,
  }
  private totalCount = 0
  private resourceCategories: ResourceCategory[] = []
  private isLoading = true

  private created() {
    this.loadResources()
    this.loadResourceCategories()
  }

  private async loadResourceCategories() {
    const { data } = await getResourceCategories()
    this.resourceCategories = data.data
  }

  private async loadResources() {
    this.isLoading = true
    const { data } = await getResourcePages(this.form)
    this.resources = data.data.records
    this.totalCount = data.data.total
    this.isLoading = false
  }

  private onSubmit() {
    this.form.current = 1
    this.loadResources()
  }

  private handleEdit(item: ResourceCategory) {
    console.log('handleEdit', item)
  }

  private handleDelete(item: ResourceCategory) {
    console.log('handleDelete', item)
  }

  private handleSizeChange(value: number) {
    this.form.size = value
    this.form.current = 1
    this.loadResources()
  }

  private handleCurrentChange(value: number) {
    this.form.current = value
    this.loadResources()
  }

  private onReset() {
    ;(this.$refs['form'] as Form).resetFields()
    this.form.current = 1
    this.loadResources()
  }

  protected render(): JSX.Element {
    const listSlots = {
      operations: (scope: TableColumnRow<ResourceCategory>) => (
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
      <div class="resource-list">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-form ref="form" props={{ model: this.form }} label-width="80px">
              <el-form-item prop="name" label="资源名称">
                <el-input v-model={this.form.name}></el-input>
              </el-form-item>
              <el-form-item prop="url" label="资源路径">
                <el-input v-model={this.form.url}></el-input>
              </el-form-item>
              <el-form-item prop="categoryId" label="资源分类">
                <el-select
                  v-model={this.form.categoryId}
                  placeholder="请选择资源分类"
                  clearable
                >
                  {/* <el-option
                label="item.name"
                value="item.id"
                v-for="item in resourceCategories"
                key="item.id"
              ></el-option> */}
                  {this.resourceCategories.length > 0 &&
                    this.resourceCategories.map((item: ResourceCategory) => (
                      <el-option
                        label={item.name}
                        value={item.id}
                        key={item.id}
                      ></el-option>
                    ))}
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  onClick={this.onSubmit}
                  disabled={this.isLoading}
                >
                  查询搜索
                </el-button>
                <el-button onClick={this.onReset} disabled={this.isLoading}>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            data={this.resources}
            style="width: 100%; margin-bottom: 20px"
            v-loading={this.isLoading}
          >
            <el-table-column type="index" label="编号"></el-table-column>
            <el-table-column prop="name" label="资源名称"></el-table-column>
            <el-table-column prop="url" label="资源路径"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column
              prop="createdTime"
              label="添加时间"
            ></el-table-column>
            <el-table-column label="操作">
              {listSlots.operations}
            </el-table-column>
          </el-table>

          <el-pagination
            disabled={this.isLoading}
            current-page={this.form.current}
            {...{
              on: {
                'update:current-page': (value: number) => {
                  this.form.current = value
                },
                'size-change': this.handleSizeChange,
                'current-change': this.handleCurrentChange,
              },
            }}
            pageSizes={[5, 10, 20]}
            pageSize={this.form.size}
            layout="total, sizes, prev, pager, next, jumper"
            total={this.totalCount}
          ></el-pagination>
        </el-card>
      </div>
    )
  }
}

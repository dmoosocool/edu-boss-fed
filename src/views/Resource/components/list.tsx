import { Component, Vue } from 'vue-property-decorator'
import { getResourcePages, deleteResource } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import ResourceFrom from './form'
import type { ResourceCategory } from '@/services/resource-category'
import type { getResourcePagesQueryDto } from '@/services/resource'
import type { TableColumnRow } from '@/services/base.dto'
import type { Form } from 'element-ui'
import type { AxiosError } from 'axios'

@Component({
  name: 'ResourceList',
  components: {
    ResourceFrom,
  },
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
  private isDialogOpen = false
  private isEdit = false
  private resourceId!: number | null

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
    this.isDialogOpen = true
    this.isEdit = true
    this.resourceId = item.id
    console.log('handleEdit', item)
  }

  private async handleDelete(item: ResourceCategory) {
    try {
      await this.$confirm(`确认删除资源: ${item.name}?`, '删除提示')
      await deleteResource(item.id)
      this.$message.success('删除成功')
      this.loadResources()
      this.loadResourceCategories()
    } catch (err) {
      if (err && (err as AxiosError).response) {
        this.$message.error('删除失败，请重试')
      } else {
        this.$message.info('取消删除')
      }
    }
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

  private handleRepositoryEdit() {
    this.isDialogOpen = true
    this.isEdit = false
  }

  private onSuccess(): void {
    this.isDialogOpen = false
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
          <el-button onClick={this.handleRepositoryEdit}>添加资源</el-button>
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

        <el-dialog
          title={this.isEdit ? '编辑资源' : '添加资源'}
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
            <ResourceFrom
              resourceId={this.resourceId}
              isEdit={this.isEdit}
              onSuccess={this.onSuccess}
              onCancel={() => (this.isDialogOpen = false)}
            />
          )}
        </el-dialog>
      </div>
    )
  }
}

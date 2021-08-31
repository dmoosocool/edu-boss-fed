import { Component, PropSync, Vue } from 'vue-property-decorator'
import { getResourceCategories } from '@/services/resource-category'
import { getResourceById, saveOrUpdate } from '@/services/resource'

import type { ResourceCategory } from '@/services/resource-category'
import type { IResourceRequestDto } from '@/services/resource'
@Component({
  name: 'ResourceEditForm',
})
export default class ResourceEditForm extends Vue {
  @PropSync('resourceId', [String, Number])
  private readonly resourceIdValue!: string | number

  @PropSync('isEdit', Boolean)
  private readonly isEditValue!: boolean

  private loading = true

  private resourceCategories: ResourceCategory[] = []

  private form: IResourceRequestDto = {
    name: '',
    url: '',
    description: '',
    categoryId: null,
  }

  private async onSubmit(): Promise<void> {
    const { data } = await saveOrUpdate(this.form)
    if (data.code === '000000') {
      this.$message.success('操作成功')
      this.$emit('success')
    } else {
      this.$message.warning(data.mesg)
    }
  }

  private created() {
    this.loadResourceCategories()
    this.loading = false
    if (this.isEditValue) {
      this.getResource()
    }
  }

  private async getResource() {
    const { data } = await getResourceById(this.resourceIdValue)
    this.form = data.data
  }

  private async loadResourceCategories() {
    const { data } = await getResourceCategories()
    this.resourceCategories = data.data
  }

  protected render(): JSX.Element {
    return (
      <div>
        <el-form v-loading={this.loading}>
          <el-form-item label="资源名称" prop="name">
            <el-input v-model={this.form.name} />
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model={this.form.url} />
          </el-form-item>

          <el-form-item label="描述" prop="description">
            <el-input v-model={this.form.description} />
          </el-form-item>

          <el-form-item label="资源分类" prop="categoryId">
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

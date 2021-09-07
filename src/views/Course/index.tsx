import { Component, Vue } from 'vue-property-decorator'
import { changeState, getQueryCourses } from '@/services/course'
import type { ICourse } from '@/services/course'
import type { Form } from 'element-ui'

@Component({
  name: 'CourseIndex',
})
export default class CourseIndex extends Vue {
  private filterForm = {
    currentPage: 1,
    pageSize: 10,
    courseName: '',
    status: '',
  }

  private courses: ICourse[] = []
  private totalCount = 0
  private loading = true

  private handleReset(): void {
    ;(this.$refs.form as Form).resetFields()
    this.filterForm.currentPage = 1
    this.loadCourses()
  }
  private handleFilter(): void {
    this.filterForm.currentPage = 1
    this.loadCourses()
  }
  private async onStateChange(course: ICourse): Promise<void> {
    course.isStatusLoading = true
    const { data } = await changeState({
      courseId: course.id,
      status: course.status,
    })

    if (data.code === '000000') {
      this.$message.success(`${course.status === 0 ? '下架' : '上架'}成功`)
    } else {
      this.$message.warning(data.mesg)
    }
    course.isStatusLoading = false
  }

  private handleCurrentChange(page: number): void {
    this.filterForm.currentPage = page
    this.loadCourses()
  }

  private async loadCourses(): Promise<void> {
    this.loading = true
    const { data } = await getQueryCourses(this.filterForm)

    console.log(data)
    data.data.records.forEach((course: ICourse) => {
      course.isStatusLoading = false
    })
    this.courses = data.data.records
    this.totalCount = data.data.total

    this.loading = false
  }

  private created(): void {
    this.loadCourses()
  }

  protected render(): JSX.Element {
    return (
      <div class="course">
        <el-card>
          <div slot="header">
            <span>数据筛选</span>
          </div>
          <el-form
            ref="form"
            labelWidth="70px"
            labelPosition="left"
            props={{ model: this.filterForm }}
          >
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model={this.filterForm.courseName}></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model={this.filterForm.status}>
                <el-option label="全部" value=""></el-option>
                <el-option label="上架" value="1"></el-option>
                <el-option label="下架" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button disabled={this.loading} onClick={this.handleReset}>
                重置
              </el-button>
              <el-button
                type="primary"
                disabled={this.loading}
                onClick={this.handleFilter}
              >
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card>
          <div slot="header">
            <span>查询结果：</span>
            <el-button
              type="primary"
              style="float: right; margin-top: -5px"
              onClick={() => this.$router.push({ name: 'courseCreate' })}
            >
              添加课程
            </el-button>
          </div>

          <el-table
            data={this.courses}
            v-loading={this.loading}
            style="width: 100%; margin-bottom: 20px"
          >
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column
              prop="courseName"
              label="课程名称"
            ></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="sortNum" label="排序"></el-table-column>
            <el-table-column prop="status" label="上架状态">
              {(scope: { row: ICourse }) => {
                if (scope.row !== undefined) {
                  return (
                    <el-switch
                      v-model={scope.row.status}
                      activeColor="#13ce66"
                      inactiveColor="#ff4949"
                      activeValue={1}
                      inactiveValue={0}
                      disabled={scope.row.isStatusLoading}
                      onChange={() => this.onStateChange(scope.row)}
                    />
                  )
                }
              }}
            </el-table-column>
            <el-table-column prop="price" label="操作" align="center">
              {(scope: { row: ICourse }) => (
                <div>
                  <el-button
                    onClick={() =>
                      this.$router.push({
                        name: 'CourseEdit',
                        params: {
                          courseId:
                            scope.row.id === undefined
                              ? ''
                              : scope.row.id.toString(),
                        },
                      })
                    }
                  >
                    编辑
                  </el-button>
                  <el-button
                    onClick={() =>
                      this.$router.push({
                        name: 'CourseSection',
                        params: {
                          courseId:
                            scope.row.id === undefined
                              ? ''
                              : scope.row.id.toString(),
                        },
                      })
                    }
                  >
                    内容管理
                  </el-button>
                </div>
              )}
            </el-table-column>
          </el-table>

          <el-pagination
            background
            layout="prev, pager, next"
            total={this.totalCount}
            disabled={this.loading}
            {...{
              on: {
                'current-change': this.handleCurrentChange,
              },
            }}
          />
        </el-card>
      </div>
    )
  }
}

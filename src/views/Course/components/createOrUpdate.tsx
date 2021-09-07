import { Component, Vue, PropSync } from 'vue-property-decorator'
import {
  saveOrUpdateCourse,
  getCourseById,
  ICourse,
  ITeacherDTO,
  IActivityCourseDTO,
} from '@/services/course'
import CourseImage from './courseImage'
import TextEditor from '@/components/TextEditor'
import moment from 'moment'

interface IStep {
  title: string
  icon: string
}
@Component({
  name: 'CourseCreateOrUpdate',
  components: {
    CourseImage,
    TextEditor,
  },
})
export default class CourseCreateOrUpdate extends Vue {
  @PropSync('isEdit', { type: Boolean, default: false })
  private readonly isEditValue!: boolean

  @PropSync('courseId', { type: [String, Number], default: '' })
  private readonly courseIdValue!: string

  private activeStep = 0

  private steps: IStep[] = [
    { title: '基本信息', icon: 'el-icon-edit' },
    { title: '课程封面', icon: 'el-icon-edit' },
    { title: '销售信息', icon: 'el-icon-edit' },
    { title: '秒杀活动', icon: 'el-icon-edit' },
    { title: '课程详情', icon: 'el-icon-edit' },
  ]

  private course: ICourse = {
    // id: 0,
    courseName: '',
    brief: '',
    teacherDTO: {
      // id: 0,
      // courseId: 0,
      teacherName: '',
      teacherHeadPicUrl: '',
      position: '',
      description: '',
    },
    courseDescriptionMarkDown: '',
    price: 0,
    discounts: 0,
    priceTag: '',
    discountsTag: '',
    isNew: true,
    isNewDes: '',
    courseListImg: '',
    courseImgUrl: '',
    sortNum: 0,
    previewFirstField: '',
    previewSecondField: '',
    status: 0, // 0：未发布，1：已发布
    sales: 0,
    activityCourse: false, // 是否开启活动秒杀
    activityCourseDTO: {
      // id: 0,
      // courseId: 0,
      beginTime: '',
      endTime: '',
      amount: 0,
      stock: 0,
    },
    autoOnlineTime: '',
  }

  private created() {
    if (this.isEditValue) this.loadCourse()
  }

  private async loadCourse() {
    const { data } = await getCourseById(this.courseIdValue)
    const { activityCourseDTO } = data.data
    if (activityCourseDTO) {
      activityCourseDTO.beginTime = moment(activityCourseDTO.beginTime).format(
        'YYYY-MM-DD',
      )
      activityCourseDTO.endTime = moment(activityCourseDTO.endTime).format(
        'YYYY-MM-DD',
      )
    }

    this.course = data.data
  }

  private async handleSave() {
    const { data } = await saveOrUpdateCourse(this.course)
    if (data.code === '000000') {
      this.$message.success('保存成功')
      this.$router.push({ name: 'CourseIndex' })
    } else {
      this.$message.error('保存失败')
    }
  }

  protected render(): JSX.Element {
    return (
      <el-card>
        <div slot="header">
          <el-steps active={this.activeStep} simple>
            {this.steps &&
              this.steps.length > 0 &&
              this.steps.map((step: IStep, n: number) => (
                <el-step
                  title={step.title}
                  icon={step.icon}
                  key={n}
                  onClick={() => (this.activeStep = n)}
                ></el-step>
              ))}
          </el-steps>
        </div>
        <el-form labelWidth="80px">
          {this.activeStep === 0 && (
            <div>
              <el-form-item label="课程名称">
                <el-input v-model={this.course.courseName}></el-input>
              </el-form-item>
              <el-form-item label="课程简介">
                <el-input v-model={this.course.brief}></el-input>
              </el-form-item>
              <el-form-item label="课程概述">
                <el-input
                  style="margin-bottom: 10px"
                  v-model={this.course.previewFirstField}
                  type="textarea"
                  placeholder="概述1"
                ></el-input>
                <el-input
                  v-model={this.course.previewSecondField}
                  type="textarea"
                  placeholder="概述2"
                ></el-input>
              </el-form-item>
              <el-form-item label="讲师姓名">
                <el-input
                  v-model={(this.course.teacherDTO as ITeacherDTO).teacherName}
                ></el-input>
              </el-form-item>
              <el-form-item label="讲师简介">
                <el-input
                  v-model={(this.course.teacherDTO as ITeacherDTO).description}
                ></el-input>
              </el-form-item>
              <el-form-item label="课程排序">
                <el-input-number
                  v-model={this.course.sortNum}
                  label="描述文字"
                ></el-input-number>
              </el-form-item>
            </div>
          )}

          {this.activeStep === 1 && (
            <div>
              <el-form-item label="课程封面">
                <course-image v-model={this.course.courseListImg} limit={5} />
              </el-form-item>
              <el-form-item label="介绍封面">
                <course-image limit={5} v-model={this.course.courseImgUrl} />
              </el-form-item>
            </div>
          )}

          {this.activeStep === 2 && (
            <div>
              <el-form-item label="售卖价格">
                <el-input v-model={this.course.discounts} type="number">
                  <div slot="append">元</div>
                </el-input>
              </el-form-item>
              <el-form-item label="商品原价">
                <el-input v-model={this.course.price} type="number">
                  <div slot="append">元</div>
                </el-input>
              </el-form-item>
              <el-form-item label="销量">
                <el-input v-model={this.course.sales} type="number">
                  <div slot="append">单</div>
                </el-input>
              </el-form-item>
              <el-form-item label="活动标签">
                <el-input v-model={this.course.discountsTag}></el-input>
              </el-form-item>
            </div>
          )}

          {this.activeStep === 3 && (
            <div>
              <el-form-item label="限时秒杀开关">
                <el-switch
                  v-model={this.course.activityCourse}
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
              {this.course.activityCourse && (
                <div>
                  <el-form-item label="开始时间">
                    <el-date-picker
                      v-model={
                        (this.course.activityCourseDTO as IActivityCourseDTO)
                          .beginTime
                      }
                      type="date"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                  <el-form-item label="结束时间">
                    <el-date-picker
                      v-model={
                        (this.course.activityCourseDTO as IActivityCourseDTO)
                          .endTime
                      }
                      type="date"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                  <el-form-item label="秒杀价">
                    <el-input
                      v-model={
                        (this.course.activityCourseDTO as IActivityCourseDTO)
                          .amount
                      }
                      type="number"
                    >
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="秒杀库存">
                    <el-input
                      v-model={
                        (this.course.activityCourseDTO as IActivityCourseDTO)
                          .stock
                      }
                      type="number"
                    >
                      <template slot="append">个</template>
                    </el-input>
                  </el-form-item>
                </div>
              )}
            </div>
          )}

          {this.activeStep === 4 && (
            <div>
              <el-form-item label="课程详情">
                <text-editor v-model={this.course.courseDescriptionMarkDown} />
              </el-form-item>
              <el-form-item label="是否发布">
                <el-switch
                  v-model={this.course.status}
                  active-value="1"
                  inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" onClick={this.handleSave}>
                  保存
                </el-button>
              </el-form-item>
            </div>
          )}

          {this.activeStep >= 0 && this.activeStep < 4 && (
            <el-form-item>
              <el-button onClick={() => this.activeStep++}>下一步</el-button>
            </el-form-item>
          )}
        </el-form>
      </el-card>
    )
  }
}

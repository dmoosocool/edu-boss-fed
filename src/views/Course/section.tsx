import { Component, Vue, PropSync } from 'vue-property-decorator'
import type { Form } from 'element-ui'
import { getSectionById, ICourse, ILesson, ISection } from '@/services/course'
import './section.scss'

import {
  getSectionAndLesson,
  saveOrUpdateSection,
  saveOrUpdateLesson,
  getCourseById,
} from '@/services/course'

@Component({
  name: 'CourseSection',
})
export default class CourseSection extends Vue {
  @PropSync('courseId', { type: [String, Number], required: true })
  private readonly courseIdValue!: string | number

  private course: ICourse = {
    courseName: '',
    activityCourse: false,
    autoOnlineTime: '',
    brief: '',
    courseDescriptionMarkDown: '',
    courseImgUrl: '',
    courseListImg: '',
    discounts: 0,
    discountsTag: '',
    isNew: false,
    isNewDes: '',
    previewFirstField: '',
    previewSecondField: '',
    price: 0,
    priceTag: '',
    sales: 0,
    sortNum: 0,
    status: 0,
  }

  private defaultProps = {
    children: 'lessonDTOS',
    label(data: { sectionName: string; theme: string }) {
      return data.sectionName || data.theme
    },
  }

  private section: ISection = {
    courseId: this.courseIdValue,
    sectionName: '',
    description: '',
    orderNum: 0,
    status: 0,
  }

  private lesson: ILesson = {
    courseId: this.courseIdValue,
    sectionId: undefined,
    sectionName: '',
    theme: '',
    duration: 0,
    isFree: false,
    orderNum: 0,
    status: 0,
  }

  private sections: ISection[] = []
  private isAddSectionShow = false
  private isAddLessonShow = false
  private isLoading = false

  private async loadSections() {
    const { data } = await getSectionAndLesson(this.courseIdValue)
    this.sections = data.data
  }

  private async loadCourse() {
    const { data } = await getCourseById(this.courseIdValue)
    this.course = data.data
  }

  private handleShowAddSection() {
    this.section = {
      courseId: this.courseIdValue,
      sectionName: '',
      description: '',
      orderNum: 0,
      status: 0,
    }
    this.isAddSectionShow = true
  }

  private async handleAddSection() {
    await saveOrUpdateSection(this.section)
    this.loadSections()
    this.isAddSectionShow = false
    ;(this.$refs['section-form'] as Form).resetFields()
    this.$message.success('????????????')
  }

  private async handleEditSectionShow(section: ISection) {
    if (section.id) {
      const { data } = await getSectionById(section.id)
      this.section = data.data
      this.isAddSectionShow = true
    }
  }

  private async handleSectionStatusChange(section: ISection) {
    await saveOrUpdateSection(section)
    this.$message.success('????????????')
  }

  private async handleLessonStatusChange(lesson: ILesson) {
    await saveOrUpdateLesson(lesson)
    this.$message.success('????????????')
  }

  private handleShowAddLesson(data: {
    sectionName: string
    id: undefined | string | number
  }) {
    this.lesson = {
      sectionName: data.sectionName,
      sectionId: data.id,
      courseId: this.courseIdValue,
      theme: '',
      duration: 0,
      isFree: false,
      orderNum: 0,
      status: 0,
    }
    this.isAddLessonShow = true
  }

  private async handleAddLesson() {
    await saveOrUpdateLesson(this.lesson)
    this.$message.success('????????????')
    this.loadSections()
    this.isAddLessonShow = false
  }

  private handleShowEditLesson(lesson: ILesson, section: ISection) {
    this.lesson = lesson
    this.lesson.sectionName = section.sectionName
    this.isAddLessonShow = true

    console.log(this.section)
  }

  private handleAllowDrop(draggingNode: any, dropNode: any, type: string) {
    return (
      draggingNode.data.sectionId === dropNode.data.sectionId &&
      type !== 'inner'
    )
  }

  private async handleSort(dragNode: any, dropNode: any) {
    this.isLoading = true
    try {
      await Promise.all(
        dropNode.parent.childNodes.map((item: any, index: number) => {
          if (dragNode.data.lessonDTOS) {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1,
            })
          } else {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1,
            })
          }
        }),
      )
      this.$message.success('????????????')
    } catch (e) {
      console.log(e)
      this.$message.error('????????????')
    } finally {
      this.isLoading = false
    }
  }

  private created() {
    this.loadSections()
    this.loadCourse()
  }

  protected render(): JSX.Element {
    return (
      <div class="course-section">
        <el-card>
          <div class="card-header" slot="header">
            {this.course.courseName}
            <el-button type="primary" onClick={this.handleShowAddSection}>
              ????????????
            </el-button>
          </div>
          <el-tree
            data={this.sections}
            props={{ props: this.defaultProps }}
            draggable
            allowDrop={this.handleAllowDrop}
            v-loading={this.isLoading}
            onNodeDrop={this.handleSort}
          >
            {({ node, data }: { node: any; data: any }) => (
              <div class="inner">
                <span>{node.label}</span>
                {data.sectionName ? (
                  <span class="action">
                    <el-button
                      onClick={(e: Event) => {
                        e.stopPropagation()
                        this.handleEditSectionShow(data)
                      }}
                    >
                      ??????
                    </el-button>
                    <el-button
                      type="primary"
                      onClick={(e: Event) => {
                        e.stopPropagation()
                        this.handleShowAddLesson(data)
                      }}
                    >
                      ????????????
                    </el-button>
                    <el-select
                      class="select-status"
                      v-model={data.status}
                      placeholder="?????????"
                      onChange={() => this.handleSectionStatusChange(data)}
                    >
                      <el-option label="?????????" value={0}></el-option>
                      <el-option label="?????????" value={1}></el-option>
                      <el-option label="?????????" value={2}></el-option>
                    </el-select>
                  </span>
                ) : (
                  <span>
                    <el-button
                      onClick={() =>
                        this.handleShowEditLesson(data, node.parent.data)
                      }
                    >
                      ??????
                    </el-button>
                    <el-button
                      onClick={() =>
                        this.$router.push({
                          name: 'CourseVideo',
                          params: { courseId: this.courseIdValue.toString() },
                          query: {
                            sectionId: node.parent.id,
                            lessonId: data.id,
                          },
                        })
                      }
                      type="success"
                    >
                      ????????????
                    </el-button>

                    <el-select
                      class="select-status"
                      v-model={data.status}
                      placeholder="?????????"
                      onChange={() => this.handleLessonStatusChange(data)}
                    >
                      <el-option label="?????????" value={0}></el-option>
                      <el-option label="?????????" value={1}></el-option>
                      <el-option label="?????????" value={2}></el-option>
                    </el-select>
                  </span>
                )}
              </div>
            )}
          </el-tree>
        </el-card>

        <el-dialog
          title="??????????????????"
          visible={this.isAddSectionShow}
          {...{
            on: {
              'update:visible': (value: boolean) => {
                this.isAddSectionShow = value
              },
            },
          }}
        >
          <el-form
            ref="section-form"
            props={{ model: this.section }}
            labelWidth="70px"
          >
            <el-form-item label="????????????">
              <el-input
                v-model={this.course.courseName}
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="????????????" prop="sectionName">
              <el-input
                v-model={this.section.sectionName}
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="????????????" prop="description">
              <el-input
                v-model={this.section.description}
                type="textarea"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="????????????" prop="orderNum">
              <el-input-number
                v-model={this.section.orderNum}
              ></el-input-number>
            </el-form-item>
          </el-form>
          <div class="dialog-footer" slot="footer">
            <el-button onClick={() => (this.isAddSectionShow = false)}>
              ??????
            </el-button>
            <el-button type="primary" onClick={this.handleAddSection}>
              ??????
            </el-button>
          </div>
        </el-dialog>

        {this.isAddLessonShow && (
          <el-dialog
            title="????????????"
            visible={this.isAddLessonShow}
            {...{
              on: {
                'update:visible': (value: boolean) => {
                  this.isAddLessonShow = value
                },
              },
            }}
          >
            <el-form
              ref="lesson-form"
              props={{ model: this.lesson }}
              labelWidth="100px"
            >
              <el-form-item label="????????????">
                {console.log('????????????', this.course.courseName, this.lesson)}
                <el-input
                  v-model={this.course.courseName}
                  autocomplete="off"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="????????????" prop="sectionName">
                <el-input
                  v-model={this.lesson.sectionName}
                  disabled
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="????????????" prop="theme">
                <el-input v-model={this.lesson.theme} autocomplete="off" />
              </el-form-item>
              <el-form-item label="??????" prop="duration">
                <el-input
                  v-model={this.lesson.duration}
                  type="number"
                  autocomplete="off"
                >
                  <span slot="append">??????</span>
                </el-input>
              </el-form-item>
              <el-form-item label="??????????????????" prop="isFree">
                <el-switch v-model={this.lesson.isFree} />
              </el-form-item>
              <el-form-item label="????????????" prop="orderNum">
                <el-input-number v-model={this.lesson.orderNum} />
              </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
              <el-button onClick={() => (this.isAddLessonShow = false)}>
                ??????
              </el-button>

              <el-button type="primary" onClick={this.handleAddLesson}>
                ??????
              </el-button>
            </div>
          </el-dialog>
        )}
      </div>
    )
  }
}

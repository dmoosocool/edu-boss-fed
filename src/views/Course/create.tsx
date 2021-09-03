import { Component, Vue, Prop } from 'vue-property-decorator'
import CreateOrUpdate from './components/createOrUpdate'
@Component({
  name: 'CourseCreate',
  components: {
    CreateOrUpdate,
  },
})
export default class CourseCreate extends Vue {
  @Prop({ type: [String, Number], required: true })
  private courseId!: string | number

  protected render(): JSX.Element {
    return (
      <div class="course-create">
        <CreateOrUpdate isEdit courseId={this.courseId} />
      </div>
    )
  }
}

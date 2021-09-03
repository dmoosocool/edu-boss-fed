import { Component, Vue, Prop } from 'vue-property-decorator'
import CreateOrUpdate from './components/createOrUpdate'
@Component({
  name: 'CourseEdit',
  components: {
    CreateOrUpdate,
  },
})
export default class CourseEdit extends Vue {
  @Prop({ type: [String, Number], required: true })
  private courseId!: string | number

  protected render(): JSX.Element {
    return (
      <div class="course-edit">
        <CreateOrUpdate isEdit courseId={this.courseId} />
      </div>
    )
  }
}

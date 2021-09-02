import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'CourseSection',
})
export default class CourseSection extends Vue {
  protected render(): JSX.Element {
    return (
      <div class="notfound">
        <h1>课程管理</h1>
      </div>
    )
  }
}

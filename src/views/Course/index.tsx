import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'CourseIndex',
})
export default class CourseIndex extends Vue {
  protected render(): JSX.Element {
    return (
      <div class="notfound">
        <h1>课程管理</h1>
      </div>
    )
  }
}

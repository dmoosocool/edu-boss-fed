import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'HomeIndex',
})
export default class HomeIndex extends Vue {
  protected render(): JSX.Element {
    return (
      <div class="home">
        <h1>首页</h1>
      </div>
    )
  }
}

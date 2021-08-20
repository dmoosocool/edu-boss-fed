import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  protected render(): JSX.Element {
    return (
      <div id="app">
        <router-view></router-view>
      </div>
    )
  }
}

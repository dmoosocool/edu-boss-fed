import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'NotFound',
})
export default class NotFound extends Vue {
  protected render(): JSX.Element {
    return (
      <div class="notfound">
        <h1>404 Not Found</h1>
      </div>
    )
  }
}

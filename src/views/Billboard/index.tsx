import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'BillboardIndex',
})
export default class BillboardIndex extends Vue {
  protected render(): JSX.Element {
    return <div class="billboard">广告位管理</div>
  }
}

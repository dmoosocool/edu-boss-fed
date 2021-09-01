import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'AdvertIndex',
})
export default class AdvertIndex extends Vue {
  protected render(): JSX.Element {
    return <div class="advert">广告管理</div>
  }
}

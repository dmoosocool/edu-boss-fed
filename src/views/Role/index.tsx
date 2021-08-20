import { Component, Vue } from 'vue-property-decorator'
import RoleList from './components/RoleList'
@Component({
  name: 'RoleIndex',
  components: {
    RoleList,
  },
})
export default class Home extends Vue {
  protected render(): JSX.Element {
    return (
      <div class="role">
        <RoleList />
      </div>
    )
  }
}

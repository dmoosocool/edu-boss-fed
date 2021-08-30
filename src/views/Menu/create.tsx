import { Component, Vue } from 'vue-property-decorator'
import CreateOrEdit from './components/CreateOrEidt'

@Component({
  name: 'MenuCreate',
  components: {
    CreateOrEdit,
  },
})
export default class MenuCreate extends Vue {
  protected render(): JSX.Element {
    return (
      <div class="menu-create">
        <CreateOrEdit />
      </div>
    )
  }
}

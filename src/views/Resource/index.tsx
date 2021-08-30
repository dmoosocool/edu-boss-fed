import { Component, Vue } from 'vue-property-decorator'

import ResourceList from './components/list'
@Component({
  name: 'ResourceIndex',
  components: {
    ResourceList,
  },
})
export default class ResourceIndex extends Vue {
  protected render(): JSX.Element {
    return (
      <div class="resource">
        <ResourceList />
      </div>
    )
  }
}

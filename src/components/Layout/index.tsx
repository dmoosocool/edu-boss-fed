import { Component, Vue } from 'vue-property-decorator'

import Aside from '@/components/Aside'
import Header from '@/components/Header'
import './index.scss'

@Component({
  name: 'Layout',
  components: {
    Aside,
    Header,
  },
})
export default class Home extends Vue {
  render(): JSX.Element {
    return (
      <el-container>
        <el-aside>
          <Aside />
        </el-aside>

        <el-container>
          <el-header>
            <Header />
          </el-header>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    )
  }
}

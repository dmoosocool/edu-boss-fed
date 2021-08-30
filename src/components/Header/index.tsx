import { Component, Vue, Watch } from 'vue-property-decorator'
import { getUserInfo, LoginUserInfo } from '@/services/user'
import type { RouteRecord } from 'vue-router'
import './index.scss'

@Component({
  name: 'Header',
})
export default class Home extends Vue {
  private userInfo: LoginUserInfo = { portrait: '', userName: '' }

  private records: RouteRecord[] = []

  @Watch('$route', { immediate: true, deep: true })
  private onRouteChange() {
    this.getRecords()
  }

  private async loadUserInfo() {
    const { data } = await getUserInfo()
    this.userInfo = data.content
  }

  private getRecords() {
    const matched = this.$route.matched.filter(
      item => item.meta && item.meta.title && item.meta.breadcrumb !== false,
    )
    this.records = matched
  }

  private handleLogout() {
    console.log('handleLogout')
    this.$confirm('确认退出吗？', '退出提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        // 确认执行这里
        // 清除登录状态
        this.$store.commit('setUser', null)

        // 跳转到登录页面
        this.$router.push({
          name: 'Login',
        })

        this.$message({
          type: 'success',
          message: '退出成功!',
        })
      })
      .catch(() => {
        // 取消执行这里
        this.$message({
          type: 'info',
          message: '已取消退出',
        })
      })
  }

  private created() {
    this.loadUserInfo()
    this.getRecords()
  }
  protected render(): JSX.Element {
    return (
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to={{ path: '/' }}>首页</el-breadcrumb-item>
          {this.records.length > 0 &&
            this.records.map((record: RouteRecord) => (
              <el-breadcrumb-item key={record.path}>
                {record.meta.title}
              </el-breadcrumb-item>
            ))}
        </el-breadcrumb>

        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar
              shape="square"
              size={40}
              src={
                this.userInfo.portrait || require('@/assets/default-avatar.png')
              }
            ></el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>{this.userInfo.userName}</el-dropdown-item>
            <el-dropdown-item divided nativeOnClick={this.handleLogout}>
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    )
  }
}

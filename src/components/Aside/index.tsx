import { Component, Vue } from 'vue-property-decorator'
import './index.scss'
@Component({
  name: 'Aside',
})
export default class Home extends Vue {
  handleOpen(key: string, keyPath: string): void {
    console.log(key, keyPath)
  }

  handleClose(key: string, keyPath: string): void {
    console.log(key, keyPath)
  }

  render(): JSX.Element {
    return (
      <div class="aside">
        <el-menu
          defaultActive="4"
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          backgroundColor="#545c64"
          textColor="#fff"
          activeTextColor="#ffd04b"
          mode="vertical"
          router={true}
          collapse={false}
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-lock"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/role">
              <i class="el-icon-s-custom"></i>
              <span slot="title">角色管理</span>
            </el-menu-item>
            <el-menu-item index="/menu">
              <i class="el-icon-menu"></i>
              <span slot="title">菜单管理</span>
            </el-menu-item>
            <el-menu-item index="/resource">
              <i class="el-icon-setting"></i>
              <span slot="title">资源管理</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/course">
            <i class="el-icon-film"></i>
            <span slot="title">课程管理</span>
          </el-menu-item>
          <el-menu-item index="/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>广告管理</span>
            </template>
            <el-menu-item index="/advert">
              <i class="el-icon-setting"></i>
              <span slot="title">广告列表</span>
            </el-menu-item>
            <el-menu-item index="/billboard">
              <i class="el-icon-setting"></i>
              <span slot="title">广告位列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    )
  }
}

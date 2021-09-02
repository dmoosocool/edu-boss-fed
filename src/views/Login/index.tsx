import { Component, Vue } from 'vue-property-decorator'
import type { Form } from 'element-ui'
import { Rule } from '@/interfaces/page.interface'
import { login, LoginForm } from '@/services/user'
import './index.scss'

interface LoginRule {
  phone: Array<Rule>
  password: Array<Rule>
}

@Component({
  name: 'LoginIndex',
})
export default class LoginIndex extends Vue {
  private form: LoginForm = {
    phone: '18201288771',
    password: '111111',
  }

  private readonly rules: LoginRule = {
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
    ],
  }

  private isLoginLoading = false

  private async onSubmit(): Promise<void> {
    try {
      await (this.$refs.form as Form).validate()
      this.isLoginLoading = true
      const { data } = await login(this.form)

      if (data.state !== 1) {
        this.$message.error(data.message)
      } else {
        this.$store.commit('setUser', data.content)

        this.$router.push((this.$route.query.redirect as string) || '/')

        this.$message.success('登录成功')
      }
    } catch (err) {
      //console.log('登录失败', err)
    }
    this.isLoginLoading = false
  }

  protected render(): JSX.Element {
    return (
      <div class="login">
        <el-form
          ref="form"
          class="login-form"
          props={{ model: this.form }}
          rules={this.rules}
          labelPosition="top"
          labelWidth="80px"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model={this.form.phone}></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model={this.form.password}></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn"
              type="primary"
              loading={this.isLoginLoading}
              onClick={this.onSubmit}
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    )
  }
}

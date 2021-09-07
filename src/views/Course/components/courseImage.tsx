import { Component, Vue, PropSync } from 'vue-property-decorator'
import { uploadCourseImage } from '@/services/course'
import './courseImage.scss'

@Component({
  name: 'CourseImage',
})
export default class CourseImage extends Vue {
  private isUploading = false
  private percentage = 0

  @PropSync('value', { type: String, default: '' })
  private readonly imageValue!: string

  @PropSync('limit', { type: Number, default: 2 })
  private readonly limitValue!: number

  private beforeAvatarUpload(file: File): boolean {
    const isJPG = file.type === 'image/jpeg'
    const isLt2M = file.size / 1024 / 1024 < this.limitValue

    if (!isJPG) {
      this.$message.error('上传头像只能是jpeg格式!')
    }

    if (!isLt2M) {
      this.$message.error(`上传头像图片不能超过${this.limitValue}MB!`)
    }

    return isJPG && isLt2M
  }

  private async handleUpload(options: any) {
    try {
      this.isUploading = true
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await uploadCourseImage(fd, e => {
        this.percentage = Math.floor((e.loaded / e.total) * 100)
      })

      if (data.code === '000000') {
        this.isUploading = false
        this.percentage = 0
        this.$emit('input', data.data.name)
      } else {
        this.$message.error('上传失败')
      }
    } catch (error: unknown) {
      this.$message.warning((error as Error).message)
    }
  }

  protected render(): JSX.Element {
    return (
      <div class="course-image">
        {this.isUploading ? (
          <el-progress
            type="circle"
            percentage={this.percentage}
            width={178}
            status={this.percentage === 100 ? 'success' : undefined}
          ></el-progress>
        ) : (
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            showFileList={false}
            beforeUpload={this.beforeAvatarUpload}
            httpRequest={this.handleUpload}
          >
            {this.imageValue ? (
              <img src={this.imageValue} class="avatar" />
            ) : (
              <i class="el-icon-plus avatar-uploader-icon"></i>
            )}
          </el-upload>
        )}
      </div>
    )
  }
}

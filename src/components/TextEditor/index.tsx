import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'
@Component({
  name: 'TextEditor',
})
export default class TextEditor extends Vue {
  @Prop()
  private value = ''

  @Watch('value')
  private onValueChanged(): void {
    if (!this.hasValue) {
      this.editor?.txt.html(this.value)
      this.hasValue = true
    }
  }

  private editor: null | E = null

  private hasValue = false

  private initEditor() {
    const editor = new E(this.$refs['editor'] as Element)
    this.editor = editor
    editor.config.onchange = (value: string) => {
      this.$emit('input', value)
    }
    editor.create()

    editor.config.customUploadImg = async (
      resultFiles: File[],
      insertImageFn: (name: string) => void,
    ) => {
      const fd = new FormData()
      fd.append('file', resultFiles[0])
      const { data } = await uploadCourseImage(fd)
      insertImageFn(data.data.name)
    }
  }

  private mounted() {
    this.initEditor()
  }

  protected render(): JSX.Element {
    return (
      <div ref="editor" class="text-editor">
        <h1>404 Not Found</h1>
      </div>
    )
  }
}

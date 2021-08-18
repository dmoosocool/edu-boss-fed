import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
  render() {
    return (
      <div>
        <h1>Hello world</h1>
      </div>
    );
  }
}

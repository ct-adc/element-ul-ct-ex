import { createTest, destroyVM } from '../util';
import SlideOut from 'packages/slide-out';
import {Button} from 'element-ui-ct';
import Vue from 'vue';

Vue.use(Button);
describe('SlideOut', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', (done) => {
    vm = createTest(SlideOut, {
      title: 'slideout test',
      visible: true
    }, true);
    const slideoutMain = vm.$el.children[1];
    setTimeout(() => {
      expect(document.querySelector('.v-modal')).to.exist;
      expect(vm.$el.querySelector('.el-slide-out__title').textContent).to.equal('slideout test');
      expect(slideoutMain.display).to.not.equal('none');
      done();
    }, 10);
  });

  it('create correct content', done=>{
    vm = createTest({
      template: `
      <div>
        <el-slide-out :title="title" :visible="visible">
          <span>这是一段信息</span>
          <span slot="footer">
            <el-button>取消</el-button>
            <el-button type="primary">确定</el-button>
          </span>
        </el-slide-out>
      </div>
    `,

      data() {
        return {
          title: 'dialog test',
          visible: true
        };
      }
    }, true);
    setTimeout(() => {
      const footerBtns = vm.$el.querySelectorAll('.el-slide-out__footer .el-button');
      expect(vm.$el.querySelector('.el-slide-out__body span').textContent).to.equal('这是一段信息');
      expect(footerBtns.length).to.equal(2);
      expect(footerBtns[0].querySelector('span').textContent).to.equal('取消');
      expect(footerBtns[1].querySelector('span').textContent).to.equal('确定');
      done();
    }, 100);
  });

  it('append to body', done => {
    vm = createTest({
      template: `
        <div>
          <el-slide-out :title="title" append-to-body :visible="visible"></el-slide-out>
        </div>
      `,

      data() {
        return {
          title: 'dialog test',
          visible: true
        };
      }
    }, true);
    const dialog = vm.$children[0];
    setTimeout(() => {
      expect(dialog.$el.parentNode).to.equal(document.body);
      done();
    }, 10);
  });
});


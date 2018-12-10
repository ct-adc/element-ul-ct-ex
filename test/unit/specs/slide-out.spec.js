import { createTest, destroyVM } from '../util';
import SlideOut from 'packages/slide-out';

describe('SlideOut', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(SlideOut, true);
    expect(vm.$el).to.exist;
  });
});


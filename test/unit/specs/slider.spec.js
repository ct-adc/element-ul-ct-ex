import { createTest, destroyVM } from '../util';
import Slider from 'packages/slider';

describe('Slider', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(Slider, true);
    expect(vm.$el).to.exist;
  });
});


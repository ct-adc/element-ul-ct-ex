import { createTest, destroyVM } from '../util';
import Permission from 'packages/permission';

describe('Permission', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(Permission, true);
    expect(vm.$el).to.exist;
  });
});


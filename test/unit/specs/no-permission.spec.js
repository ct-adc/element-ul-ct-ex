import { createTest, destroyVM } from '../util';
import NoPermission from 'packages/no-permission';

describe('NoPermission', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(NoPermission, true);
    expect(vm.$el).to.exist;
  });
});


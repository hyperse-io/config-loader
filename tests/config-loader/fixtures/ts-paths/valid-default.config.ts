// it is `esm` module (.mts)
import { test } from '@/alias/assets';
import { test1 } from '@/alias/assets2';
import { defineConfig } from '@armit/config-loader';
import { test2 } from './asset';

export default defineConfig({
  cake:  test,
  cake1: test1,
  cake2: test2,
})

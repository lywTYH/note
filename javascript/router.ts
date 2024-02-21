import {DefaultTheme} from 'vitepress/types/default-theme';
const es6Router = {
  text: 'ES6',
  items: [
    {
      text: 'let 和 const',
      link: '/es6/letAndConst',
    },
    {
      text: 'destructuring',
      link: '/es6/destructuring',
    },
    {
      text: 'math',
      link: '/es6/math',
    },
    {
      text: 'proxy',
      link: '/es6/proxy',
    },
    {
      text: 'generator',
      link: '/es6/generator',
    },
    {
      text: 'module',
      link: '/es6/module',
    },
  ],
};
const polyfillRouter = {
  text: 'polyfill',
  items: [
    {
      text: 'extend',
      link: '/polyfill/extend',
    },
    {
      text: 'flat',
      link: '/polyfill/flat',
    },
  ],
};

const router: DefaultTheme.SidebarItem = {
  text: 'JavaScript',
  base: '/javascript',
  items: [es6Router, polyfillRouter],
};

export default router;

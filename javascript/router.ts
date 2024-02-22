import es6Router from './es6/router';
import polyfillRouter from './polyfill/router';
import reactRouter from './react/router';
const router = {
  text: 'JavaScript',
  base: '/javascript',
  items: [es6Router, polyfillRouter, reactRouter],
};

const nav = {text: 'JavaScript', link: '/javascript/es6/letAndConst', activeMatch: '^/javascript/'};

export default {router, nav};

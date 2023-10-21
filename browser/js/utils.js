
function debounce(fn, delay) {
  var last;
  return function() {
    last && clearTimeout(last);
    var ctx = this;
    var args = arguments;
    last = setTimeout(() => {
      fn.apply(ctx, args);
    }, delay);
  };
}

function throttle(fn, delay) {
  var last = 0;
  return function() {
    var curr = +new Date();
    if (curr - last > delay) {
      fn.apply(this, arguments);
      last = curr;
    }
  };
}

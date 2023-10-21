var pro = function (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve('success' + time);
    }, time);
  });
};

var gen = function* () {
  var f1 = yield pro(200);
  var f2 = yield pro(400);
};

function run_a(gen) {
  let g = gen();
  function next(data) {
    let result = g.next(data);
    if (result.done) {
      return result.value;
    }
    result.value.then((data) => {
      next(data);
    });
  }
  next();
}

function* myGenerator() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
}

function run(gen) {
  return new Promise((resolve, reject) => {
    var g = gen();

    function _next(val) {
      try {
        var res = g.next(val);
      } catch (error) {
        return reject(error);
      }
      if (res.done) {
        resolve(res.value);
      }
      Promise.resolve(res.value).then(
        (value) => {
          _next(res.value);
        },
        (err) => g.throw(err),
      );
    }
    _next(); //第一次执行
  });
}

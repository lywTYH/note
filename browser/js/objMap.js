const target = {
  a: 2,
  b: 3,
  c: 4,
  d: 5,
};

Object.prototype._map = function map(callback) {
  if (typeof callback !== 'function') {
    throw TypeError(`object map must be a function !`);
  }
  return JSON.parse(
    JSON.stringify(this, (key, value) => {
      if (key) {
        return callback.call(this, key, value);
      }
      return value;
    }),
  );
};
const distA = target._map((key, value) => {
  if (value % 2 === 0) {
    return value / 2;
  }
  return value;
});

Object.prototype._mapB = function mapB(callback) {
  if (typeof callback !== 'function') {
    throw TypeError(`object map must be a function !`);
  }
  const obj = this;
  const result = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      result[key] = callback.call(this, key, obj[key]);
    }
  }
  return result;
};

Object.prototype._mapC = function mapC(callback) {
  if (typeof callback !== 'function') {
    throw TypeError(`object map must be a function !`);
  }
  const obj = this;
  return Object.keys(obj).reduce((pre, current) => {
    pre[current] = callback.call(this, current, obj[current]);
    return pre;
  }, {});
};

const distB = target._mapB((key, value) => {
  if (value % 2 === 0) {
    return value / 2;
  }
  return value;
});
const distC = target._mapC((key, value) => {
  if (value % 2 === 0) {
    return value / 2;
  }
  return value;
});
console.log('distA:', distA);
console.log('distB:', distB);
console.log('distC:', distC);

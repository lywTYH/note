// function Student() {}
// var student = new Student();
// console.log(student); // {}
// console.log(Object.prototype.toString.call(student)); // [object Object]

// var obj = new Object();
// console.log(obj); // {}
// console.log(Object.prototype.toString.call(student)); // [object Object]

// console.log(typeof Student === 'function'); // true
// console.log(typeof Object === 'function'); // true

// console.log(student.constructor === Student);
// console.log(Student.prototype.constructor === Student);

/*
 * new操作符做了两件事：
 * 1. 创建了一个全新的对象。
 * 2. 这个对象会被执行[[Prototype]]（也就是__proto__）链接。
 * 3. 生成的新对象会绑定到函数调用的this
 * 4. 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上
 * 5. 如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用会自动返回这个新的对象
 */
function newOperator(fn) {
  if (typeof fn !== 'function') {
    throw 'newOperator function the first param must be a function';
  }
  newOperator.target = fn;
  var newObj = Object.create(fn.prototype);
  var argsArr = [].slice.call(arguments, 1);
  var ctorReturnResult = fn.apply(newObj, argsArr);
  var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
  var isFunction = typeof ctorReturnResult === 'function';
  if (isObject || isFunction) {
    return ctorReturnResult;
  }
  return newObj;
}

// 例子3 多加一个参数
function Student(name, age) {
  this.name = name;
  this.age = age;
}
Student.prototype.doSth = function () {
  console.log(this.name);
};

var student1 = newOperator(Student, '若', 18);
var student2 = newOperator(Student, '川', 18);
// var student1 = new Student('若');
// var student2 = new Student('川');
console.log(student1, student1.doSth()); // {name: '若'} '若'
console.log(student2, student2.doSth()); // {name: '川'} '川'

/**
 * 实现 pick 与 omit
 */
interface Todo {
  title: string;
  description: string;
  bool: boolean;
}

type MyPick<T extends object, keys extends keyof T> = {
  [key in keys]: T[key];
};

type MappedType<T> = {
  [key in keyof T]: T[key];
};

type A = keyof Todo;

// type MyPick<T extends object, keys extends keyof  T> = {
//   [key in keys]:T[key]
// }

type next = MyPick<Todo, 'title' | 'bool'>;

const todo: next = {
  title: 'af',
  bool: false,
};
type MyExclude<T, U> = T extends U ? never : T;

type MyOmit<T extends object, keys extends keyof T> = MyPick<T, Exclude<keyof T, keys>>;
type omit = MyOmit<Todo, 'title' | 'bool'>;
type MyOmit2<T extends object, keys extends keyof T> = {
  [key in MyExclude<keyof T, keys>]: T[key];
};
type omit2 = MyOmit2<Todo, 'title' | 'bool'>;

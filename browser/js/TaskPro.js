
/**
 * js 任务队列
 */
class TaskPro{
  constructor(){
    this._taskList = [];
    this._isRunning = false;
    this._currentIndex = 0;
    this._next =async ()=>{
      this._currentIndex++;
      await this._runTask();
    }
  }

  addTask(task){
    this._taskList.push(task)
  }

  run(){
    if(this._isRunning || !this._taskList.length ){
      return;
    }
    this._isRunning = true;
    this._runTask()
  }

  async _runTask(){
    if(this._currentIndex >= this._taskList.length){
      this._rest()
      return;
    }
    const oldIndex = this._currentIndex;
    const task = this._taskList[this._currentIndex];
    await task(this._next)
    if(oldIndex === this._currentIndex){
      await this._next()
    }
  }

  _rest(){
    this._currentIndex = 0;
    this._isRunning= false;
    this._taskList = [];
  }
}


const task = new TaskPro();

task.addTask(async (next)=>{
  console.log(1,'start');
  await next();
  console.log(1,'end');
})

task.addTask(()=>{
  console.log(2);
})

task.addTask(()=>{
  console.log(3);
})

task.run();

// 1 start 2 3 1 end
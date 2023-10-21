class NetManage{
  constructor(num=1){
    if(typeof num !== 'number' || !Number.isNaN(num)){
      throw Error('type error');
    }
    this.number=num;
    this.queues=[];
    this.caches=[];
  }
  trigger(){
    const hits = this.queues.filter(item=>item.isFetch===false);
    hits.forEach(item=>{
      item.isFetch=true;
      item.task().then(item.resolve).catch(item.reject).finally(()=>{
        const delItemIndex = this.queues.findIndex(deleteItem=>deleteItem.key===item.key)
        if(delItemIndex!==-1){
          this.queues.splice(delItemIndex,1);
        }
        if(this.caches.length>0){
          this.queues.push(this.caches.shift());
          this.trigger()
        }
      })
    })

  }
  request({data}){
    return new Promise((resolve,reject)=>{
      const task =()=> new Promise((res,rej)=>{
        setTimeout(() => {
          console.log('resolve',data)
          res(data)
        }, 2000);
      });
      const key = Math.random();
      const item = {
        key,isFetch:false,task,resolve,reject
      }
      if(this.queues.length >= this.number|| this.caches.length>0){
        this.caches.push(item);
      }else{
        this.queues.push(item);
        this.trigger()
      }
    })
  }
}


const obj = new NetManage(5)

for (let index = 0; index < 20; index++) {
 obj.request({ data:index }).then((data)=>{
    console.log(data)
  })
}
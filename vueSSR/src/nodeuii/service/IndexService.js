class IndexService {
  constructor() {
    this.initData =  [
      { name: "first", age: 10 },
      { name: "second", age: 20 }
    ];
  }
  getData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({arr:this.initData});
      }, 1000);
    });
  }
  say() {
    return "hello";
  }
}
export default IndexService;

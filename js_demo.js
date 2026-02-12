function addLogFunction(cls) {
  cls.prototype.log = function(msg) {
    console.log(`[${new Date().toISOString()}] ${msg}`);
  };
  return cls;
}

@addLogFunction
class MyClass {
  constructor() {}
}

const myObj = new MyClass();
myObj.log('hello');
class Animal {
    constructor(theName) { this.name = theName; }
}
class Rhino extends Animal {
    constructor() { super("Rhino"); }
}
let animal = new Animal("Goat");
let rhino = new Rhino();
export {};

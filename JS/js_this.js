// "use strict";

/* this on global level depends on the environment it is running
 Eg: 
    - in browser - it will be window
    - in node js - global
*/
console.log("global this", this);

function x() {
  /* Here it depends on which mode we are running code
        - in non - strict mode - it will be window
        - in non strict mode - due to this substitution behavior this will refer to global level this
    */
  console.log("this inside function", this);
}

// HOW IT IS CALLED
x();
// this value depends ob how tge function is called( window )
window.x(); // here this it is window due to binding
// it is due to reference - 'this' will refer to window inside function x

// INSIDE OBJECT METHODS
const student = {
  name: "Naveen",
  printName: function () {
    // here 'this' will reference to the obj
    console.log("inside obj's method", this.name);
  },
};
student.printName();

const student2 = { name: "NAVEEN" };

// overriding of this in sharing methods
console.log("overriding this by fn.call method START");
student.printName.call(student2);
/*
    It can be used to invoke (call) a method with an owner object
     as an argument (parameter).
    With call(), an object can use a method belonging to another object.
*/
console.log("overriding this by fn.call method END");

console.log("overriding this by fn.apply method START");
student.printName.apply(student2);
console.log("overriding this by fn.apply method END");

//With the bind() method, an object can borrow a method from another object.
const newX = student.printName.bind(student2); // here this will reference to newObj
console.log("overriding this by fn.bind method START");
newX();
console.log("overriding this by fn.bind method END");

// this inside arrow function
// Arrow functions don't have their binding

const person = {
  a: 10,
  x: () => {
    // this refers to its enclosing lexical context or environment
    // here person located in global space so it is window
    console.log(this);
  },
};

console.log(person.x());

function lexicalEnvFunc() {
  console.log("LEXICAL", this);
  const person = {
    a: 10,
    x: () => {
      // this refers to its enclosing lexical context or environment
      // here person located in global space so it is window
      console.log("INDIEF", this);
    },
  };
  return person.x;
}
console.log("this Inside Func With ArrowMethod START");
lexicalEnvFunc()();
window.lexicalEnvFunc()();
console.log("this Inside Func With ArrowMethod END");

const lexicalEnvFunc2 = () => {
  console.log("LEXICAL", this);
  const person = {
    a: 10,
    x: () => {
      // this refers to its enclosing lexical context or environment
      // here person located in global space so it is window
      console.log("INDIEF", this);
      const tn = () => {
        // here it will refer to
        console.log("NESTED ARROW", this);
        const yn = () => {
          // here it will refer to
          console.log("NESTED ARROW", this);
        };
        yn();
      };
      tn();
    },
  };
  return person.x;
};
console.log("this Inside Arrow Func With ArrowMethod START");
lexicalEnvFunc2()();
console.log("this Inside Arrow Func With ArrowMethod END");

const person2 = {
  a: 10,
  x: function () {
    // here this will refer to its obj
    console.log("GLOBAL", this);
    const tn = () => {
      // here it will refer to
      console.log("NESTED ARROW", this);
    };
    tn();
  },
};

console.log("this Inside method With Nested Arrow function START");
person2.x();
console.log("this Inside method With  Nested Arrow function END");

const person3 = {
  a: 10,
  x: () => {
    // this refers to its enclosing lexical context or environment
    // here person located in global space so it is window
    console.log("GLOBAL", this);
    const tn = () => {
      // here it will refer to global space
      console.log("NESTED ARROW", this);
      // here it will act as like there is no arrow function and it behaves like
      // console.log(this) inside function
    };
    tn();
  },
};
console.log("this Inside arrow method With Nested Arrow func START");
person3.x();
console.log("this Inside arrow method With  Nested Arrow func END");

// INSIDE DOM
// this will be reference to the html element

// INSIDE CONSTRUCTOR FUNCTIONS
/*
In Constructor Functions
    When a function is used as a constructor (with the new keyword), 
    this refers to the newly created object.
    The constructor function initializes the properties and methods of 
    the object.
*/

function Person(name, age) {
  // 'this' refers to the new object being created
  /*
        When you use the new keyword with a constructor function:
            A new empty object is created.
            this is set to reference that new object.
            The constructor function executes, attaching properties
            and methods to this.
            The object is returned unless the constructor explicitly 
            returns a different object.

    */
  this.name = name;
  this.age = age;

  this.greet = function () {
    console.log(
      `Hello, my name is ${this.name} and I am ${this.age} years old.`
    );
  };
}

const john = new Person("John", 30); // Creates a new object
john.greet(); // Output: Hello, my name is John and I am 30 years old.

/*
   Without new
    If you call a constructor function without new, 
    this will depend on the function's execution context:
        In strict mode, this will be undefined, leading to an error if you try
        to assign properties.
        In non-strict mode, this will default to the global object
        (e.g., window in browsers), which can lead to bugs.
*/

function Person2(name) {
  this.name = name;
}
try {
  Person2("Alice"); // Called without 'new'
  // In non-strict mode: 'this' is the global object (e.g., window)
  // 'name' is now a property of the global object
} catch (error) {
  console.log(error);
}

console.log(window.name);

// Output: Alice (in browsers)

/*
    Using new.target
    Inside a constructor function, new.target tells you if the function was called with new.
*/

function Person3(name) {
  if (!new.target) {
    throw new Error("You must use 'new' with Person");
  }
  this.name = name;
}

const john2 = new Person3("John"); // Works
try {
  const jane2 = Person3("Jane"); // Throws an error
} catch (err) {
  console.error(err);
}

/*
    Adding methods directly to the prototype of a constructor function 
    ensures all instances share the same method
    (saves memory compared to defining methods in the constructor).
  */

function Animal(type) {
  this.type = type;
}

Animal.prototype.speak = function () {
  console.log(`I am a ${this.type}`);
};

const cat = new Animal("cat");
cat.speak(); // Output: I am a cat

// IN CLASSES

/**
 * Inside a Class Constructor: 
    In a class constructor, this refers to the instance of the class being
    created. It allows you to initialize properties or call other methods on
    the class instance.
 */
class MyClass {
  constructor(name) {
    this.name = name; // 'this' refers to the instance of MyClass
  }

  greet() {
    console.log(`Hello, ${this.name}!`);
  }
}

const me = new MyClass("Alice");
me.greet(); // Output: Hello, Alice!

/*
  Inside Methods Defined in the Class :
    Similarly, this inside methods refers to the instance of the class.
    You can use it to access other properties or methods of the same instance.
*/
class Example {
  constructor(value) {
    this.value = value;
  }

  displayValue() {
    console.log(this.value); // 'this' refers to the instance
  }
}

const instance = new Example(42);
instance.displayValue(); // Output: 42

/*
Arrow Functions in a Class:
    Arrow functions do not have their own this. Instead, they inherit this from
    their surrounding lexical scope.
    In a class, if an arrow function is used, this will still refer to the 
    instance of the class where it was defined.
*/

class Demo {
  constructor() {
    this.count = 0;
  }

  increment = () => {
    this.count += 1; // 'this' refers to the instance
  };
}

const demo = new Demo();
demo.increment();
console.log(demo.count); // Output: 1

/*
    When this Might Not Refer to the Class :
        If a method of the class is passed as a callback or used independently, the value of this might be lost (e.g., in non-strict mode or when not bound correctly).
        Use .bind() or arrow functions to ensure this refers to the correct instance.
  */
var value = 0;
class Counter {
  constructor() {
    this.value = 0;
  }

  increase() {
    console.log("THIS", this);
    this.value++;
  }
}

const counter = new Counter();
const increment = counter.increase; // Method is extracted, 'this' is lost

// Without binding, 'this' is lost:
try {
  increment(); // Error or unexpected behavior
} catch (err) {
  console.error(err);
}

// Correct approach:
const boundIncrement = counter.increase.bind(counter);
boundIncrement();
console.log(counter.value); // Output: 1

/*
Arrow Functions and Lexical this
    Arrow functions do not have their own this. Instead, they inherit this
    from their surrounding lexical scope. If used in the wrong context,
    this can cause confusion.
*/

class MePerson {
  constructor(name) {
    this.name = name;
  }

  introduce = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const person4 = new MePerson("Alice");
const callback = person.introduce; // No problem here
callback(); // 'this' still refers to 'person' because of lexical binding
/*
    Because the arrow function binds this lexically, 
    it will always refer to the instance of the class it was defined in.
    If the function were a regular method instead of an arrow function,
    this would depend on the calling context.
  */

/**
    Event Listeners
    When a class method is used as an event listener, this often refers to
    the element that triggered the event, not the class instance.
 */

class Button {
  constructor(label) {
    this.label = label;
  }

  clickHandler() {
    console.log(this.label); // 'this' will not refer to the instance
  }

  attachEventListener() {
    document
      .querySelector("button")
      .addEventListener("click", this.clickHandler);
    //   .addEventListener("click", this.clickHandler.bind(this));
  }
}

const button = new Button("Submit");
button.attachEventListener();

/**
 * What Happens? When clickHandler is called, this refers to the button
 *  DOM element, not the Button class instance.
Solution:
Bind the method in the constructor or use an arrow function.
    attachEventListener() {
        document.querySelector("button").addEventListener("click", this.clickHandler.bind(this));
    }
OR
    clickHandler = () => {
    console.log(this.label);
    };

*/


/*this in Nested Functions
    In a regular function nested inside a class method,
    this does not refer to the class instance unless explicitly bound.
*/
class Calculator {
  constructor() {
    this.result = 0;
  }

  calculate() {
    function add(a, b) {
      console.log(this); // 'this' is undefined in strict mode, or global object otherwise
      return a + b;
    }

    this.result = add(2, 3);
  }
}

const calc = new Calculator();
calc.calculate();
/*
Why? Regular functions have their own this based on how they are called.
Solution:
Use an arrow function or .bind().
    calculate() {
    const add = (a, b) => a + b;
    this.result = add(2, 3);
    }
*/

/*
    When this is Explicitly Overridden
    Sometimes, this is explicitly overridden using call,
    apply, or bind. In such cases, this no longer refers to the instance.
*/
class Animal2 {
  constructor(type) {
    this.type = type;
  }

  speak() {
    console.log(`I am a ${this.type}`);
  }
}

const cat2 = new Animal2("cat");
const dog = new Animal2("dog");

cat.speak.call(dog); // Output: I am a dog
/*  Why? 
    The call method explicitly sets this to dog, overriding the original 
    this reference.
*/

/*Global or Undefined this in Strict Mode
    If a class method or constructor is called without an object context 
    (e.g., not using new or without a bound this), this will be undefined 
    in strict mode or the global object
     in non-strict mode.
*/
class Test {
  constructor() {
    console.log(this); // 'this' is undefined if not called with 'new'
  }
}

Test(); // TypeError: Cannot read property 'undefined' of undefined
/*
Solution:
    Always use new when calling a constructor or enforce strict mode t
    avoid unexpected behavior.
*/
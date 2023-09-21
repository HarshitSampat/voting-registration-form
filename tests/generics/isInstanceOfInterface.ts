import checkInterface from "../interfaces/checkInterface";

export default function isInstanceOfInterface<T>(obj: any, interfaceToCheck: checkInterface<T>): obj is T {
    return interfaceToCheck(obj);
}


// Example usage:
// interface Person {
//     name: string;
//     age: number;
// }

// const obj: any = { name: "John", age: 30 };

// const isPerson: checkInterface<Person> = (obj: any): obj is Person => {
//     return "name" in obj && "age" in obj;
// };

// if (isInstanceOfInterface(obj, isPerson)) {
//     // obj is an instance of Person
//     console.log("obj is a Person.");
// } else {
//     console.log("obj is not a Person.");
// }

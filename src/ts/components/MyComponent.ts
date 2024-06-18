export default class MyComponent {
  constructor(private name: string) { }

  sayHello(): void {
    console.log(`Hello from ${this.name}!`);
  }
}
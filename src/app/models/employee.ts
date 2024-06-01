export class Employee {
  public id: number;
  public firstName: string;
  public lastName: string;
  public sal: number;

  constructor(id: number, firstName: string, lastName: string, sal: number) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.sal = sal;
  }
  getFullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }
  getYearlySalary(): number {
    return 12 * this.sal;
  }
}

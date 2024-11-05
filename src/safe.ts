export class Safe extends String {
  constructor(value: unknown) {
    super(`${value}`);
  }
}

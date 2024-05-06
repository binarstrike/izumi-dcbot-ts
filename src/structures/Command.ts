import { CommandBuilder } from "../types";

export class Command {
  constructor(commandOptions: CommandBuilder) {
    Object.assign(this, commandOptions);
  }
}

import { CommandBuilderType } from "../types";

export class Command {
  constructor(commandOptions: CommandBuilderType) {
    Object.assign(this, commandOptions);
  }
}

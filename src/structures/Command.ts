import { CommandBuilderType } from "../typings/Command";

export class Command {
  constructor(commandOptions: CommandBuilderType) {
    Object.assign(this, commandOptions);
  }
}

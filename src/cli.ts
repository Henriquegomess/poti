#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { Container } from "./container";

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .command("register <name> <path>", "Register a new dependency", (yargs) => {
      return yargs
        .positional("name", {
          describe: "Name of the dependency",
          type: "string",
        })
        .positional("path", {
          describe: "Path to the dependency module",
          type: "string",
        });
    })
    .help().argv;

  const container = Container.getInstance();

  if (
    argv._[0] === "register" &&
    typeof argv.name === "string" &&
    typeof argv.path === "string"
  ) {
    const dependency = require(argv.path);
    container.register(argv.name, dependency);
    console.log(`Registered ${argv.name} from ${argv.path}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { Container } from "./container";

async function registerDependency(
  name: string,
  path: string,
  container: Container
) {
  try {
    const dependency = require(path);
    container.register(name, dependency);
    console.log(`Registered ${name} from ${path}`);
  } catch (error) {
    console.error(`Failed to register ${name} from ${path}: ${error}`);
  }
}

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
    await registerDependency(argv.name, argv.path, container);
  } else {
    console.error("Invalid command or arguments");
  }
}

main().catch((err) => {
  console.error(`An error occurred: ${err.message}`);
  process.exit(1);
});

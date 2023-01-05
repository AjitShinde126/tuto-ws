#!/usr/bin/env node
var process = require('process');
var child_process = require('child_process');
var config = require("./env.js")
var cli = require('@ewam/script.cli')

const command = process.argv[2]
var myArgs = process.argv.slice(3);

var env = config.env || {}
if (myArgs.includes("--visual-studio-env")) {
  const VSLocation = cli.directory.getValidPath([
    "C:/Program Files (x86)/Microsoft Visual Studio/2019/Professional/VC/Auxiliary/Build/vcvarsx86_amd64.bat",
    "C:/Program Files (x86)/Microsoft Visual Studio/2019/Enterprise/VC/Auxiliary/Build/vcvarsx86_amd64.bat",
    "C:/Program Files (x86)/Microsoft Visual Studio/2019/Community/VC/Auxiliary/Build/vcvarsx86_amd64.bat",
    "C:/Program Files (x86)/Microsoft Visual Studio/2019/BuildTools/VC/Auxiliary/Build/vcvarsx86_amd64.bat",
  ])
  const VSEnv = cli.env.getScriptEnvVars(VSLocation)
  env = {
    ...VSEnv,
    ...config.wydeEnv,
    [Object.keys(VSEnv).reduce(
      (prev, name) => (name.toUpperCase() === "PATH" ? name : prev),
      "PATH"
    )]: [...config.wydePATH, VSEnv.Path].join(";"),
  }
}

if (command.toLowerCase() == 'wyseman.exe') {
  if (!process.env.PORT)
    console.log("env var 'PORT' is not defined. Taking 9945 as default")
  myArgs.push(`/PORT:${process.env.PORT || 9945}`)
}


child_process.spawn(
  command,
  myArgs,
  {
    env,
    stdio: [process.stdin, process.stdout, process.stderr],
  }
).on("exit", (code) => {
  process.exit(code)
})



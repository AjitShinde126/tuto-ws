var process = require("process")
var Path = require("path")
require('dotenv').config()

const WSM = Path.resolve("./node_modules/@ewam/wsm")
const fs = require("fs")

const ROOT = Path.resolve(".")

const paths = exports.paths = {
  "WYDE-ROOT": Path.resolve("./node_modules/@ewam/kernel"),
  //Help no delivered yet but could be packaged this way
  "EWAM-HELP": Path.resolve("./node_modules/@ewam/help"),
  "WYDE-DLL": Path.resolve("./node_modules/@ewam/library/bin"),
  "WYDE-REFDEVTGV": Path.resolve(process.env['WYDE-REFDEVTGV'] || "./TGV"),
  "WYDE-ADMIN": Path.resolve(process.env['WYDE-ADMIN'] || "./Admin"),
  "WYDE-TGV": Path.resolve(process.env['WYDE-TGV'] || "./TGV"),
  "WYDE-DEVTGV": Path.resolve(process.env['WYDE-DEVTGV'] || process.env['WYDE-TGV'] || "./TGV"),
  "WYDE-TESTTGV": Path.resolve(process.env['WYDE-TESTTGV'] || process.env['WYDE-TGV'] || "./TGV"),
  "WYDE-IMPEXP": Path.resolve(process.env['WYDE-IMPEXP'] || "./IMPEXP"),
  "WYDE-SYSTGV": Path.resolve(process.env['WYDE-SYSTGV'] || process.env['WYDE-TGV'] || "./TGV"),
  "WYDE-BUNDLE": Path.resolve(process.env['WYDE-BUNDLE'] || "./node_modules/ewam-bundles"),
  "WYDE-TEST": Path.resolve("./node_modules/@ewam/test"),
  "WYDE-CPPFILES": Path.resolve(process.env['WYDE-CPPFILES'] || "./.build/cpp"),
  "WYDE-COMPILERESULTS": Path.resolve(process.env['WYDE-COMPILERESULTS'] || "./.build/cppdll"),
}
const wInterfaceExternals = Path.resolve("./node_modules/@ewam/addon-winterfaceexternalsdll")

if (process.env.NODE_ENV == "production" && fs.existsSync(process.cwd() + "/.build/cppdll/Release")) {
  paths["WYDE-DLL"] = `${paths["WYDE-DLL"]};${process.cwd()}\\.build\\cppdll\\Release`
  console.log("The server will run with compiled CPP Dlls", paths["WYDE-DLL"])
}

const wydePATH = [
  `${paths.WFDLL}/bin`,
  `${wInterfaceExternals}/bin`,
  `${paths["WYDE-DLL"]}`,
  `${paths["WYDE-ROOT"]}/bin`,
  `${paths["WYDE-TEST"]}/bin`,
  `${WSM}/bin`,
  `${WSM}/GSP`,
]

const wydeEnv = {
  ...paths,
  "WYDE-DEV": ROOT,
  "WYDE-TUTORIAL": process.env['WYDE-TUTORIAL'] && Path.resolve(process.env['WYDE-TUTORIAL']) || `${paths["EWAM-HELP"]}/Tutorials`,
  "WYDE-REFDEVTGV": paths["WYDE-REFDEVTGV"],
  "WYDE-LICENSE": process.env['WYDE-LICENSE'] || `${ROOT}/license`,
  "WYDE-SERVERLICENSE": process.env['WYDE-SERVERLICENSE'] || `${ROOT}/license`,
  "WYDE-ERR": `${ROOT}/Log`,
  "WYDE-NOTES": `${ROOT}/Notes`,
  "WYDE-TMP": `${ROOT}/tmp`,
  "WYDE-NETCONF": `${paths["WYDE-ADMIN"]}/wnetconf.ini`,
  "WYDE-GSP": paths["WYDE-ADMIN"],
  "WSM-ROOT": Path.resolve("./node_modules/@ewam/wsm/bin"),
  "WWCLIENT-ROOT": Path.resolve("./node_modules/@ewam/wsm/bin"),
}

exports.wydeEnv = wydeEnv
exports.wydePATH = wydePATH

exports.env = {
  ...process.env,
  ...wydeEnv,
  [Object.keys(process.env).reduce((prev, name) => name.toUpperCase() === "PATH" ? name : prev, "PATH")]: [
    ...wydePATH,
    process.env.PATH,
  ].join(";"),
}
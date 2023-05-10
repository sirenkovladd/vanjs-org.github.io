import van from "./mini-van.js"
import common from "./common.ts"
import { HTMLDocument } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts"

export default (doc: HTMLDocument) => {
  const {tags} = van.vanWithDoc(doc)
  const {div, p, table, tbody, th, thead, tr} = tags

  const {Demo, Download, DownloadRow, H1, H2, Html, Js, Symbol, VanJS} = common(doc)

  const version = Deno.readTextFileSync("code/van.version")

  const DownloadTable = ({version}: {version: string}) => table({class: "download-table"},
    thead(tr(th("Files"), th("Description"))),
    tbody(
      DownloadRow({
        version,
        suffix: ".min",
        hasDts: true,
        description: "Minized script file for ES6 modules, optimized for bundle size.",
      }),
      DownloadRow({
        version,
        suffix: "",
        hasDts: true,
        description: "The source file without minification.",
      }),
      DownloadRow({
        version,
        suffix: ".debug",
        hasDts: true,
        description: ["The script file for debugging purpose, compared to ", Symbol(`van-${version}.js`), ", it adds additional saninty checks, such as type-checking, including the checkings that are impossible to do with TypeScript. Using this file for development purpose will detect issues earlier and produce more meaningful error messages."],
      }),
      DownloadRow({
        version,
        suffix: ".nomodule.min",
        hasDts: false,
        description: ["Similar to ", Symbol(`van-${version}.min.js`), ", but designed to work in non-module context, such as inline JavaScript or ", Symbol('<script type="text/javascript">'), "."],
      }),
      DownloadRow({
        version,
        suffix: ".nomodule",
        hasDts: false,
        description: ["Similar to ", Symbol(`van-${version}.js`), ", but designed to work in non-module context, such as inline JavaScript or ", Symbol('<script type="text/javascript">'), "."],
      }),
      DownloadRow({
        version,
        suffix: ".nomodule.debug",
        hasDts: false,
        description: ["Similar to ", Symbol(`van-${version}.debug.js`), ", but designed to work in non-module context, such as inline JavaScript or ", Symbol('<script type="text/javascript">'), "."],
      }),
    ),
  )

  return div({id: "content"},
    H1(VanJS(), ": Getting Started"),
    p("To get started, download the latest version ", Download(`van-${version}.min.js`), " and add the line below to your script:"),
    Js(`import van from "./van-${version}.min.js"`),
    p("To code without ES6 modules, you can download the bundled version ", Download(`van-${version}.nomodule.min.js`), " and add the following line to your HTML file instead:"),
    Html(`<script type="text/javascript" src="van-${version}.nomodule.min.js"></script>`),
    H2("Test It Out"),
    p("The following code will produce a funnier ", Symbol("Hello"), " component:"),
    Js(`const {button, div, pre} = van.tags

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const Run = ({sleepMs}) => {
  const headingSpaces = van.state(40), trailingUnderscores = van.state(0)

  const animate = async () => {
    while (headingSpaces.val > 0) {
      await sleep(sleepMs)
      --headingSpaces.val, ++trailingUnderscores.val
    }
  }
  animate()

  const helloText = van.bind(headingSpaces, trailingUnderscores,
    (h, t) => \`\${" ".repeat(h)}🚐💨Hello VanJS!\${"_".repeat(t)}\`)
  return div(pre(helloText))
}

const Hello = () => {
  const dom = div()
  return div(
    dom,
    button({onclick: () => van.add(dom, Run({sleepMs: 2000}))}, "Hello 🐌"),
    button({onclick: () => van.add(dom, Run({sleepMs: 500}))}, "Hello 🐢"),
    button({onclick: () => van.add(dom, Run({sleepMs: 100}))}, "Hello 🚶‍♂️"),
    button({onclick: () => van.add(dom, Run({sleepMs: 10}))}, "Hello 🏎️"),
    button({onclick: () => van.add(dom, Run({sleepMs: 2}))}, "Hello 🚀"),
  )
}

van.add(document.body, Hello())
`),
    p(Demo()),
    p({id: "demo-hello-fun"}),
    p({id: "jsfiddle-hello-fun"}),
    H2({id: "download-table"}, "Download Table"),
    p("You can find all relevant ", VanJS(), " files to download in the table below:"),
    DownloadTable({version}),
  )
}
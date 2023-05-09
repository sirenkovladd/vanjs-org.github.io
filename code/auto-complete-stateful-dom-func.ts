import van from "./van-latest.min.js"

const {a, div, p, pre, textarea} = van.tags

interface SuggestionListProps {
  readonly candidates: readonly string[]
  readonly selectedIndex: number
}
const SuggestionList = ({candidates, selectedIndex}: SuggestionListProps) =>
  div({class: "suggestion"}, candidates.map((s, i) => pre({
    "data-index": i,
    class: i === selectedIndex ? "text-row selected" : "text-row",
  }, s)))

const lastWord = (text: string) => text.match(/\w+$/)?.[0] ?? ""

const AutoComplete = ({words}: {readonly words: readonly string[]}) => {
  const getCandidates = (prefix: string) => {
    const maxTotal = 10, result: string[] = []
    for (let word of words) {
      if (word.startsWith(prefix.toLowerCase())) result.push(word)
      if (result.length >= maxTotal) break
    }
    return result
  }

  const prefix = van.state("")
  const candidates = van.state(getCandidates(""))
  prefix.onnew(p => candidates.val = getCandidates(p))
  const selectedIndex = van.state(0)
  candidates.onnew(() => selectedIndex.val = 0)

  const suggestionList = van.bind(candidates, selectedIndex,
    (candidates, selectedIndex, dom, oldCandidates, oldSelectedIndex) => {
      if (dom && candidates === oldCandidates) {
        // If the candidate list doesn't change, we don't need to re-render the
        // suggetion list. Just need to change the selected candidate.
        dom.querySelector(`[data-index="${oldSelectedIndex}"]`)
          ?.classList?.remove("selected")
        dom.querySelector(`[data-index="${selectedIndex}"]`)
          ?.classList?.add("selected")
        return dom
      }
      return SuggestionList({candidates, selectedIndex})
    })

  const onkeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      selectedIndex.val = selectedIndex.val + 1 < candidates.val.length ? selectedIndex.val + 1 : 0
      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      selectedIndex.val = selectedIndex.val > 0 ? selectedIndex.val - 1 : candidates.val.length - 1
      e.preventDefault()
    } else if (e.key === "Enter") {
      const candidate = candidates.val[selectedIndex.val] ?? prefix.val
      const target = <HTMLTextAreaElement>e.target
      target.value += candidate.substring(prefix.val.length)
      target.setSelectionRange(target.value.length, target.value.length)
      prefix.val = lastWord(target.value)
      e.preventDefault()
    }
  }

  const oninput = (e: Event) => prefix.val = lastWord((<HTMLTextAreaElement>e.target).value)

  return div({class: "root"}, textarea({onkeydown, oninput}), suggestionList)
}

fetch("https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt")
  .then(r => r.text())
  .then(t => t.split("\n"))
  .then(words => {
    van.add(document.body,
      p("Enter English words below with auto completion. Use ↓ and ↑ to change selection, and ↵ to select."),
      p(a({href: "https://github.com/first20hours/google-10000-english/blob/master/20k.txt"},
        "Dictionary Source")),
      AutoComplete({words}),
    ).querySelector("textarea")!.focus();
  })

const Styles = Object.fromEntries(Object.entries({
    white: 0,
    red: 31,
    yellow: 33,
    green: 32,
    blue: 34,
    magenta: 35
}).map(([name, code]) => [name, `\u001b[${code}m`]));


const codeInput = document.getElementById("codeInput");
const outputEl = document.getElementById("output");
document.getElementById("run").addEventListener("click", e => {
    const chunks = codeInput.value.split(";");

    switch (chunks[0]) {
        case "V3":
            switch (chunks.length) {
                case 6:                    // V3
                    output(
                        ["white", ""],
                        ["green", chunks[0] + ";"],
                        ["yellow", chunks[1] + ";"],
                        ["yellow", chunks[2] + ";"],
                        ["blue", chunks[3] + ";"],
                        ["white", chunks[4] + ";"],
                        ["white", ""]
                    )
                    break;
                case 7:                    // V3-paid
                    output(
                        ["white", ""],
                        ["green", chunks[0] + ";"],
                        ["yellow", chunks[1] + ";"],
                        ["yellow", chunks[2] + ";"],
                        ["blue", chunks[3] + ";"],
                        ["white", chunks[4] + ";"],
                        ["red", chunks[5] + ";"],
                        ["magenta", chunks[6]],
                        ["white", ""]
                    )
                    break;
                default:
                    error("Error: Invalid V3 length, try removing excess ;")
            }
            break;
        default:
            error("Error: V3 not detected");
    }
});
const copyBtn = document.getElementById("copy");
copyBtn.addEventListener("click", e => {
    if (!window?.navigator?.clipboard) {
        error("Error: Could not access Clipboard");
        return;
    }
    navigator.clipboard.writeText(outputEl.innerText).then(console.log).catch(err => error("Error: Could not write to Clipboard because" + err));
})

function error(message) {
    clearOutput();
    const errorEl = document.createElement("span");
    errorEl.classList.add("red");
    errorEl.appendChild(document.createTextNode(message));
    outputEl.appendChild(errorEl);
    copyBtn.style.display = "none";
}
/**
 * @param  {[string, string][]} message 
 */
function output(...message) {
    clearOutput();
    outputEl.append("```ansi", document.createElement("br"), ...message.map(([color, text]) => {
        const span = document.createElement("span");
        span.classList.add(color);
        const code = document.createElement("span");
        code.classList.add("small");
        code.append(Styles[color]);
        span.appendChild(code);
        span.append(text);
        return span;
    }), "```");
    copyBtn.style.display = "inline-block";
}

function clearOutput() {
    while (outputEl.firstChild) outputEl.removeChild(outputEl.firstChild);
}
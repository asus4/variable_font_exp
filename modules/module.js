
export function wrapBySpan(selector, className) {
    const elements = document.querySelectorAll(selector)
    const replaceText = `<span class="${className}">$1</span>`
    for (const element of elements) {
        element.innerHTML = element.innerText.replace(/(\S)/g, replaceText)
    }
}

export function convertToAbsolute(selector) {
    const elements = document.querySelectorAll(selector)
    const bounds = []
    for (const elm of elements) {
        bounds.push(elm.getBoundingClientRect())                    
    }
    const elementsPositions = []
    for (let i = 0; i < bounds.length; i++) {
        const elm = elements[i]
        const b = bounds[i]
        elm.style.position = 'absolute'
        elm.style.left = b.left + 'px'
        elm.style.top = b.top + 'px'

        elementsPositions.push({
            element: elm,
            // return center point
            x: b.x + b.width * 0.5,
            y: b.y + b.height * 0.5,
        })
    }
    
    return elementsPositions
}

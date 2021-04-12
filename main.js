(function() {
    function wrapBySpan(id) {
        const elm = document.getElementById(id)
        elm.innerHTML = elm.innerText.replace(/(\S)/g, '<span class="weight-fade">$1</span>')
    }

    function setCurrentToAbsolute(selector) {
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

    async function startCamera(width, height) {
        const video = document.createElement('video')
        video.width = width
        video.height = height
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        video.srcObject = stream
        video.play()
        
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const context = canvas.getContext('2d')
        // mirror
        context.translate(canvas.width, 0)
        context.scale(-1, 1)    
        return { video, canvas, context }
    }

    // https://github.com/idevelop/ascii-camera/blob/master/script/ascii.js
    const contrast = 150
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast))

    function getBrightness(data, index) {
        let r = (data[index] - 128) * contrastFactor + 128
        let g = (data[index + 1] - 128) * contrastFactor + 128
        let b = (data[index + 2] - 128) * contrastFactor + 128
        r = Math.min(255, Math.max(r, 0))
        g = Math.min(255, Math.max(g, 0))
        b = Math.min(255, Math.max(b, 0))
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255
    }

    async function main() {
        // Setup 
        wrapBySpan('cursor-variable')
        const elementsPositions = setCurrentToAbsolute('#cursor-variable span')

        const width = 320 / 2
        const height = 240 / 2
        const { video, canvas, context } = await startCamera(width, height)
        document.body.appendChild(canvas)
        
        const loop = () => {
            requestAnimationFrame(loop)
            context.drawImage(video, 0, 0, width, height)

            const imageData = context.getImageData(0, 0, width, height)
            const data = imageData.data

            const scrollTop = document.documentElement.scrollTop
            const clientWidth = document.documentElement.clientWidth
            const clientHeight = document.documentElement.clientHeight
            
            for (let pos of elementsPositions) {
                const elementX = pos.x / clientWidth
                const elementY = (pos.y - scrollTop) / clientHeight
                if (elementX < 0 || elementX >= 1 || elementY < 0 || elementY >= 1) {
                    continue
                }
                const pixelX = Math.floor(elementX * width)
                const pixelY = Math.floor(elementY * height)
                // const brightness = getBrightness(data, (pixelY * height + pixelX) * 4)
                const brightness = elementX
                pos.element.style.fontWeight = (1 - brightness) * 999
            }

            // for (let i = 0; i < data.length; i += 4) {
            //     const brightness =  Math.floor(getBrightness(data, i) * 255)
            //     data[i]  = brightness
            //     data[i + 1]  = brightness
            //     data[i + 2]  = brightness
            //     data[i + 3] = 255
            // }
            // imageData.data = data
            // context.putImageData(imageData, 0, 0)
        }
        loop()
    }

    main()
})();
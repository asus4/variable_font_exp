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
        for (let i = 0; i < bounds.length; i++) {
            const elm = elements[i]
            elm.style.position = 'absolute'
            elm.style.left = bounds[i].left + 'px'
            elm.style.top = bounds[i].top + 'px'
        }
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

    async function main() {
        // Setup 
        wrapBySpan('cursor-variable')
        setCurrentToAbsolute('#cursor-variable span')
        
        const width = 320 / 2
        const height = 240 / 2
        const { video, canvas, context } = await startCamera(width, height)
        document.body.appendChild(canvas)
        
        const loop = () => {
            requestAnimationFrame(loop)
            context.drawImage(video, 0, 0, width, height)
            // const imageData = context.getImageData(0, 0, width, height)

        }
        loop()
    }

    main()
})();
document.addEventListener('DOMContentLoaded', async function () {
    const messages = document.getElementById('messages');
    const form = document.getElementById('form');
    const input = document.getElementById('input');

    new window.EventSource('/sse').onmessage = function (event) {
        messages.innerHTML += `<p>${event.data}</p>`
    }

    async function getPrevMsgs() {
        const response = await window.fetch(`/prevMsgs`)
        const prevMsgs = await response.json()

        for (let message of prevMsgs) {
            messages.innerHTML += `<p>${message}<p>`
        }  
    }

    
    form.addEventListener('submit', function (evt) {
        evt.preventDefault()
    
        window.fetch(`/chat?message=${window.input.value}`)
        input.value = ''
    })

    await getPrevMsgs();
})


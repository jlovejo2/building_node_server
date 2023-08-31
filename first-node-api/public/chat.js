document.addEventListener('DOMContentLoaded', function () {
    const messages = document.getElementById('messages');
    const form = document.getElementById('form');
    const input = document.getElementById('input');

    new window.EventSource('/sse').onmessage = function (event) {
        messages.innerHTML += `<p>${event.data}</p>`
    }
    
    form.addEventListener('submit', function (evt) {
        evt.preventDefault()
    
        window.fetch(`/chat?message=${window.input.value}`)
        input.value = ''
    })
})

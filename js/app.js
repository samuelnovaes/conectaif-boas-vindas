const axios = require('axios')
const path = require('path')

const video = document.createElement('video')
const canvas = document.getElementById('canvas')
const btnSnapshot = document.getElementById('btn-snapshot')
const btnSend = document.getElementById('btn-send')
const btnIcon = document.querySelector('#btn-snapshot .fa')
const txtName = document.getElementById('name')
const txtEmail = document.getElementById('email')
const loading = document.getElementById('loading-box')
const alertBox = document.getElementById('alert-box')
const alertBtn = alertBox.querySelector('button')
const ctx = canvas.getContext('2d')

const moldura = document.createElement('img')
moldura.src = path.join(__dirname, 'img', 'moldura.png')

navigator.getMedia = (
	navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia
)

const _alert = (msg = '') => {
	alertBox.querySelector('p').innerText = msg
	alertBtn.focus()
	alertBox.show()
}

const handleVideo = stream => {
	try {
		video.srcObject = stream
	}
	catch (error) {
		URL.createObjectURL(stream)
	}
	video.play()
	draw()
}

const videoError = err => {
	console.error(err.message)
}

const draw = () => {
	const x = 20
	const y = canvas.height - 60
	const greet = 'Bem vindo(a) ao Conecta IF!'
	const name = txtName.value.length > 43 ? txtName.value.substr(0, 43) + '...' : txtName.value
	ctx.clearRect(0, 0, 800, 600)
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
	ctx.drawImage(moldura, 0, 0, canvas.width, canvas.height)
	ctx.font = '26px ubuntu-mono'
	ctx.fillStyle = 'white'
	ctx.lineWidth = 2
	ctx.strokeText(greet, x, y);
	ctx.strokeText(name, x, y + 30);
	ctx.shadowColor = 'black'
	ctx.shadowBlur = 7
	ctx.fillText(greet, x, y);
	ctx.fillText(name, x, y + 30);
	requestAnimationFrame(draw)
}

const dataURItoBlob = dataURI => {
	const byteString = dataURI.split(',')[0].indexOf('base64') >= 0 ? atob(dataURI.split(',')[1]) : unescape(dataURI.split(',')[1])
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
	const ia = new Uint8Array(byteString.length)
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i)
	}
	return new Blob([ia], { type: mimeString })
}

if (navigator.getUserMedia) {
	navigator.getUserMedia({ video: true }, handleVideo, videoError)
}

btnSnapshot.onclick = () => {
	if (video.paused) video.play()
	else video.pause()
	btnIcon.className = video.paused ? 'fa fa-sync' : 'fa fa-camera'
}

btnSend.onclick = () => {
	if (!video.paused) _alert('Capture a imagem primeiro!')
	else if (!txtName.checkValidity()) _alert('Insira seu nome!')
	else if (!txtEmail.checkValidity()) _alert('Insira um email válido!')
	else {
		const data = new FormData()
		data.append('name', txtName.value)
		data.append('email', txtEmail.value)
		data.append('image', dataURItoBlob(canvas.toDataURL('image/jpeg', 1)))
		loading.show()
		axios.post('http://conectaif-com.umbler.net', data).then(response => {
			loading.close()
			_alert('Boas vindas enviado com sucesso!')
		}).catch(error => {
			loading.close()
			_alert(error.response ? error.response.data : error.message)
		})
	}
}

alertBtn.onclick = () => {
	alertBox.close()
}
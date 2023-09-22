let closeBtn = document.querySelector('.close'),
	minBtn = document.querySelector('.minimaze'),
	maxBtn = document.querySelector('.maximaze');

closeBtn.addEventListener('click', () => {
	window.electronAPI.quit()
})

minBtn.addEventListener('click', () => {
	window.electronAPI.min()
})

let winBar = document.querySelector('.win');
winBar.addEventListener(
	"mouseover",
	(event) => {
		document.querySelector('.win__bar').style.top = '0px'
})
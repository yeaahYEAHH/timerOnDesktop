const { ipcRenderer } = require('electron');

// обработка навидения 
function hover(objectHover, objectChange){
	objectHover.addEventListener(
		"mouseover",
		(event) => {
			objectChange.classList.add('hover');
	})

	objectHover.addEventListener(
		"mouseout",
		(event) => {
			setTimeout(function () { objectChange.classList.remove('hover'); }, 5000);
			
	})
}

// вставка значение в input
function insertValue(time, hour, min, seconds){	
	let hourV = Math.floor(time / 3600),
		minuteV =  Math.floor((time / 60) / Math.ceil(time / 3600)),
		secondV = Math.floor(time % 60);

	if(time >= 3600){
		time = time - hourV * 3600;
		minuteV = Math.floor(time / 60);
		secondV = Math.floor(time % 60)
	}

	hour.value = hourV < 10 ? "0" + hourV : hourV;
	min.value = minuteV < 10 ? "0" + minuteV : minuteV;
	seconds.value = secondV < 10 ? "0" + secondV : secondV;
}

// Создание задержки 
function debounce(func, delay) {
	let timeout;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(context, args);
		}, delay);
	};
}

let hourSelector = document.querySelector('.inputHour'),
	minuteSelector = document.querySelector('.inputMinute'),
	secondsSelector = document.querySelector('.inputSeconds');

let buttons = document.querySelectorAll('.buttons');

let total_time, reset, storageTotalTime, cnt = new Number(),
	audio = new Audio();

let started = false;

// запуск таймера
function startTimer() {		
	let hour = parseInt(hourSelector.value),
		min = parseInt(minuteSelector.value),
		sec = parseInt(secondsSelector.value);

	total_time = sec + min + hour > 0 ? 
		sec + (min * 60) + (hour * 3600) : 
		storageTotalTime ;	


	started = total_time >= 0;

	buttons.forEach((item) => {
		item.style.display = 'none';
	})

	if(!started){
		return
	}

	// alert('start')
	cnt++
	storageTotalTime = total_time && cnt == 1 > 0 ? total_time : storageTotalTime;
	
	let countdown = setInterval(function () {

		if (total_time <= 1) {
			clearInterval(countdown);
	
			audio.src = './sound/5.mp3';
			audio.autoplay = true;

			if (storageTotalTime > 0) {
				insertValue(storageTotalTime, hourSelector, minuteSelector, secondsSelector)
			}

			started = false
			cnt = 0
			return
		}

		if (!started){
			clearInterval(countdown);
			return
		}


		total_time -= 1;
		insertValue(total_time, hourSelector, minuteSelector, secondsSelector)
	}, 1000);
}

// пауза таймер
function stopTimer() {
	started = false;
}

// сброс значений таймера
function resetTimer() {
	if(!(total_time)){
		return
	}

	buttons.forEach((item) => {
		item.style.display = 'flex';
	})
	started = false;
	insertValue(storageTotalTime, hourSelector, minuteSelector, secondsSelector)
	total_time = 0
	cnt = 0;
}



// создается обработчик с задержкой в 0,25 секунду
const debouncedStart = debounce(startTimer, 250);
const debouncedReset = debounce(resetTimer, 250);
const debouncedStop = debounce(stopTimer, 250);


// прослушивание каналов
ipcRenderer.on('f1', () => {
	if (!started){
		debouncedStart()
	}else {
		debouncedStop()
	}
})

ipcRenderer.on('f2', () => {
	debouncedReset()
})

// оконные кнопки
let closeBtn = document.querySelector('.close'),
	minBtn = document.querySelector('.minimaze');

closeBtn.addEventListener('click', () => {
	ipcRenderer.send('quit')
})

minBtn.addEventListener('click', () => {
	ipcRenderer.send('min')
})

// появление winbar при навидении 
hover(document.querySelector('.win'), document.querySelector('.win__bar'))

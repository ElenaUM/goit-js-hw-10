import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  inputDate: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
  daysField: document.querySelector('[data-days]'),
  hoursField: document.querySelector('[data-hours]'),
  minutesField: document.querySelector('[data-minutes]'),
  secondsField: document.querySelector('[data-seconds]'),
};

let intervalId;
let initTime;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userDate = selectedDates[0];

    if (userDate - Date.now() > 0) {
      refs.startBtn.disabled = false;
      initTime = userDate;
    } else {
      refs.startBtn.disabled = true;
      iziToast.error({
        position: 'topRight',
        theme: 'dark',
        messageColor: 'white',
        color: '#ef4040',
        message: 'Пожалуйста, выберите дату в будущем',
      });
    }
  },
};

flatpickr(refs.inputDate, options);

refs.startBtn.addEventListener('click', () => {
  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const diff = initTime - currentTime;

    if (diff <= 0) {
      clearInterval(intervalId);
      refs.startBtn.disabled = true;
      refs.stopBtn.disabled = true;
      refs.inputDate.disabled = false;
      return;
    }

    const time = convertMs(diff);
    refs.daysField.textContent = `${addZero(time.days)}`;
    refs.hoursField.textContent = `${addZero(time.hours)}`;
    refs.minutesField.textContent = `${addZero(time.minutes)}`;
    refs.secondsField.textContent = `${addZero(time.seconds)}`;
  }, 1000);

  refs.startBtn.disabled = true;
  refs.stopBtn.disabled = false;
  refs.inputDate.disabled = true;
});

refs.stopBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  refs.daysField.textContent = '00';
  refs.hoursField.textContent = '00';
  refs.minutesField.textContent = '00';
  refs.secondsField.textContent = '00';
  initTime = null;
  refs.startBtn.disabled = true;
  refs.stopBtn.disabled = true;
  refs.inputDate.disabled = false;
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);
  return { days, hours, minutes, seconds };
}

function addZero(value) {
  return value.toString().padStart(2, '0');
}

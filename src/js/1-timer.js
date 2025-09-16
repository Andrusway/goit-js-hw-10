import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const dateInput = document.querySelector("#datetime-picker")
const startBtn = document.querySelector("[data-start]")

const daysEl = document.querySelector("[data-days]")
const hoursEl = document.querySelector("[data-hours]")
const minEl = document.querySelector("[data-minutes]")
const secEl = document.querySelector("[data-seconds]")


startBtn.disabled = true
let selectedTime = null
let timerId = null


const fp = flatpickr(dateInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates){
    const picked = selectedDates[0]
    if(!picked) {return}
    if(picked.getTime() <= Date.now()){
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topCenter"
      })
      selectedTime = null
      startBtn.disabled = true
      return
    }
    selectedTime = picked.getTime()
    startBtn.disabled = false
    startBtn.classList.add("btn-active")
  }
})


startBtn.addEventListener("click", () => {
  if(!selectedTime) return

  startBtn.disabled = true
  startBtn.classList.remove("btn-active")
  dateInput.disabled = true

  if(timerId){
    clearInterval(timerId)
    timerId = null
  }

  tick()

  timerId = setInterval(tick, 1000)

})


function tick() {
const now = Date.now()
const diff = selectedTime - now

if(diff <= 0){
  clearInterval(timerId)
  timerId = null
  updateDisplay({days: 0, hours: 0, minutes: 0, seconds: 0})
  dateInput.disabled = false
  selectedTime = null
  startBtn.disabled = true
  return
}

const t = convertMs(diff)
updateDisplay(t)
}

function convertMs(ms){
  const second = 1000
  const minute = second * 60
  const hour = minute * 60
  const day = hour * 24


  const days = Math.floor(ms / day)
  const hours = Math.floor((ms % day) / hour)
  const minutes = Math.floor((ms % hour) / minute)
  const seconds = Math.floor((ms % minute) / second)
  
  return {days, hours, minutes, seconds}
}

function updateDisplay({days, hours, minutes, seconds}){
  daysEl.textContent = String(days).padStart(2, "0")
  hoursEl.textContent = String(hours).padStart(2, "0")
  minEl.textContent = String(minutes).padStart(2, "0")
  secEl.textContent = String(seconds).padStart(2, "0")
}
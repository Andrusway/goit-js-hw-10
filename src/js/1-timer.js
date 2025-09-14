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
  }
})


startBtn.addEventListener("click", () => {
  if(!selectedTime) return

  startBtn.disabled = true
  dateInput.disabled = true

  if(timerId){
    clearInterval(timerId)
    timerId = null
  }

  tick()

  timerId = setInterval(tick, 1000)

})
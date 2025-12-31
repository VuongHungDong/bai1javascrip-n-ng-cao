// Tạo Audio Context toàn cục
let audioContext;

function getAudioContext() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playTone(frequency, duration, type = 'sine') {
  try {
    const ctx = getAudioContext();
    
    // Resume context nếu cần (một số trình duyệt yêu cầu user interaction trước)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // Tăng âm lượng từ 0.8 lên 1.0 để nghe rõ hơn
    gainNode.gain.setValueAtTime(1.0, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
    
    console.log("Playing tone: " + frequency + "Hz for " + duration + "s");
  } catch (e) {
    console.error("Audio error:", e);
  }
}

// Hàm phát âm thanh khi nhấp nút hoặc nhấn phím
function playSound(key) {
  switch (key) {
    case "w":
      // Tom 1 - Tần số cao
      playTone(800, 0.3);
      break;
    case "a":
      // Tom 2 - Tần số trung
      playTone(700, 0.3);
      break;
    case "s":
      // Tom 3 - Tần số thấp
      playTone(600, 0.3);
      break;
    case "d":
      // Tom 4 - Tần số rất thấp
      playTone(500, 0.3);
      break;
    case "j":
      // Snare - Âm thanh cao và ngắn
      playTone(1000, 0.15, 'square');
      playTone(800, 0.15, 'square');
      break;
    case "k":
      // Crash - Âm thanh rất cao
      playTone(1200, 0.5);
      playTone(1000, 0.5);
      break;
    case "l":
      // Kick Bass - Tần số thấp
      playTone(250, 0.5);
      break;
    default:
      console.log(key);
  }
}

// Hàm thêm hiệu ứng pressed vào nút
function buttonAnimation(currentKey) {
  var activeButton = document.querySelector("." + currentKey);
  if (activeButton) {
    activeButton.classList.add("pressed");
    setTimeout(function () {
      activeButton.classList.remove("pressed");
    }, 100);
  }
}

// Đợi DOM tải xong rồi thêm event listener
document.addEventListener("DOMContentLoaded", function () {
  // Lắng nghe sự kiện nhấp nút
  var numberOfDrumButtons = document.querySelectorAll(".drum").length;

  for (var i = 0; i < numberOfDrumButtons; i++) {
    document.querySelectorAll(".drum")[i].addEventListener("click", function (e) {
      console.log("Button clicked!");
      var buttonInnerHTML = this.innerHTML;
      playSound(buttonInnerHTML);
      buttonAnimation(buttonInnerHTML);
    });
  }

  // Lắng nghe sự kiện nhấn phím trên bàn phím
  document.addEventListener("keydown", function (event) {
    console.log("Key pressed: " + event.key);
    playSound(event.key);
    buttonAnimation(event.key);
  });
});

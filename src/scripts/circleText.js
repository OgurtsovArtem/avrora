// ====================== CIRCLE TEXT ======================

// расстояние между словами
export const rotateBetweenWords = (value) => {
  const words = document.querySelectorAll(".circle-text__word");

  let deg = 0;

  for (let word of words) {
    word.style.transform = `rotate(${deg}deg)`;
    deg += value;
  }
};

// расстояние между буквами
export const rotateBetweenLetters = (value) => {
  const letters = document.querySelectorAll(".circle-text__letter");

  let deg = 0;

  for (let letter of letters) {
    letter.style.transform = `rotate(${deg}deg)`;
    deg += value;
  }
};

rotateBetweenWords(0);
rotateBetweenLetters(10.5);

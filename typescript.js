const texts = ["Web!", "Frontend!"];  //Lista de textos (texts) : Declaramos uma lista com as palavras ou frases que queremos exibir de forma animada.
const typedTextElement = document.getElementById("typed-text"); //Elemento HTML de destino (typedTextElement): Identificamos o elemento da página onde o texto será exibido.
const typingSpeed = 80; // Velocidade de digitação (ms) typingSpeed: Tempo entre cada caractere durante a digitação.
const erasingSpeed = 40; // Velocidade de apagar (ms) erasingSpeed: Tempo entre a remoção de cada caractere.
const delayBetweenTexts = 1000; // Pausa antes de começar o próximo texto (ms) delayBetweenTexts: Pausa após terminar de digitar antes de começar a apagar.
let textIndex = 0; // Índice do texto atual  textIndex: Controla qual texto da lista está sendo exibido.
let charIndex = 0; // Índice do caractere atual charIndex: Controla o caractere atual que está sendo digitado ou apagado.
let isDeleting = false; // Indicador de apagamento  isDeleting: Booleano que indica se o texto está sendo apagado (true) ou digitado (false).

function typeEffect() {
  const currentText = texts[textIndex];

  if (!isDeleting) {
    // Adiciona os caracteres gradualmente
    typedTextElement.textContent += currentText.charAt(charIndex); //Usa o índice charIndex para adicionar gradualmente os caracteres do texto atual ao elemento HTML.
    charIndex++;
    if (charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(typeEffect, delayBetweenTexts); // Espera antes de apagar
    } else {
      setTimeout(typeEffect, typingSpeed);
    }
  } else {
    // Remove os caracteres gradualmente
    typedTextElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length; // Passa para o próximo texto (modo infinito)
      setTimeout(typeEffect, typingSpeed);
    } else {
      setTimeout(typeEffect, erasingSpeed);
    }
  }
}

document.addEventListener("DOMContentLoaded", typeEffect);

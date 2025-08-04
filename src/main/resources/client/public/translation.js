//globals
let translationInput = document.querySelector('textarea')
let addTranslationButton = document.querySelector("[name='button3']")
let translationList = document.querySelector("[id='translation']")
let sourceLangSelect = document.querySelector('select[name="source-language"]')
let targetLangSelect = document.querySelector('select[name="target-language"]')


//fetch  translation for initial load
fetchTranslation()

//click handler for translate button
addTranslationButton.onclick = addNewTranslation


async function addNewTranslation(evt){
    let translation = translationInput.value
    if(translation.trim() != ''){
        try {
            const element = document.getElementById("translation")
            while(element.firstChild) {
                element.removeChild(element.firstChild)
            }
            let translationReturned = await postTranslationToServer({
                translation: translation,
                sourceLang: sourceLangSelect.value,
                targetLang: targetLangSelect.value
            })

            appendTranslationToList(translationReturned)
        } catch(err) {
            console.log(err)
        }
    }
}



function appendTranslationToList(translationJson){
    let el = document.createElement("LI")
    let safeText = translationJson.translation
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");

    el.innerHTML = safeText;
    el.dataset.id = translationJson.id;
    translationList.appendChild(el);
}


async function fetchTranslation(){
    try {
        let translations = await getTranslationFromServer()
        translations.forEach(translation => { appendTranslationToList(translation)})
    } catch(err) {
        console.log(err)
    }
}

/**
 * Få translation fra serveren ved brug af Fetch API
 * @return {Promise} returnere et "promise", som vi skal vente på
 * @return {resolved} Når "promise" er "løst", returnere den en json liste af translationer
 * @throws {Error} returnere Error object med status kode
 *
 */
 async function getTranslationFromServer(){
    const response = await fetch('/translation', {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    })
    
    if (!response.ok) {
        throw new Error(`Connection failed with status code ${response.status}`)
    }
    return await response.json()
}


 async function postTranslationToServer(data = {}){
    const response = await fetch('/translation', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    
    if (!response.ok) {
        throw new Error(`Connection failed with status code ${response.status}`)
    }
    return await response.json()
}



const micBtn = document.getElementById("mic-btn");
const inputBox = document.getElementById("inputText");

let isListening = false;
let recognition;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'da-DK';

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    inputBox.value += (inputBox.value ? "\n" : "") + transcript;
  };

  recognition.onerror = function(event) {
    console.error("Talegenkendelse fejl:", event.error);
  };

  micBtn.addEventListener("click", () => {
    const icon = micBtn.querySelector("i");
    if (!isListening) {
      recognition.start();
      icon.classList.add("listening");
      isListening = true;
    } else {
      recognition.stop();
      icon.classList.remove("listening");
      isListening = false;
    }
  });
} else {
  micBtn.disabled = true;
  micBtn.title = "Din browser understøtter ikke talegenkendelse.";
}


const speakInputBtn = document.getElementById("speak-input-btn");
const speakOutputBtn = document.getElementById("speak-output-btn");

function speakText(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

speakInputBtn.addEventListener("click", () => {
  const text = inputBox.value;
  const lang = sourceLangSelect.value || 'da';
  speakText(text, lang);
});

speakOutputBtn.addEventListener("click", () => {
  const translationElements = document.querySelectorAll("#translation li");
  if (translationElements.length > 0) {
    const lastTranslation = translationElements[translationElements.length - 1].innerText;
    const lang = targetLangSelect.value || 'en';
    speakText(lastTranslation, lang);
  }
});



const clearBtn = document.getElementById("clear-btn");

clearBtn.addEventListener("click", () => {
  // Ryd input-feltet
  inputBox.value = "";

  // Ryd oversættelseslisten
  while (translationList.firstChild) {
    translationList.removeChild(translationList.firstChild);
  }
});

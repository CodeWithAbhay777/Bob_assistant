const btn = document.querySelector("#mic-cont");
const state = document.querySelector("#state");
const gptArea = document.querySelector("#gpt-outer-cont");
const logo = document.querySelector("#logo");
const replay = document.querySelector("#replay");
const pause_play = document.querySelector("#pause-play");
const loadercont = document.querySelector('#loader-cont');
const play = document.querySelector(".play");
const pause = document.querySelector(".pause");
const navbtn = document.querySelector("#nav-btn");
const nav = document.querySelector("#nav");
const menu = document.querySelector(".menu");
const cross = document.querySelector(".cross");


// const loader = document.querySelector('#loader');


//variables

let bobGpt = false;
let askPointer = false;
let ongoingVoice = ""



function speak(text) {

    // console.log("speak is called")

    // const text_speech = new SpeechSynthesisUtterance(text);

    // text_speech.rate = 1;
    // text_speech.volume = 1;
    // text_speech.pitch = 1;

    // console.log("Attempting to speak: ", text);

    // window.speechSynthesis.speak(text_speech);




    if (!window.speechSynthesis) {
        console.error("SpeechSynthesis not supported in this browser.");
        return;
    }

    window.speechSynthesis.cancel();

    const text_speech = new SpeechSynthesisUtterance(text);

    text_speech.rate = 1;
    text_speech.volume = 1;
    text_speech.pitch = 1;



    window.speechSynthesis.speak(text_speech);


    // text_speech.onend = () => {
    //     console.log("SpeechSynthesisUtterance.onend");
    // }


}


function voiceRemoveElements(ele) {
    let str = "";
    let arr = ele.split("+");
    for (let i = 0; i < arr.length; i++) {
        let word = arr[i];
        str += `${word} `;
    }
    console.log(str);
    return str;

}


let speech = true;
let globalTranscript;
let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

recognition.addEventListener("result", e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

    globalTranscript = transcript.toLowerCase();

});

replay.addEventListener("click", () => {
    if (ongoingVoice) {

        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        speak(ongoingVoice); // Replay the last spoken text
    } else {
        console.log("No text to replay");
    }
})


pause_play.addEventListener("click", () => {

    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        pause.style.display = "none";
        play.style.display = "unset";
    } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        play.style.display = "none";
        pause.style.display = "unset";

    }
});

const gptTask = async (task) => {




    //style changes

    btn.style.position = "fixed";
    btn.style.bottom = "50px";
    btn.style.right = "50px";
    btn.style.width = "100px";
    btn.style.height = "100px";
    btn.style.border = "2px solid white";

    logo.style.height = "100px";
    logo.style.width = "100px";

    replay.style.display = "unset";
    replay.style.display = "flex";
    replay.style.justifyContent = "center";
    replay.style.alignItems = "center";

    pause_play.style.display = "unset";
    pause_play.style.display = "flex";
    pause_play.style.justifyContent = "center";
    pause_play.style.alignItems = "center";

    gptArea.style.display = "unset";

    //if exitGpt

    if (task === "exit bobgpt" || task === "exit bob gpt") {

        bobGpt = false;

        //rechange style

        btn.style.position = "static";


        btn.style.width = "250px";
        btn.style.height = "250px";

        logo.style.height = "200px";
        logo.style.width = "200px";

        replay.style.display = "none";

        pause_play.style.display = "none";

        gptArea.style.display = "none";

    }

    else if (task === "open bob gpt" || task === "open bobgpt") {
        speak("opening bob gpt");

    }

    //api calling and getting data

    else {

        try {
            let data = { task }

            // loader.style.display = 'block';
            loadercont.style.display = 'block';
            let response = await axios.post(`/bob`, data);

            if (response.status === 200) {

                let reply = response.data.msg;


                let question = document.createElement('div');
                question.className = 'question';
                let answer = document.createElement('div');
                answer.className = 'answer';

                question.innerText = `${task}`;
                answer.innerText = `${reply}`;

                gptArea.prepend(answer);
                gptArea.prepend(question);



                console.log(reply)
                ongoingVoice = `${reply}`;
                speak(reply);

                replay.addEventListener("click", () => {
                    // if (reply) {

                    //     // window.speechSynthesis.cancel();

                    //     console.log("start");
                    //     speak(reply);
                    // }


                });

            }
            else {
                alert(response.data.msg);
            }

        } catch (error) {
            console.log(error);
            alert("something went wrong : client side");

        }
        finally {
            // loader.style.display = 'none';
            loadercont.style.display = 'none';
        }

    }

}



btn.addEventListener("click", () => {
    window.speechSynthesis.cancel();
    state.innerHTML = `<i class="fa-solid fa-microphone microphoneicon"></i>&nbsp;Listening...`;
    if (speech = true) {
        recognition.start();
        recognition.addEventListener('end', () => {


            if (globalTranscript !== "") {
                if (globalTranscript === "open bobgpt" || globalTranscript === "open bob gpt" || bobGpt === true) {

                    // if (askPointer === false) {
                    //     askPointer = true;
                    //     speak("opening bob gpt");
                    // }
                    // else {


                    state.innerHTML = `${globalTranscript}`;
                    bobGpt = true;

                    gptTask(globalTranscript);
                    // }




                }

                else {
                    state.innerHTML = `${globalTranscript}`;
                    task(globalTranscript);
                }



            }
            globalTranscript = ""
        })
    }

})



const task = (task) => {
    // task = task.toLowerCase()

    //greet
    if (task.includes('hey') || task.includes('hello') || task.includes('hola') || task.includes('namaskar') || task.includes('ok bob')) {
        speak("hello sir, how can bob help you")
    }

    else if (task.includes('kaise ho') || task.includes('kya haal chaal') || task.includes('sab badhiya') || task.includes('how are you')) {
        speak("I'm doing great sir ,  how can bob help you today")
    }

    //google
    else if (task.includes('open google') || task.includes('google kholo') || task.includes('bob google kholo') || task.includes('bob please open google') || task.includes('Bob open google')) {
        speak("opening google for you");
        window.open("https://google.com", "_blank");
    }

    //youtube

    else if (task.includes('open youtube') || task.includes('youtube kholo') || task.includes('bob youtube kholo') || task.includes('bob please open youtube') || task.includes('Bob open youtube')) {
        speak("opening youtube for you");
        window.open("https://youtube.com", "_blank");
    }

    else if (task.includes('search')) {

        let arr = task.split(" ");
        let len = arr.length;

        let str = "";

        let voice = "";
        if (arr[len - 3] == "channel") {

            for (let i = 1; i < len - 3; i++) {
                let word = arr[i];

                str += `${arr[i]}`;



            }

        }
        else {
            for (let i = 1; i < len - 2; i++) {
                let word = arr[i];
                if (i == len - 3) {
                    str += `${word}`;
                }
                else {
                    str += `${word}+`;
                }

            }

        }



        if (arr[len - 1] == "youtube" && arr[len - 2] == "on" && arr[len - 3] != "channel") {
            window.open(`https://youtube.com/results?search_query=${str}`, "_blank");


            speak(`searching ${voiceRemoveElements(str)} on youtube`);
        }

        else if (arr[len - 1] == "google" && arr[len - 2] == "on") {
            window.open(`https://google.com/search?q=${str}`, "_blank");
            // voice = str.replace("+" , " ");
            // console.log(voice);


            speak(`searching ${voiceRemoveElements(str)})} on google`);
        }
        else if (arr[len - 1] == "youtube" && arr[len - 2] == "on" && arr[len - 3] == "channel") {
            window.open(`https://youtube.com/@${str}`, "_blank");

            speak(`searching ${str}'s channel on youtube`);
        }



    }

    else if (task.includes('open online compiler') || task.includes('online compiler kholo')) {
        speak(`opening online compiler for you`);
        window.open(`https://www.programiz.com/javascript/online-compiler/`, "_blank");
    }

    else if (task.includes('open delta batch') || task.includes('delta batch kholo')) {
        speak(`opening delta batch for you`);
        window.open(`https://www.apnacollege.in/start`, "_blank");
    }

    else if (task.includes('open harkirat singh batch') || task.includes('harkirat singh wala batch kholo')) {
        speak(`opening web cohort for you`);
        window.open(`https://harkirat.classx.co.in/new-courses/6/content?activeTab=Content`, "_blank");
    }

    else if (task.includes('open facebook') || task.includes('facebook kholo')) {
        speak(`opening facebook for you`);
        window.open(`https://www.facebook.com/`, "_blank");
    }

    else if (task.includes('open instagram') || task.includes('instagram kholo')) {
        speak(`opening instagram for you`);
        window.open(`https://www.instagram.com/`, "_blank");
    }

    else if (task.includes('open chatgpt') || task.includes('chatgpt kholo') || task.includes('chat gpt kholo') || task.includes('open chat gpt')) {
        speak(`opening chat gpt for you`);
        window.open(`https://chatgpt.com/`, "_blank");
    }

    else if (task.includes('open whatsapp') || task.includes('whatsapp kholo') || task.includes('whata app kholo') || task.includes('open whats app')) {
        speak(`opening whatsapp for you`);
        window.open(`https://web.whatsapp.com/`, "_blank");
    }

    else if (task.includes('open github') || task.includes('github kholo')) {
        speak(`opening github for you`);
        window.open(`https://github.com/`, "_blank");
    }

    else if (task.includes('open amazon') || task.includes('amazon kholo')) {
        speak(`opening amazon shopping for you`);
        window.open(`https://www.amazon.in/`, "_blank");
    }

    else if (task.includes('open flipkart') || task.includes('flipkart kholo')) {
        speak(`opening flipkart shopping for you`);
        window.open(`https://www.flipkart.com/`, "_blank");
    }
    else if (task.includes('open souled store') || task.includes('souled store kholo') || task.includes('open sold store') || task.includes('sold store kholo')) {
        speak(`opening souled store for you`);
        window.open(`https://www.thesouledstore.com/`, "_blank");
    }
    else if (task.includes('open olx') || task.includes('olx kholo')) {
        speak(`opening o l x for you`);
        window.open(`https://www.olx.in/`, "_blank");
    }
    else if (task.includes('open myntra') || task.includes('myntra kholo')) {
        speak(`opening myntra shopping for you`);
        window.open(`https://www.myntra.com/`, "_blank");
    }
    else if (task.includes('open netflix') || task.includes('netflix kholo')) {
        speak(`opening netflix for you`);
        window.open(`https://www.netflix.com/in/`, "_blank");
    }
    else if (task.includes('open prime') || task.includes('prime kholo') || task.includes('prime video kholo') || task.includes('open prime video') || task.includes('prime video kholo') || task.includes('open prime video')) {
        speak(`opening amazon prime for you`);
        window.open(`https://www.primevideo.com/`, "_blank");
    }
    else if (task.includes('open hotstar') || task.includes('hotstar kholo')) {
        speak(`opening hotstar for you`);
        window.open(`https://www.hotstar.com/`, "_blank");
    }
    else if (task.includes('open zomato') || task.includes('zomato kholo')) {
        speak(`opening zo mato for you`);
        window.open(`https://www.zomato.com/`, "_blank");
    }
    else if (task.includes('open linkedin') || task.includes('linkedin kholo')) {
        speak(`opening linkedin for you`);
        window.open(`https://www.linkedin.com/`, "_blank");
    }
    else if (task.includes('open sony liv') || task.includes('sony liv kholo') || task.includes('open sonyliv') || task.includes('sonyliv kholo')) {
        speak(`opening sony liv for you`);
        window.open(`https://www.sonyliv.com/`, "_blank");
    }
    else if (task.includes('open jio cinema') || task.includes('jio cinema kholo') || task.includes('open jiocinema') || task.includes('jiocinema kholo')) {
        speak(`opening jio cinema for you`);
        window.open(`https://www.jiocinema.com/`, "_blank");
    }
    else if (task.includes('open gmail') || task.includes('gmail kholo')) {
        speak(`opening gmail for you`);
        window.open(`https://mail.google.com/`, "_blank");
    }
    else if (task.includes('open bing') || task.includes('bing kholo')) {
        speak(`opening bing for you`);
        window.open(`https://www.bing.com/`, "_blank");
    }

    else if (task.includes('open telegram') || task.includes('telegram kholo')) {
        speak(`opening telegram for you`);
        window.open(`https://desktop.telegram.org/`, "_blank");
    }

    else if (task.includes('open discord') || task.includes('discord kholo')) {
        speak(`opening discord for you`);
        window.open(`https://discord.com/`, "_blank");
    }

    else if (task.includes('open quora') || task.includes('quora kholo')) {
        speak(`opening quora for you`);
        window.open(`https://www.quora.com/`, "_blank");
    }

    else if (task.includes('open stack overflow') || task.includes('stack overflow kholo')) {
        speak(`opening stack overflow for you`);
        window.open(`https://stackoverflow.com/`, "_blank");
    }

    else if (task.includes('open chess.com') || task.includes('chess.com kholo')) {
        speak(`opening chess.com for you`);
        window.open(`https://www.chess.com/`, "_blank");
    }

    else if (task.includes('open lichess') || task.includes('lichess kholo') || task.includes('open leechess') || task.includes('leechess kholo') || task.includes('open leeches') || task.includes('leeches kholo')) {
        speak(`opening leechess for you`);
        window.open(`https://lichess.org/`, "_blank");
    }

    else if (task.includes('open twitter') || task.includes('twitter kholo')) {
        speak(`opening twitterfor you`);
        window.open(`https://x.com/`, "_blank");
    }

    else if (task.includes('open leetcode') || task.includes('leetcode kholo') || task.includes('open lead code') || task.includes('lead code kholo')) {
        speak(`opening leetcode for you`);
        window.open(`https://leetcode.com/`, "_blank");
    }

    else if (task.includes('open gfg') || task.includes('gfg kholo')) {
        speak(`opening geeks for geeks for you`);
        window.open(`https://www.geeksforgeeks.org/`, "_blank");
    }

    else if (task.includes('open neetcode') || task.includes('neetcode kholo') || task.includes('open neet code') || task.includes('neet code kholo') || task.includes('open need code') || task.includes('need code kholo')) {
        speak(`opening neetcode for you`);
        window.open(`https://neetcode.io/`, "_blank");
    }

    else if (task.includes('open interview bit') || task.includes('interview bit kholo') || task.includes('open interviewbit') || task.includes('interviewbit kholo')) {
        speak(`opening interview bit for you`);
        window.open(`https://www.interviewbit.com/practice/`, "_blank");
    }

    else if (task.includes('open replit') || task.includes('replit kholo') || task.includes('open replete') || task.includes('replete kholo')) {
        speak(`opening replit for you`);
        window.open(`https://replit.com/~`, "_blank");
    }

    else if (task.includes('open codesandbox') || task.includes('codesandbox kholo') || task.includes('open codes and box') || task.includes('codes and box kholo') || task.includes('open code sandbox') || task.includes('code sandbox kholo') || task.includes('open codes sandbox') || task.includes('codes sandbox kholo')) {
        speak(`opening codesandbox for you`);
        window.open(`https://codesandbox.io/dashboard/recent`, "_blank");
    }

    else if (task.includes('open wikipedia') || task.includes('wikipedia kholo')) {
        speak(`opening wikipedia for you`);
        window.open(`https://www.wikipedia.org/`, "_blank");
    }



    else {
        speak(`Sorry! I dont understand`);
    }







}

let navigationBar = true;

function closeNavigationBar() {
    navigationBar = true;
    nav.style.right = "-100%";
    menu.style.display = "unset";
    cross.style.display = "none";
}


function openNavigationBar() {
    navigationBar = false;
    nav.style.right = "0%";
    menu.style.display = "none";
    cross.style.display = "unset";
}

navbtn.addEventListener("click", (e) => {

    if (navigationBar === false) {
        closeNavigationBar();

    }
    else {
        openNavigationBar();

    }
})











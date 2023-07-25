let container = document.querySelector(".container"),
    cards = document.querySelector(".cards"),
    wrongs = document.querySelector(".header .wrong-tries .wrongs"),
    timerSpan = document.querySelector(".timer .time"),
    nameSpan = document.querySelector(".header .name"),
    stopWindow = document.querySelector(".stop"),
    winWindow = document.querySelector(".win"),
    winTime = document.querySelector(".win .time"),
    resultsParent = document.querySelector(".win .results .parent"),
    buttons = [...document.querySelectorAll(".btn")],
    startBtn = document.querySelector(".start .btn"),
    againButtons = [...document.querySelectorAll(".btn.again")],
    getName = document.querySelector(".get-name"),
    nameInput = document.querySelector(".get-name input"),
    goBtn = document.querySelector(".get-name button"),
    audios = {
        click: "sounds/click.mp3",
        stop: "sounds/bottles.mp3",
        button: "sounds/click-button.mp3",
        begain: "sounds/begain.mp3",
        win: "sounds/win.mp3",
        correct: "sounds/correct.mp3"
    };
function sound(value) {
    let audio = new Audio(audios[value]);
    audio.play();
}
buttons.forEach((btn) => btn.addEventListener("click", () => sound("button")));
createCards();
function rotation() {
    [...cards.children].forEach((card) => {
        card.addEventListener("click", () => {
            if (cards.dataset.opened < 2) {
                card.classList.add("rotation");
                cards.dataset.opened++;
                sound("click");
            }
            if (cards.dataset.opened == 2) {
                [...cards.children].forEach((el) => {
                    if (
                        el.dataset.src == card.dataset.src &&
                        el.dataset.num != card.dataset.num &&
                        el.classList.contains("rotation")
                    ) {
                        card.classList.add("correct");
                        el.classList.add("correct");
                        sound("correct");
                    }
                });
                if (!card.classList.contains("correct")) {
                    wrongs.textContent++;
                }
                setTimeout(() => {
                    removeAll("rotation", [...cards.children]);
                    cards.dataset.opened = 0;
                }, 1200);
            }
            checkwin();
        });
    });
}
function createCards() {
    cards.innerHTML = "";
    let imagesFolder = "images",
        imagesAlt = [
            { alt: "html" },
            { alt: "typescript" },
            { alt: "css" },
            { alt: "sass" },
        ],
        imagesSources = [
            "https://cdn.worldvectorlogo.com/logos/html-1.svg",
            "https://cdn.worldvectorlogo.com/logos/typescript.svg",
            // "https://cdn.worldvectorlogo.com/logos/css-3.svg",
            // "https://cdn.worldvectorlogo.com/logos/vue-9.svg",
            // "https://cdn.worldvectorlogo.com/logos/gulp.svg",
            // "https://cdn.worldvectorlogo.com/logos/sass-1.svg"
            // "https://cdn.worldvectorlogo.com/logos/react-2.svg",
            // "https://cdn.worldvectorlogo.com/logos/java-14.svg",
            // "https://cdn.worldvectorlogo.com/logos/c.svg",
            // "https://cdn.worldvectorlogo.com/logos/c--4.svg",
            // "https://cdn.worldvectorlogo.com/logos/bootstrap-5-1.svg"
        ],
        // {src:`${imagesFolder}/html.svg`},
        // {src:`${imagesFolder}/typescript.svg`},
        // {src:`${imagesFolder}/css.svg`},
        // {src:`${imagesFolder}/sass.svg`},
        // imagesAlt.forEach(
        //     (obj) => (obj.src = `${imagesFolder}/${obj.alt}.svg`)
        // );
        // let imagesInfo = imagesAlt,
        //     newArr = new Array();
        // imagesInfo.forEach((obj) => {
        //     newArr.push(obj.src);
        //     newArr.push(obj.src);
        // })
        newArr = [...imagesSources, ...imagesSources],
        total = newArr.length;
    for (let i = 0; i < total; i++) {
        let index = Math.floor(Math.random() * (total - i)),
            card = document.createElement("div"),
            frontface = document.createElement("div"),
            backface = document.createElement("div"),
            img = document.createElement("img");
        card.classList.add("card", "border", "transition", "relative");
        card.dataset.num = i;
        card.dataset.src = newArr[index];
        card.dataset.soundonclick = "click";
        frontface.classList.add("frontface", "flex", "abs");
        frontface.textContent = "?";
        card.appendChild(frontface);
        backface.classList.add("backface", "flex", "abs");
        img.src = `${newArr[index]}`;
        backface.appendChild(img);
        card.appendChild(backface);
        cards.appendChild(card);
        newArr.splice(index, 1);
    }
    rotation();
}
startBtn.addEventListener("click", () => {
    getName.classList.add("show");
    nameInput.focus()
    goBtn.addEventListener("click", () => {
        sound("begain");
        goBtn.parentElement.parentElement.classList.add("hidden");
        nameSpan.textContent = !nameInput.value? "unknown": nameInput.value;
        startTimer();
    })
})
function checkwin() {
    let j = 0;
    [...cards.children].forEach((card) => {
        if (card.classList.contains("correct")) {
            j++;
        }
    });
    if (j == cards.children.length) {
        win();
    }
}
function win() {
    winTime.textContent = timerSpan.dataset.time - timerSpan.textContent;
    setToLocalStorage();
    arrangeInfo();
    showResults();
    sound("win");
    let addition = winWindow.scrollHeight - window.innerHeight;
    if (addition > 0) {
        container.style.height = `${container.scrollHeight + addition + 250}px`;
    }
    winWindow.classList.add("show");
}
function setToLocalStorage() {
    let playerInfo = { name: nameSpan.textContent, time: winTime.textContent },
        playersInfo = JSON.parse(window.localStorage.getItem("players")),
        j = 0;
    if (!playersInfo) {
        window.localStorage.setItem("players", JSON.stringify([playerInfo]));
    } else {
        if (!Array.isArray(playersInfo)) {
            playersInfo = [playersInfo];
        }
        for (let i = 0; i < playersInfo.length; i++) {
            if (playersInfo[i].name == nameSpan.textContent) {
                if (playersInfo[i].time > winTime.textContent) {
                    playerInfo.time = winTime.textContent;
                    playersInfo.splice(i, 1);
                    playersInfo.push(playerInfo);
                }
                j++;
            }
        }
        if (j == 0) {
            playersInfo.push(playerInfo);
        }
        window.localStorage.setItem("players", JSON.stringify(playersInfo));
    }
}
function arrangeInfo() {
    let playersInfo = JSON.parse(window.localStorage.getItem("players")),
        playersTime = [1],
        playersNames = [1],
        arrangingTime = [1],
        arrangingInfo = [1];
    for (let i = 0; i < playersInfo.length; i++) {
        if (i == 0) {
            playersTime = [playersInfo[i].time];
            playersNames = [playersInfo[i].name];
        } else {
            playersTime.push(playersInfo[i].time);
            playersNames.push(playersInfo[i].name);
        }
    }
    playersTime = playersTime.map((time) => +time);
    for (let i = 0; i < playersInfo.length; i++) {
        let minValue = Math.min(...playersTime),
            indexOfMinValue = playersTime.indexOf(+minValue);
        if (i == 0) {
            arrangingTime = [minValue];
        } else {
            arrangingTime.push(minValue);
        }
        playersTime.splice(indexOfMinValue, 1);
    }
    playersInfo.forEach((obj) => {
        obj.taken = false;
    })
    for (let i = 0; i < playersInfo.length; i++) {
        for (let j = 0; j < playersInfo.length; j++) {
            if (playersInfo[j].time == arrangingTime[i]) {
                if (!playersInfo[j].taken) {
                    if (i == 0) {
                        arrangingInfo = [playersInfo[j]];
                    } else {
                        arrangingInfo.push(playersInfo[j]);
                    }
                    playersInfo[j].taken = true;
                    break;
                }
            }
        }
    }
    window.localStorage.setItem("players", JSON.stringify(arrangingInfo));
}
function showResults() {
    let playersInfo = JSON.parse(window.localStorage.getItem("players"));
    resultsParent.innerHTML = "";
    for (let i = 0; i < playersInfo.length; i++) {
        let playerInfo = playersInfo[i],
            parent = document.createElement("div"),
            text = document.createElement("div"),
            num = document.createElement("span"),
            name = document.createElement("div"),
            winTime = document.createElement("span"),
            time = document.createElement("span"),
            button = document.createElement("button");
        parent.classList.add("result");
        text.classList.add("text");
        num.classList.add("num");
        num.textContent = i + 1;
        text.appendChild(num);
        name.classList.add("name");
        name.textContent = playerInfo.name;
        text.appendChild(name);
        winTime.classList.add("win-time");
        time.classList.add("time");
        time.textContent = playerInfo.time;
        winTime.appendChild(time);
        winTime.append("s");
        text.appendChild(winTime);
        parent.appendChild(text);
        button.textContent = "remove";
        button.onclick = () => {
            parent.remove();
            playersInfo.splice(i, 1);
            window.localStorage.setItem("players", JSON.stringify(playersInfo));
            showResults();
            if (container.scrollHeight >= (window.innerHeight + 30)) {
                container.style.height = `${container.scrollHeight - 30}px`;
            }
        };
        parent.appendChild(button);
        resultsParent.appendChild(parent);
    }
}
function stop() {
    let wrongs2 = document.querySelector(".stop .wrongs");
    if (wrongs.textContent > 1) {
        wrongs2.textContent = `you have ${wrongs.textContent} wrong tries`;
    } else if (wrongs.textContent == 1) {
        wrongs2.textContent = "you have one wrong try";
    } else {
        wrongs2.textContent = "you don't have any wrong try";
    }
    sound("stop");
    stopWindow.classList.add("show");
}
againButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        container.style.height = `${window.innerHeight}px`; 
        removeAll(["rotation", "correct"], [...cards.children]);
        stopWindow.classList.remove("show");
        winWindow.classList.remove("show");
        wrongs.textContent = 0;
        createCards();
        timerSpan.textContent = timerSpan.dataset.time;
        startTimer();
    })
})
function startTimer() {
    timerSpan.textContent = timerSpan.dataset.time;
    let i = 9;
    let timer = setInterval(() => {
        if (!winWindow.classList.contains("show")) {
            if (timerSpan.textContent > 0) {
                if (timerSpan.textContent > 10) {
                    timerSpan.textContent--;
                } else {
                    timerSpan.textContent = `0${i--}`;
                }
            } else {
                clearInterval(timer);
                stop();
            }
        }
    }, 1000);
}
//global functions
function removeAll(className, elements) {
    elements.forEach((el) => {
        el.classList.remove(className);
    });
}




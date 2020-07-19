document.addEventListener("DOMContentLoaded",() => {
    const grid = document.querySelector(".grid");
    const modalBox = document.querySelector(".modal");
    let loading = document.querySelector(".start");
    let modal = document.getElementsByClassName("close");

    let instruct = document.querySelector("#instruct");
    let help = document.createElement("button");
    help.innerText = "Instructions";
    instruct.appendChild(help);

    let leave = document.querySelector("#quit");
    let quit = document.createElement("button");
    quit.innerText = "Quit?";
    leave.appendChild(quit);

    modal.item(0).addEventListener("click",closeModal);
    modal.item(1).addEventListener("click",closeModal);
    window.addEventListener("click",clickOutside);

    const scoreBoard = document.getElementById("score");
    scoreBoard.innerText = "Score 0 Target 200";
    let firstRound = true;
    let limit = 20;
    let streak = 0;
    let fruitLimit = 40;
    let target = document.getElementById("target");
    target.innerText = "Fruit Target " + fruitLimit;
    const roundsBoard = document.getElementById("rounds");
    roundsBoard.innerText = "Streak " + streak;
    let movesCounter = document.getElementById("moves");
    movesCounter.innerText = "Moves " + limit;
    const width = 64; const squares = [];
    let colorTracker = [0,0,0,0,0];
    let specialNames = ["fruitCup","Smoothies","Basket"];
    let moveLimit = limit;
    const images = ["url(image/Apple.jpg)","url(image/Banana.png)","url(image/Orange.jpg)","url(image/Pineapple.jpg)","url(image/Strawberry.jpg)",
                    "url(image/Cherry.jpg)","url(image/Grapes.jpg)","url(image/Mango.jpg)","url(image/Peach.jpg)","url(image/Pear.jpg)"];
    let colors = [];
    const specialColors = ["url(image/fruitCup.png)","url(image/Smoothies.png)","url(image/Basket.jpg)"];
    let score = 0;
    let replace;

    let trackName1;
    let trackName2;
    let trackName3;
    let trackName4;
    let trackName5;

    const track1 = document.getElementById("1");
    const track2 = document.getElementById("2");
    const track3 = document.getElementById("3");
    const track4 = document.getElementById("4");
    const track5 = document.getElementById("5");

    let button = document.createElement("button");
    button.innerText = "Start";
    loading.appendChild(button);

    let gameDone  = document.createElement("div");

    button.addEventListener("click",create);
    let interval;
    let winInterval;

    function closeModal() {modalBox.classList.add("hide");}
    function OpenModal() {modalBox.classList.remove("hide");}

    help.addEventListener("click",OpenModal);


    function clickOutside(event) {
        if (event.target === modalBox) {
            modalBox.classList.add("hide");
            remover();
        }
    }
    function remover() {window.removeEventListener("click",clickOutside);}

    function pickColors() {
        let x = 0;
        let randomNum;
        while (x < 5) {
            randomNum = Math.floor(Math.random() * images.length);
            if (!colors.includes(images[randomNum])) {
                colors.push(images[randomNum]);
                x++;
            }
        }
        let name = colors[0].slice(10);
        trackName1 = name.substr(0, name.length - 5)
        track1.innerText = trackName1 + " 0";
        track1.style.color = "deepskyblue";

        name = colors[1].slice(10);
        trackName2 = name.substr(0, name.length - 5);
        track2.innerText = trackName2 + " 0";
        track2.style.color = "deepskyblue";

        name = colors[2].slice(10);
        trackName3 = name.substr(0, name.length - 5);
        track3.innerText = trackName3 + " 0";
        track3.style.color = "deepskyblue";

        name = colors[3].slice(10);
        trackName4 = name.substr(0, name.length - 5)
        track4.innerText = trackName4 + " 0";
        track4.style.color = "deepskyblue";

        name = colors[4].slice(10);
        trackName5 = name.substr(0, name.length - 5)
        track5.innerText = trackName5 + " 0";
        track5.style.color = "deepskyblue";
    }

    function create() {
        movesCounter.innerText = "Moves " + limit;
        movesCounter.style.color = "grey";
        scoreBoard.style.color = "grey";

        pickColors();

        //creates new random board
        if (firstRound) {
            for (let i = 0; i < width; i++) {
                const square = document.createElement("div");
                square.setAttribute("draggable", "true");
                square.setAttribute("id", i.toString());
                let randomColor = Math.floor(Math.random() * colors.length);
                square.style.backgroundImage = colors[randomColor];
                grid.appendChild(square);
                squares.push(square);
            }

        } else {
            for (let i = 0; i < width; i++) {
                squares[i].style.opacity = "1";
                let randomColor = Math.floor(Math.random() * colors.length);
                squares[i].style.backgroundImage = colors[randomColor];
            }

        }
        loading.classList.add("hide");
        runGame();
    }


    function runGame() {
        quit.addEventListener("click", function () {
            moveLimit = 0;
            gameOver();
        });

        winInterval = window.setInterval(function () {
            gameWon();
            gameOver();
        },1000);

        interval = window.setInterval(function () {
            moveDown();
            fillCheck();
            ruleChecks();
        }, 500);

        //dragging actions
        if (firstRound) {
            squares.forEach(square => square.addEventListener("dragstart", ondragstart));
            squares.forEach(square => square.addEventListener("dragend", ondragend));
            squares.forEach(square => square.addEventListener("dragover", ondragover));
            squares.forEach(square => square.addEventListener("dragenter", ondragenter));
            squares.forEach(square => square.addEventListener("dragleave", ondragleave));
            squares.forEach(square => square.addEventListener("drop", ondrop));
        }

        let colorDrag;
        let colorReplace;
        let squareDrag;
        let squareReplace;

        function ondragstart() {
            colorDrag = this.style.backgroundImage;
            squareDrag = parseInt(this.id);
            console.log(this.id, "start", colorDrag);
        }

        function ondragover(event) {
            event.preventDefault();
        }

        function ondragenter(event) {
            event.preventDefault();
        }

        function ondragleave() {}

        function ondragend() {
            console.log(this.id, "end");
            let validHorizontal = [squareDrag - 1, squareDrag + 1];
            let validVertical = [squareDrag + 8, squareDrag - 8];

            let specialItem = squares[squareReplace].style.backgroundImage.slice(11);
            if (specialNames.includes(specialItem.substr(0, specialItem.length - 6)) && squareDrag !== squareReplace) {
                if (specialItem.substr(0, specialItem.length - 6) === "Smoothies") {
                    let addedColor = squares[squareDrag].style.backgroundImage; //saves the color before it is cleared
                    let added = addedColor.slice(11);
                    if (specialNames.includes(added.substr(0, added.length - 6))) {
                        clearEverything();
                        movesTracker();
                    } else {
                        let cleared = clearColor(squares[squareDrag].style.backgroundImage);
                        scoreKeeper(addedColor, cleared);
                        totalScoreKeeper(cleared);
                        squares[squareReplace].style.backgroundImage = "";
                        movesTracker();
                    }
                } else {
                    if (specialItem.substr(0, specialItem.length - 6) === "fruitCup" && squares[squareDrag].style.backgroundImage === squares[squareReplace].style.backgroundImage && squareReplace !== squareDrag) {
                        let up = 0;
                        let down = 0;
                        if (Math.abs(squareReplace - squareDrag) === 1) {
                            up = Math.floor(squareReplace / 8);
                            down = Math.floor((63 - squareReplace) / 8);
                            squares[squareDrag].style.backgroundImage = "";
                            squares[squareReplace].style.backgroundImage = "";
                            clearFruitCup(squareReplace, up, down, 8, 7);
                            clearFruitCup(squareDrag, up, down, 8, 7);
                            movesTracker();
                        } else {
                            let up = 0;
                            let down = 0;
                            let tempReplace = squareReplace; //temp place holder
                            if (squareReplace % 8 === 0)
                                up = 0;
                            else {
                                while ((tempReplace) % 8 !== 0) {
                                    tempReplace--;
                                    up++;
                                }
                            }
                            tempReplace = squareReplace
                            if ((squareReplace + 1) % 8 === 0)
                                down = 0;
                            else {
                                while ((tempReplace + 1) % 8 !== 0) {
                                    tempReplace++;
                                    down++;
                                }
                            }
                            squares[squareDrag].style.backgroundImage = "";
                            squares[squareReplace].style.backgroundImage = "";
                            clearFruitCup(squareReplace, up, down, 1, 7);
                            clearFruitCup(squareDrag, up, down, 1, 7);
                            movesTracker();
                        }
                    } else
                        noEffect();
                }
            } else {
                if (squareReplace && validHorizontal.includes(squareReplace) === true || squareReplace === 0) {
                    if (squareReplace === 0 || squareReplace === 1) {
                        let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace + 2].style.backgroundImage];
                        if (CheckSameColor(colorCheck))
                            changeThings();
                        else {
                            colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace + 16].style.backgroundImage];
                            if (CheckSameColor(colorCheck))
                                changeThings();
                            else
                                noEffect();
                        }
                    } else {
                        if (squareReplace === 6 || squareReplace === 7) {
                            let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace - 2].style.backgroundImage];
                            if (CheckSameColor(colorCheck))
                                changeThings();
                            else {
                                colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace + 16].style.backgroundImage];
                                if (CheckSameColor(colorCheck))
                                    changeThings();
                                else
                                    noEffect();
                            }
                        } else {
                            if (squareReplace === 56 || squareReplace === 57) {
                                let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace + 2].style.backgroundImage];
                                if (CheckSameColor(colorCheck))
                                    changeThings();
                                else {
                                    colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace - 16].style.backgroundImage];
                                    if (CheckSameColor(colorCheck))
                                        changeThings();
                                    else
                                        noEffect();
                                }
                            } else {
                                if (squareReplace === 62 || squareReplace === 63) {
                                    let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace - 2].style.backgroundImage];
                                    if (CheckSameColor(colorCheck))
                                        changeThings();
                                    else {
                                        colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace - 16].style.backgroundImage];
                                        if (CheckSameColor(colorCheck))
                                            changeThings();
                                        else
                                            noEffect();
                                    }
                                } else {
                                    if (squareReplace === 8 || squareReplace === 9) {
                                        let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace + 2].style.backgroundImage];
                                        if (CheckSameColor(colorCheck))
                                            changeThings();
                                        else {
                                            colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace + 16].style.backgroundImage];
                                            if (CheckSameColor(colorCheck))
                                                changeThings();
                                            else {
                                                colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage];
                                                if (CheckSameColor(colorCheck))
                                                    changeThings();
                                                else
                                                    noEffect();
                                            }
                                        }
                                    } else {
                                        if (squareReplace === 14 || squareReplace === 15) {
                                            let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace - 2].style.backgroundImage];
                                            if (CheckSameColor(colorCheck))
                                                changeThings();
                                            else {
                                                colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace + 16].style.backgroundImage];
                                                if (CheckSameColor(colorCheck))
                                                    changeThings();
                                                else {
                                                    colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage];
                                                    if (CheckSameColor(colorCheck))
                                                        changeThings();
                                                    else
                                                        noEffect();
                                                }
                                            }
                                        } else {
                                            if (squareReplace === 48 || squareReplace === 49) {
                                                let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace + 2].style.backgroundImage];
                                                if (CheckSameColor(colorCheck))
                                                    changeThings();
                                                else {
                                                    colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace - 16].style.backgroundImage];
                                                    if (CheckSameColor(colorCheck))
                                                        changeThings();
                                                    else {
                                                        colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage];
                                                        if (CheckSameColor(colorCheck))
                                                            changeThings();
                                                        else
                                                            noEffect();
                                                    }
                                                }
                                            } else {
                                                if (squareReplace === 54 || squareReplace === 55) {
                                                    let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace - 2].style.backgroundImage];
                                                    if (CheckSameColor(colorCheck))
                                                        changeThings();
                                                    else {
                                                        colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace - 16].style.backgroundImage];
                                                        if (CheckSameColor(colorCheck))
                                                            changeThings();
                                                        else {
                                                            colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage];
                                                            if (CheckSameColor(colorCheck))
                                                                changeThings();
                                                            else
                                                                noEffect();
                                                        }
                                                    }
                                                } else {
                                                    if (squareReplace > 1 && squareReplace < 6) {
                                                        let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace - 2].style.backgroundImage];
                                                        if (CheckSameColor(colorCheck))
                                                            changeThings();
                                                        else {
                                                            colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace + 2].style.backgroundImage];
                                                            if (CheckSameColor(colorCheck))
                                                                changeThings();
                                                            else {
                                                                colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace + 16].style.backgroundImage];
                                                                if (CheckSameColor(colorCheck))
                                                                    changeThings();
                                                                else
                                                                    noEffect();
                                                            }
                                                        }
                                                    } else {
                                                        if (squareReplace > 57 && squareReplace < 62) {
                                                            let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace - 2].style.backgroundImage];
                                                            if (CheckSameColor(colorCheck))
                                                                changeThings();
                                                            else {
                                                                colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace + 2].style.backgroundImage];
                                                                if (CheckSameColor(colorCheck))
                                                                    changeThings();
                                                                else {
                                                                    colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace - 16].style.backgroundImage];
                                                                    if (CheckSameColor(colorCheck))
                                                                        changeThings();
                                                                    else
                                                                        noEffect();
                                                                }
                                                            }
                                                        } else {
                                                            if (squareReplace > 9 && squareReplace < 14) {
                                                                let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace - 2].style.backgroundImage];
                                                                if (CheckSameColor(colorCheck))
                                                                    changeThings();
                                                                else {
                                                                    colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace + 2].style.backgroundImage];
                                                                    if (CheckSameColor(colorCheck))
                                                                        changeThings();
                                                                    else {
                                                                        colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace + 16].style.backgroundImage];
                                                                        if (CheckSameColor(colorCheck))
                                                                            changeThings();
                                                                        else {
                                                                            colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage];
                                                                            if (CheckSameColor(colorCheck))
                                                                                changeThings();
                                                                            else
                                                                                noEffect();
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                if (squareReplace > 49 && squareReplace < 54) {
                                                                    let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace - 2].style.backgroundImage];
                                                                    if (CheckSameColor(colorCheck))
                                                                        changeThings();
                                                                    else {
                                                                        colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace + 2].style.backgroundImage];
                                                                        if (CheckSameColor(colorCheck))
                                                                            changeThings();
                                                                        else {
                                                                            colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace - 16].style.backgroundImage];
                                                                            if (CheckSameColor(colorCheck))
                                                                                changeThings();
                                                                            else {
                                                                                colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage];
                                                                                if (CheckSameColor(colorCheck))
                                                                                    changeThings();
                                                                                else
                                                                                    noEffect();
                                                                            }
                                                                        }
                                                                    }
                                                                } else if ([16, 17, 24, 25, 32, 33, 40, 41].includes(squareReplace)) {
                                                                    let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace + 2].style.backgroundImage];
                                                                    if (CheckSameColor(colorCheck))
                                                                        changeThings();
                                                                    else {
                                                                        colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace + 16].style.backgroundImage];
                                                                        if (CheckSameColor(colorCheck))
                                                                            changeThings();
                                                                        else {
                                                                            colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace - 16].style.backgroundImage];
                                                                            if (CheckSameColor(colorCheck))
                                                                                changeThings();
                                                                            else {
                                                                                colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage];
                                                                                if (CheckSameColor(colorCheck))
                                                                                    changeThings();
                                                                                else
                                                                                    noEffect();
                                                                            }
                                                                        }
                                                                    }
                                                                } else {
                                                                    if ([14, 15, 22, 23, 30, 31, 38, 39, 46, 47].includes(squareReplace)) {
                                                                        let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace - 2].style.backgroundImage];
                                                                        if (CheckSameColor(colorCheck))
                                                                            changeThings();
                                                                        else {
                                                                            colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace + 16].style.backgroundImage];
                                                                            if (CheckSameColor(colorCheck))
                                                                                changeThings();
                                                                            else {
                                                                                colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace - 16].style.backgroundImage];
                                                                                if (CheckSameColor(colorCheck))
                                                                                    changeThings();
                                                                                else {
                                                                                    colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage];
                                                                                    if (CheckSameColor(colorCheck))
                                                                                        changeThings();
                                                                                    else
                                                                                        noEffect();
                                                                                }
                                                                            }
                                                                        }
                                                                    } else {
                                                                        let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace - 2].style.backgroundImage];
                                                                        if (CheckSameColor(colorCheck))
                                                                            changeThings();
                                                                        else {
                                                                            colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace + 2].style.backgroundImage];
                                                                            if (CheckSameColor(colorCheck))
                                                                                changeThings();
                                                                            else {
                                                                                colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace - 16].style.backgroundImage];
                                                                                if (CheckSameColor(colorCheck))
                                                                                    changeThings();
                                                                                else {
                                                                                    colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace + 16].style.backgroundImage];
                                                                                    if (CheckSameColor(colorCheck))
                                                                                        changeThings();
                                                                                    else {
                                                                                        colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage];
                                                                                        if (CheckSameColor(colorCheck))
                                                                                            changeThings();
                                                                                        else
                                                                                            noEffect();
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                //vertical movement rules
                else {
                    if (squareReplace && validVertical.includes(squareReplace) === true) {
                        if (squareReplace >= 0 && squareReplace <= 7) //first row
                            matchRow();
                        else {
                            if (squareReplace >= 8 && squareReplace <= 15) {
                                let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace + 16].style.backgroundImage];
                                if (CheckSameColor(colorCheck))
                                    changeThings();
                                else
                                    matchRow();
                            } else {
                                if (squareReplace >= 56 && squareReplace <= 63)
                                    matchRow();
                                else {
                                    if (squareReplace >= 48 && squareReplace <= 55) {
                                        let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace - 16].style.backgroundImage];
                                        if (CheckSameColor(colorCheck))
                                            changeThings();
                                        else
                                            matchRow();
                                    } else //everything else
                                    {
                                        let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 8].style.backgroundImage, squares[squareReplace - 16].style.backgroundImage];
                                        if (CheckSameColor(colorCheck))
                                            changeThings();
                                        colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 8].style.backgroundImage, squares[squareReplace + 16].style.backgroundImage];
                                        if (CheckSameColor(colorCheck))
                                            changeThings();
                                        else {
                                            colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage]
                                            if (CheckSameColor(colorCheck))
                                                changeThings();
                                            else
                                                matchRow();
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (squareReplace && validVertical.includes(squareReplace) === false && validHorizontal.includes(squareReplace) === false)
                            noEffect();
                        else
                            squares[squareDrag].style.backgroundImage = colorDrag;
                    }
                }
            }
        }

        function ondrop() {
            console.log(this.id, "drop");
            colorReplace = this.style.backgroundImage;
            squareReplace = parseInt(this.id);
            squares[squareDrag].style.backgroundImage = colorReplace;  //put the new color in the old square;
            squares[squareReplace].style.backgroundImage = colorDrag;
        }

        function CheckSameColor(colorCheck) {
            return colorCheck.every(val => val === colorCheck[0])
            }

        function checkForFruits() {
            return colorTracker.every(value => value >= fruitLimit)
        }

        function matchRow() {
            let colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage];
            if (CheckSameColor(colorCheck))
                changeThings();
            colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace - 1].style.backgroundImage, squares[squareReplace - 2].style.backgroundImage];
            if (CheckSameColor(colorCheck))
                changeThings();
            else {
                colorCheck = [squares[squareReplace].style.backgroundImage, squares[squareReplace + 1].style.backgroundImage, squares[squareReplace + 2].style.backgroundImage];
                if (CheckSameColor(colorCheck))
                    changeThings();
                else
                    noEffect();
            }
        }

        function movesTracker() {
            moveLimit--;
            movesCounter.innerText = "Moves " + moveLimit;
            if (moveLimit <= 3)
                movesCounter.style.color = "red";
        }

        function gameOver() {
            gameWon();
            if (moveLimit === 0) {
                gameDone.innerText = "You lost";
                firstRound = false;
                for (let i = 0; i < width; i++) {
                    squares[i].style.opacity = "0";
                }
                clearInterval(interval);
                clearInterval(winInterval);
                loading.classList.remove("hide");
                button.innerText = "Restart?";
                loading.appendChild(gameDone);
                loading.appendChild(button);
                colors = [];
                score = 0;
                moveLimit = limit;
                colorTracker = [0, 0, 0, 0, 0];
                streak = 0;
                roundsBoard.innerText = "Streak " + streak;
            }
        }

        function gameWon() {
            if (score >= 200 && checkForFruits()) {
                gameDone.innerText = "You Won";
                firstRound = false;
                for (let i = 0; i < width; i++)
                    squares[i].style.opacity = "0";

                clearInterval(interval);
                clearInterval(winInterval);
                loading.classList.remove("hide");
                button.innerText = "Another Round?";
                loading.appendChild(gameDone);
                loading.appendChild(button);
                colors = [];
                score = 0;
                moveLimit = limit;
                colorTracker = [0, 0, 0, 0, 0];
                streak++;
                roundsBoard.innerText = "Streak " + streak;
            }
        }

        function changeThings() {
            replace = squareReplace;
            squareReplace = "";
            movesTracker();
        }

        function noEffect() {
            console.log("no effect");
            replace = squareReplace;
            squares[squareReplace].style.backgroundImage = colorReplace;
            squares[squareDrag].style.backgroundImage = colorDrag;
        }

        //score logic
        const noStart3Next2 = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
        function checkRow3() {
            for (let i = 0; i < 62; i++) {
                let row3 = [i, i + 1, i + 2];
                let decidor = squares[i].style.backgroundImage;
                const isBlank = squares[i].style.backgroundImage === "";
                if (noStart3Next2.includes(i))
                    continue;
                clearer(row3, 3, decidor, isBlank);
            }
        }

        function checkCol3() {
            for (let i = 0; i <= 47; i++) {
                let col3 = [i, i + 8, i + 16];
                let decidor = squares[i].style.backgroundImage;
                const isBlank = squares[i].style.backgroundImage === "";
                clearer(col3, 3, decidor, isBlank);
            }
        }

        function clearer(array, number, decidor, isBlank) {
            if (array.every(index => squares[index].style.backgroundImage === decidor && !isBlank)) {
                totalScoreKeeper(number);
                scoreKeeper(decidor, number);
                array.forEach(index => {
                    squares[index].style.backgroundImage = "";
                })
            }
        }

        const noStart4 = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
        function checkRow4() {
            for (let i = 0; i < 60; i++) {
                let row4 = [i, i + 1, i + 2, i + 3];
                let decidor = squares[i].style.backgroundImage;
                const isBlank = squares[i].style.backgroundImage === "";
                if (noStart4.includes(i))
                    continue;
                clearer4(row4, 4, decidor, isBlank, i);
            }
        }

        function checkCol4() {
            for (let i = 0; i <= 39; i++) {
                let col4 = [i, i + 8, i + 16, i + 24];
                let decidor = squares[i].style.backgroundImage;
                const isBlank = squares[i].style.backgroundImage === "";
                clearer4(col4, 4, decidor, isBlank, i);
            }
        }

        function clearer4(array, number, decidor, isBlank, i) {
            if (array.every(index => squares[index].style.backgroundImage === decidor && !isBlank)) {
                totalScoreKeeper(number)
                scoreKeeper(decidor, number);
                array.forEach(index => {
                    squares[index].style.backgroundImage = "";
                })
                addSpecialItem(0, i);
            }
        }

        const noStart5 = [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38, 39, 44, 45, 46, 47, 52, 53, 54, 55];

        function checkRow5() {
            for (let i = 0; i < 59; i++) {
                let row5 = [i, i + 1, i + 2, i + 3, i + 4];
                let decidor = squares[i].style.backgroundImage;
                const isBlank = squares[i].style.backgroundImage === "";
                if (noStart5.includes(i))
                    continue;
                clearer5(row5, 5, decidor, isBlank, i);
            }
        }

        function checkCol5() {
            for (let i = 0; i <= 31; i++) {
                let col5 = [i, i + 8, i + 16, i + 24, i + 32]
                let decidor = squares[i].style.backgroundImage;
                const isBlank = squares[i].style.backgroundImage === "";
                clearer5(col5, 5, decidor, isBlank, i);
            }
        }

        function clearer5(array, number, decidor, isBlank, i) {
            if (array.every(index => squares[index].style.backgroundImage === decidor && !isBlank)) {
                totalScoreKeeper(number);
                scoreKeeper(decidor, number);
                array.forEach(index => {
                    squares[index].style.backgroundImage = "";
                })
                addSpecialItem(1, i);
            }
        }

        function lShape() {
            let notValid = [8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
            for (let i = 2; i < 48; i++) {
                let lShape = [i, i + 8, i + 16, i - 1, i - 2];
                lShaper(lShape, notValid, i)
            }

            for (let i = 18; i < 64; i++) {
                let lShape = [i, i - 8, i - 16, i - 1, i - 2];
                lShaper(lShape, notValid, i);
            }

            notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
            for (let i = 0; i < 46; i++) {
                let lShape = [i, i + 8, i + 16, i + 1, i + 2];
                lShaper(lShape, notValid, i);
            }

            for (let i = 16; i < 62; i++) {
                let lShape = [i, i - 8, i - 16, i + 1, i + 2];
                lShaper(lShape, notValid, i);
            }
        }

        function lShaper(lShape, notValid, i) {
            let decidor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
            if (!notValid.includes(i))
                lClearer(lShape, 5, decidor, isBlank, i);
        }

        function lClearer(array, number, decidor, isBlank, i) {
            if (array.every(index => squares[index].style.backgroundImage === decidor && !isBlank)) {
                totalScoreKeeper(number);
                scoreKeeper(decidor, number);
                array.forEach(index => {
                    squares[index].style.backgroundImage = "";
                })
                addSpecialItem(2, i);
            }
        }

        //looks for cross shaped matches
        function crossMatch() {
            for (let i = 9; i < 55; i++) {
                if (![15, 16, 23, 24, 31, 32, 39, 40, 47, 48].includes(i)) {
                    let cross = [i, i - 8, i + 8, i + 1, i + 2];
                    let notValid = [14, 22, 30, 38, 46, 54];
                    crossShape(cross, notValid, i);

                    let cross1 = [i, i - 8, i + 8, i - 1, i - 2];
                    notValid = [9, 17, 25, 33, 41, 49];
                    crossShape(cross1, notValid, i);

                    let cross2 = [i, i + 8, i + 16, i + 1, i - 1];
                    notValid = [49, 50, 51, 52, 53, 54];
                    crossShape(cross2, notValid, i);

                    let cross3 = [i, i - 8, i - 16, i + 1, i - 1];
                    notValid = [9, 10, 11, 12, 13, 14];
                    crossShape(cross3, notValid, i);
                }
            }
        }

        function crossShape(cross, notValid, i) {
            let decidor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
            if (!notValid.includes(i))
                lClearer(cross, 4, decidor, isBlank, i);
        }

        function addSpecialItem(number, i) {
            if (replace === undefined)
                replace = i;
            squares[parseInt(replace)].style.backgroundImage = specialColors[number];
        }

        function scoreKeeper(decidor, number) {
            switch (decidor.substr(11, 5)) {
                case colors[0].substr(10, 5):
                    colorTracker[0] = colorTracker[0] + number;
                    track1.innerText = trackName1 + " " + colorTracker[0];
                    if (colorTracker[0] >= fruitLimit)
                        track1.style.color = "green";
                    break;
                case colors[1].substr(10, 5):
                    colorTracker[1] = colorTracker[1] + number;
                    track2.innerText = trackName2 + " " + colorTracker[1];
                    if (colorTracker[1] >= fruitLimit)
                        track2.style.color = "green";
                    break;
                case colors[2].substr(10, 5):
                    colorTracker[2] = colorTracker[2] + number;
                    track3.innerText = trackName3 + " " + colorTracker[2];
                    if (colorTracker[2] >= fruitLimit)
                        track3.style.color = "green";
                    break;
                case colors[3].substr(10, 5):
                    colorTracker[3] = colorTracker[3] + number;
                    track4.innerText = trackName4 + " " + colorTracker[3];
                    if (colorTracker[3] >= fruitLimit)
                        track4.style.color = "green";
                    break;
                case colors[4].substr(10, 5):
                    colorTracker[4] = colorTracker[4] + number;
                    track5.innerText = trackName5 + " " + colorTracker[4];
                    if (colorTracker[4] >= fruitLimit)
                        track5.style.color = "green";
                    break;
                case specialColors[0].substr(10, 5):
                    addMove();
                    break;
                case specialColors[1].substr(10, 5):
                    addMove();
                    break;
                default:
                    break;
            }
        }

        function addMove() {
            reduceBy--;
            moveLimit++;
        }

        function totalScoreKeeper(number) {
            score += number;
            scoreBoard.innerText = "Score " + score + " Target 200";
            if (score >= 200)
                scoreBoard.style.color = "green";
        }

        function clearColor(color) {
            let cleared = 0;
            for (let i = 0; i < width; i++) {
                if (squares[i].style.backgroundImage === color) {
                    squares[i].style.backgroundImage = "";
                    cleared++;
                }
            }
            return cleared;
        }

        function clearEverything() {
            squares[squareReplace].style.backgroundImage = "";
            squares[squareDrag].style.backgroundImage = "";
            let count = 62
            for (let i = 0; i < width; i++) {
                let color = squares[i].style.backgroundImage.slice(11);
                if (specialNames.includes(color.substr(0, color.length - 6))) {
                    addMove();
                    count--;
                    squares[i].style.backgroundImage = "";
                }
                else {
                    scoreKeeper(squares[i].style.backgroundImage, 1);
                    squares[i].style.backgroundImage = "";
                }
            }
            totalScoreKeeper(count);
        }

        let reduceBy;

        function clearFruitCup(typeSquare, plus, minus, steps, value) {
            reduceBy = value;
            for (let i = 0; i < plus + 1; i++) {
                scoreKeeper(squares[typeSquare - (steps * i)].style.backgroundImage, 1);
                squares[typeSquare - (steps * i)].style.backgroundImage = "";
            }
            for (let i = 1; i <= minus; i++) {
                scoreKeeper(squares[typeSquare + (steps * i)].style.backgroundImage, 1);
                squares[typeSquare + (steps * i)].style.backgroundImage = "";
            }
            totalScoreKeeper(reduceBy);
        }

        function basketAction() {
            for (let i = 0; i < width; i++) {
                let specialItem = squares[i].style.backgroundImage.slice(11);
                if (specialItem.substr(0, specialItem.length - 6) === "Basket") {
                    let up = 0;
                    let down = 0;
                    up = Math.floor(i / 8);
                    down = Math.floor((63 - i) / 8);
                    clearFruitCup(i, up, down, 8, 7);

                    let front = 0;
                    let back = 0;
                    let tempReplace = i;
                    if (i % 8 === 0)
                        front = 0;
                    else {
                        while ((tempReplace) % 8 !== 0) {
                            tempReplace--;
                            front++;
                        }
                    }

                    tempReplace = i;
                    if ((i + 1) % 8 === 0)
                        back = 0;
                    else {
                        while ((tempReplace + 1) % 8 !== 0) {
                            tempReplace++;
                            back++;
                        }
                    }
                    clearFruitCup(i, front, back, 1, 7);
                }
            }
        }

        //move down
        function moveDown() {
            for (let i = 0; i <= 55; i++) {
                if (squares[i + 8].style.backgroundImage === "") {
                    squares[i + 8].style.backgroundImage = squares[i].style.backgroundImage;
                    squares[i].style.backgroundImage = "";

                    const isFirst = [0, 1, 2, 3, 4, 5, 6, 7].includes(i);
                    if (isFirst && squares[i].style.backgroundImage === "")
                        squares[i].style.backgroundImage = colors[Math.floor(Math.random() * colors.length)];
                }
            }
        }

        function fillCheck() {
            for (let i = 0; i < 8; i++) {
                if (squares[i].style.backgroundImage === "")
                    squares[i].style.backgroundImage = colors[Math.floor(Math.random() * colors.length)];
            }
        }

        function ruleChecks() {
            checkRow5();
            basketAction();
            crossMatch();
            lShape();
            checkCol5();
            checkRow4();
            checkCol4();checkRow3();
            checkCol3();
        }
    }
})
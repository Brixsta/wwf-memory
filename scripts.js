const startButton = document.querySelector('.start-game-button');
const refreshButtonContainer = document.querySelector('.refresh-button-container');
const homeButtonContainer = document.querySelector('.home-button-container');
const backToMainMenuButton = document.querySelector('.back-to-main-menu-button');
const highScoreButton = document.querySelector('.high-score-button');
const board = document.querySelector('.board');
const turnCounter = document.querySelector('.turn-counter');
const cardsRemainingCounter = document.querySelector('.cards-remaining-counter');
const theme = new Audio('./audio/theme.mp3');
theme.loop = true;

const GameStats = {
    selectedCards: [],
    selectedCardsIndex: [],
    removedCards: [],
    numberOfTurns: 0,
    cardsRemaining: 16,
    highScores: []
}

// start button initiates the game
startButton.addEventListener('click', ()=>{
    const metrics = document.querySelector('.metrics')

    refreshButtonContainer.style.display = "block";
    homeButtonContainer.style.display = "block";

    theme.play();
    // metrics.appendChild(refreshButtonContainer);
    // metrics.appendChild(homeButtonContainer);

    hideMainMenu();
    hideHighScores();
    populateBoard();
});

// view highScores
highScoreButton.addEventListener('click',()=>{
    theme.play();
    hideMainMenu();
    viewHighScores();
});

// instantly restart the game
refreshButtonContainer.addEventListener('click', ()=>{
   instantRestart();
})

// go back to the main menu from inside the game
homeButtonContainer.addEventListener('click', ()=>{
    returnToMainMenuFromGame();
})

// view mainMenu
backToMainMenuButton.addEventListener('click',()=>{
    hideHighScores();
    viewMainMenu();
})

// populate board
const populateBoard = () => {
    const metricsContainer = document.querySelector('.metrics-container');
    const metrics = document.querySelector('.metrics');
    const container = document.querySelector('.container');

    metrics.style.display = "flex";
    metricsContainer.style.display = "flex";
    container.style.display = "block";

    turnCounter.disabled = true;
    cardsRemainingCounter.disabled = true;

    turnCounter.value = GameStats.numberOfTurns;
    cardsRemainingCounter.value = GameStats.cardsRemaining;

    const cardData = createCardData();
    const shuffledCards = shuffleCardData(cardData);

    attachCardsToBoard(shuffledCards);
}

// create card data
const createCardData = () => {
    const arr = [];
    for(let i=1; i<=8; i++) {
        arr.push(i);
        arr.push(i);
    }
    return arr;
}

// shuffle card data to randomly seperate values
const shuffleCardData = (arr) => {
    for(let i=0; i<arr.length; i++) {
        let randomNum = Math.floor(Math.random() * 16);

        let temp = arr[i];
        arr[i] = arr[randomNum];
        arr[randomNum] = temp;
    } 
    return arr;
}

// append cards to board
const attachCardsToBoard = (arr) => {
    for(let i=0; i<arr.length; i++) {
        let card = document.createElement("button");
        card.classList.add('card');
        card.textContent = arr[i];
        card.setAttribute('id', i);
        card.addEventListener('click', (evt)=>{
            playClickNoise();
            let currentIndex = evt.target.id;
            const cards = document.getElementsByClassName('card');

            GameStats.selectedCards.push(Number(card.textContent));
            GameStats.selectedCardsIndex.push(currentIndex)

            card.classList.add('active');
            card.style.backgroundImage = `url('./images/${evt.target.textContent}.png')`;

            disableCurrentCard(cards[currentIndex]);
            checkSelectedCards();
        })
        board.appendChild(card);
    }
}

// check selected cards to see if they match
const checkSelectedCards = () => {

    // cards are a match
    if(GameStats.selectedCards[0] === GameStats.selectedCards[1]) {
        playRandomAudioClip();
        GameStats.numberOfTurns++;
        GameStats.cardsRemaining-=2;
        turnCounter.value = GameStats.numberOfTurns.toString();
        
        setTimeout(()=>{
            cardsRemainingCounter.value = GameStats.cardsRemaining;
        },1000)

        GameStats.removedCards.push(GameStats.selectedCards[0]);
        GameStats.removedCards.push(GameStats.selectedCards[1]);
        disableAllCards();

        setTimeout(()=>{
            hideMatchingCards(GameStats.selectedCardsIndex)
            GameStats.selectedCards = [];
            GameStats.selectedCardsIndex= [];
        },1000);

        setTimeout(()=>{
            enableAllCards();
        },1000)

    // cards don't match
    } else if (GameStats.selectedCards.length === 2) {
        restoreCardBackgroundImg();
        GameStats.numberOfTurns++;
        turnCounter.value = GameStats.numberOfTurns.toString();
        disableAllCards();
        
        setTimeout(()=>{
            restoreCards()
            GameStats.selectedCards = [];
            GameStats.selectedCardsIndex= [];
        },1000)
        
        setTimeout(()=>{
            enableAllCards();
        },1000)
    }
}

//remove cards that match
const hideMatchingCards = (arr) => {
    const cards = document.getElementsByClassName('card');
    const indexOne = arr[0];
    const indexTwo = arr[1];

    cards[indexOne].classList.remove('active');
    cards[indexTwo].classList.remove('active');

    cards[indexOne].style.opacity = 0;
    cards[indexTwo].style.opacity = 0;

    cards[indexOne].disabled = true;
    cards[indexTwo].disabled = true;

    checkGameIsComplete();
}

// restore cards to the default card class and remove active
const restoreCards = () => {
    let cards = document.getElementsByClassName('card');
    for(let i=0; i<cards.length; i++) {
        cards[i].classList.remove('active');
    }
}

// disables current card
const disableCurrentCard = (card) => {
    card.disabled = true;
}

// disable all cards
const disableAllCards = () => {
    const removedCards = GameStats.removedCards;
    const cards = Array.from(document.getElementsByClassName('card'));
    
    cards.disabled = true; 
    for(let i=0; i<cards.length; i++) {
        let current = cards[i];

        current.disabled = true;
    }
}

// enable all cards
const enableAllCards = () => {
    const removedCards = GameStats.removedCards;
    const cards = Array.from(document.getElementsByClassName('card'));
    cards.disabled = true; 
    for(let i=0; i<cards.length; i++) {
        let current = cards[i];
        let cardVal = Number(current.textContent);

        // only enable cards that haven't been removed
        if(!removedCards.includes(cardVal)) {
            current.disabled = false;
        }
    }
}

// restore the background img of all cards after check
const restoreCardBackgroundImg = () => {
    const cards = Array.from(document.getElementsByClassName('card'));
    setTimeout(()=>{
        for(let i=0; i<cards.length; i++) {
            cards[i].style.backgroundImage = `url('./images/card.png')`;
        }
    },1000)
}

// clean off board of all old cards from a previous game
const removeOldCards = () => {
    const container = document.querySelector('.container');
    const board = document.querySelector('.board');
    while(board.hasChildNodes()) {
        board.removeChild(board.firstChild)
    }
    container.style.display = "none";
}

// play random audio clip
const playRandomAudioClip = () => {
    let randomNum = Math.floor(Math.random() * 15);
    const music = new Audio(`./audio/${randomNum}.mp3`);
    music.play();
}

// play click noise
const playClickNoise = () => {
    const click = new Audio(`./audio/swoosh.mp3`);
    click.play();
}

// show high scores
 const viewHighScores = () => {

    const highScoreTableContainer = document.querySelector('.high-score-table-container');
    const highScoreTable = document.querySelector('.high-score-table');

    highScoreTableContainer.style.display = "flex"; 
    highScoreTable.style.display = "block"
     
    grabHighScores();
 }

 // grab scores from local storage
const grabHighScores = ()=> {

    for(let i=0; i<localStorage.length; i++) {
        let name = window.localStorage.key(i);
        let score = window.localStorage.getItem(localStorage.key(i));
        GameStats.highScores.push({name: name, score: Number(score)});
    }

    appendRowsToTable();
}

//append rows to table
const appendRowsToTable = () => {
    clearHighScoresTable();
    const highScoreTable = document.querySelector('.high-score-table');

    const sortedData = sortByLeastTurns();

    let titleRow = document.createElement('tr');
    titleRow.classList.add('table-row');

    let rankCellTitle = document.createElement('td');
    rankCellTitle.classList.add('table-rank');
    rankCellTitle.textContent = 'Rank';

    let nameCellTitle = document.createElement('td');
    nameCellTitle.classList.add('table-heading');
    nameCellTitle.textContent = 'Name';

    let scoreCellTitle = document.createElement('td');
    scoreCellTitle.classList.add('table-heading');
    scoreCellTitle.textContent = 'Turns';

    titleRow.appendChild(rankCellTitle);
    titleRow.appendChild(nameCellTitle);
    titleRow.appendChild(scoreCellTitle);

    highScoreTable.appendChild(titleRow);

    for(let i=0; i<sortedData.length; i++) {
        let name = sortedData[i][0];
        let score = sortedData[i][1];

        let newRow = document.createElement('tr');
        newRow.classList.add('table-row');

        let rankCell = document.createElement('td');
        rankCell.classList.add('table-cell-rank');
        rankCell.textContent = Number(i) + 1;

        let nameCell = document.createElement('td');
        nameCell.classList.add('table-cell');

        let scoreCell = document.createElement('td');
        scoreCell.classList.add('table-cell');
        scoreCell.textContent = score;

        newRow.appendChild(rankCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(scoreCell);

        nameCell.textContent = name;

        highScoreTable.append(newRow);
    }
    GameStats.highScores = [];
}

// append header row to table
const appendHeaderRow = () => {

}

// hide main menu 
const hideMainMenu = ()=> {
    const appTitle = document.querySelector('.app-title');
    const startButton = document.querySelector('.start-game-button');
    const highScoreButton = document.querySelector('.high-score-button');
    
    appTitle.style.display = "none";
    startButton.style.display = "none";
    highScoreButton.style.display = "none";
    
    backToMainMenuButton.style.display = "block";
}

// restore main menu
const viewMainMenu = () => {
    const container = document.querySelector('.container');
    const appTitle = document.querySelector('.app-title');
    const startButton = document.querySelector('.start-game-button');
    const highScoreButton = document.querySelector('.high-score-button');
    
    appTitle.style.display = "flex";
    startButton.style.display = "flex";
    highScoreButton.style.display = "flex";
    container.style.display = "none";
    
    backToMainMenuButton.style.display = "none";
}

// hide highScores
const hideHighScores = () => {
    const highScoreTableContainer = document.querySelector('.high-score-table-container');
    const highScoreTable = document.querySelector('.high-score-table');

    highScoreTableContainer.style.display = "none";
    highScoreTable.style.display = "none";
}

// check game is complete
const checkGameIsComplete = () => {
    if(GameStats.cardsRemaining === 0) {
        const name = prompt('What is your name?');
        const score = GameStats.numberOfTurns;
        console.log(`${name} took ${score} turns to finish the game!`);
        updateHighScores(name,score);
        restoreGameStatsToDefault();
    }
    hideMainMenu();
}

// update high scores after a player wins
const updateHighScores = (name,score) => {
    window.localStorage.setItem(name,score);
    removeOldCards();
    hideMetrics();
}

// hide metrics once a game is complete
const hideMetrics = () => {
    const metricsContainer = document.querySelector('.metrics-container');
    const highScoreButton = document.querySelector('.high-score-button');

    highScoreButton.style.display = "none";
    metricsContainer.style.display = "none";

    viewHighScores();
}

//restore GameStats to default
const restoreGameStatsToDefault = () => {
    GameStats.selectedCards = [];
    GameStats.selectedCardsIndex = [];
    GameStats.removedCards = [];
    GameStats.numberOfTurns = 0;
    GameStats.cardsRemaining = 16;
    GameStats.highScores = [];
}

//clear highScores Table
const clearHighScoresTable = () => {
    const highScoreTable = document.querySelector('.high-score-table');
    while(highScoreTable.hasChildNodes()) {
        highScoreTable.removeChild(highScoreTable.firstChild);
    }
}

// sort by least amount of turns used
const sortByLeastTurns = () => {
    let leastTurns = Infinity;
    const obj = {}
    for(let i=0; i<localStorage.length; i++) {
        let name = window.localStorage.key(i);
        let score = window.localStorage.getItem(localStorage.key(i));
        
        obj[name] = score;
    }
    const sortable = [];
    for(key in obj) {
        if(obj[key] < leastTurns) {
            sortable.push([key, obj[key]]);
        }
    }
    const result = sortable.sort(function(a, b) {
        return a[1] - b[1];
    });
    return result;
}

// randomLensFlare
const randomLensFlare = (time) => {
    const lensFlare = document.createElement('div');
    lensFlare.classList.add('lens-flare')
    const wrapper = document.querySelector('.wrapper');

    lensFlare.style.right = Math.random() * (90 - 10) + 10 + "%";
    lensFlare.style.bottom = Math.random() * (90 - 70) + 70 + "%";
    
    wrapper.appendChild(lensFlare);

    setInterval(()=>{
        let randomRight = Math.random() * (90 - 10) + 10;
        let randomBottom = Math.random() * (90 - 70) + 70;

        let bottomVal = randomBottom + "%";
        let rightVal = randomRight + "%";

        lensFlare.style.right = rightVal;
        lensFlare.style.bottom = bottomVal;

    }, time);
}

// restart a new game instantly
const instantRestart = () => {
    const metrics = document.querySelector('metrics');
    restoreGameStatsToDefault();
    removeOldCards();
    populateBoard();

    metrics.appendChild(refreshButtonContainer);
    metrics.appendChild(homeButtonContainer);
}

// return to main menu inside the game
const returnToMainMenuFromGame = () => {
    const metricsContainer = document.querySelector('.metrics-container');
    const highScoreButton = document.querySelector('.high-score-button');
    const refreshButtonContainer = document.querySelector('.refresh-button-container');
    const homeButtonContainer = document.querySelector('.home-button-container');

    highScoreButton.style.display = "none";
    metricsContainer.style.display = "none";

    refreshButtonContainer.style.display = "none";
    homeButtonContainer.style.display = "none";

    restoreGameStatsToDefault();
    removeOldCards();
    viewMainMenu();

}

randomLensFlare(200);
randomLensFlare(300);
randomLensFlare(300);
randomLensFlare(300);
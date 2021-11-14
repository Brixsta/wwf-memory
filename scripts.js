const startButton = document.querySelector('.start-game-button');
const mainMenuButton = document.querySelector('.main-menu-button');
const highScoreButton = document.querySelector('.high-score-button');
const metrics = document.querySelector('.metrics');
const container = document.querySelector('.container');
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

// view highscores
highScoreButton.addEventListener('click',()=>{
    viewHighScores();
});

// go back to main menu
mainMenuButton.addEventListener('click',()=>{
    const highScoreTableContainer = document.querySelector('.high-score-table-container');
    mainMenuButton.style.display = "none";
    highScoreTableContainer.style.display = "none";

    restoreMainMenu();
})

// start button initiates the game
startButton.addEventListener('click', ()=>{
    const highScoreTable = document.querySelector('.high-score-table');
    highScoreTable.style.display = "none";
    highScoreTable.style.backgroundColor = "red"
    theme.play();
    // document.getElementBy.style.backgroundImage = `url('./images/${evt.target.textContent}.png')`;
    startButton.style.display = "none";
    container.style.display = "block";
    metrics.style.display = "flex";
    turnCounter.disabled = true;
    cardsRemainingCounter.disabled = true;
    turnCounter.value = GameStats.numberOfTurns;
    cardsRemainingCounter.value = GameStats.cardsRemaining;

    const cardData = createCardData();
    const shuffledCards = shuffleCardData(cardData);

    attachCardsToBoard(shuffledCards);
});

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
            removeCards(GameStats.selectedCardsIndex)
            GameStats.selectedCards = [];
            GameStats.selectedCardsIndex= [];
        },1000);

        setTimeout(()=>{
            enableAllCards();
        },1000)

    } else if (GameStats.selectedCards.length === 2) {
        restoreCardBackgroundImg();
        GameStats.numberOfTurns++;
        turnCounter.value = GameStats.numberOfTurns.toString();
        disableAllCards();
        

        setTimeout(()=>{
            
            restoreCards(GameStats.selectedCardsIndex)
            GameStats.selectedCards = [];
            GameStats.selectedCardsIndex= [];
        },1000)
        
        setTimeout(()=>{
            enableAllCards();
        },1000)
    }
}

//remove cards that match
const removeCards = (arr) => {
    const cards = document.getElementsByClassName('card');
    const indexOne = arr[0];
    const indexTwo = arr[1];

    cards[indexOne].classList.remove('active');
    cards[indexTwo].classList.remove('active');

    cards[indexOne].style.opacity = 0;
    cards[indexTwo].style.opacity = 0;

    cards[indexOne].disabled = true;
    cards[indexTwo].disabled = true;
}

// restore cards to the default card class and remove active
const restoreCards = (arr) => {
    const cards = document.getElementsByClassName('card');
    const indexOne = arr[0];
    const indexTwo = arr[1];

    cards[indexOne].classList.remove('active');
    cards[indexTwo].classList.remove('active');
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

// restore the background img of a card after check
const restoreCardBackgroundImg = () => {
    const cards = Array.from(document.getElementsByClassName('card'));
    setTimeout(()=>{
        cards[GameStats.selectedCardsIndex[0]].style.backgroundImage = `url('./images/card.png')`;
        cards[GameStats.selectedCardsIndex[1]].style.backgroundImage = `url('./images/card.png')`;
    },1000)
}

// play random audio clip
const playRandomAudioClip = () => {
    let randomNum = Math.floor(Math.random() * 13);
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
    const appTitle = document.querySelector('.app-title');
    const highScoreTableContainer = document.querySelector('.high-score-table-container');
    hideMainMenu();
    highScoreTableContainer.style.display = "block";  

    grabHighScores();
 }

 // grab scores from local storage
const grabHighScores = ()=> {

    for(let i=0; i<localStorage.length; i++) {
        let name = window.localStorage.key(i);
        let score = window.localStorage.getItem(localStorage.key(i));
        GameStats.highScores.push({name: name, score: Number(score)});
    }
    appendScoresToTable();
}

//append scores to table
const highScoreTable = document.querySelector('.high-score-table');
const appendScoresToTable = () => {
    for(let el in GameStats.highScores) {
        let name = GameStats.highScores[el].name;
        let score = GameStats.highScores[el].score;
        console.log(name,score)

        let newRow = document.createElement('tr');

        let rankCell = document.createElement('td');
        rankCell.classList.add('table-cell-rank');
        rankCell.textContent = Number(el) + 1;

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
}

// sort scores by least 
const sortByLeastTurns = () => {
    
}

// hide main menu 
const hideMainMenu = ()=> {
    const appTitle = document.querySelector('.app-title');
    const startButton = document.querySelector('.start-game-button');
    const highScoreButton = document.querySelector('.high-score-button');

    appTitle.style.display = "none";
    startButton.style.display = "none";
    highScoreButton.style.display = "none";
}

// restore main menu
const restoreMainMenu = () => {
    const appTitle = document.querySelector('.app-title');
    const startButton = document.querySelector('.start-game-button');
    const highScoreButton = document.querySelector('.high-score-button');

    appTitle.style.display = "flex";
    startButton.style.display = "flex";
    highScoreButton.style.display = "flex";
}
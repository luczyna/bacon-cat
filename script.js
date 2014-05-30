/* B A C O N    C A T
 * eats bacon, catnip, and brocolli (bc it's actually good)
 * eats poop and coal, too, but does not feel good about it afterward
 * 
 *
 * bacon cat -- a haiku
 *      eat bacon, catip
 *      and delicious brocolli
 *      poop and coal tastes bad
 */


/* these variables
 * store all the information
 * and references
 */
var timer,
    spawn,
    items = [];
/* TODO
 * let us rewrite this
 * in a bit in order to
 * control item spawns
 */
var itemOptions = [
    'bacon', 'bacon', 'bacon',
    'catnip',
    'brocolli', 'brocolli',
    'coal', 'coal', 'coal', 'coal',
    'poop', 'poop', 'poop', 'poop'
];
// these are multipliers for increasing spawn counts?
// var itemOptions = {
//     bacon: 2.0,
//     brocolli: 3.0,
//     catnip: 1.5,
//     coal: 2.0;
//     poop: 3.0;
// };

var boday = document.getElementsByTagName('body')[0];
var cat   = document.getElementById('cat');
var open  = document.getElementsByClassName('opening-view')[0];
var game  = document.getElementsByClassName('playing-view')[0];









/* functions listed here
 * will initiate the game
 * and finish it, too
 */

function init() {
    //assign height to wrapper
    document.getElementsByClassName('wrapper')[0].style.height = window.innerHeight + 'px';

    //see if there is a stored high score
    if (window.localStorage.getItem('high-baconcat')) {
        document.getElementById('highscore-main').innerText = 'highscore: ' + window.localStorage.getItem('high-baconcat');
        // haha, high bacon cat
    }

    //add a telltale to the body
    boday.classList.add('in-open-view');
    boday.setAttribute('data-rounds-played', 0);

    //get bacon cat ready for moving
    if (cat.classList.contains('init')) {
        cat.classList.remove('init');
        // cat.classList.add('middle');
        // cat.classList.add('normal-pace');
        // too new?
        cat.classList.add('normal-pace', 'middle');
    }
}


function startGame() {
    //add telltale to the body
    boday.classList.remove('in-open-view');
    boday.classList.add('in-game-view');

    //reset our bacon cat
    cat.classList.remove('left', 'right', 'slow-pace', 'fast-pace');
    cat.classList.add('middle', 'normal-pace');
    cat.style.left = '41.66%'

    //hide the opening view, and show the game view
    hideView(open, setGameUp);
    boday.classList.remove('in-open-view');
    boday.classList.add('in-game-view');

}

function setGameUp() {
    //add time to the game view
    //this can be dependant on 
    //the amount of rounds played at a current run
    //add 5 seconds to each new game (30, 35, 40, ...)
    var rounds = parseInt(boday.getAttribute('data-rounds-played'), 10);
    document.getElementById('timer').innerText = (rounds * 5) + 30;

    //set the score in the game view
    document.getElementById('score').innerText = 0;

    //show the game view
    game.style.display = 'block';

    //give the lanes height
    var lanes = document.getElementsByClassName('lane');
    for (var i = 0; i < lanes.length; i++) {
        lanes[i].style.height = document.getElementsByClassName('space')[0].offsetHeight + 'px';
    }

    //start doing things with baconcat, after a 2 second delay
    window.setTimeout(gameWonders, 2000);
}

function gameWonders() {
    //start the timer
    timer = window.setInterval(gameTimer, 1000);

    //spawn a new item
    spawn = window.setInterval(itemSpawn, 500);
}

function endGame() {
    console.log('the game is over');

    //stop the intervals that run the game
    window.clearInterval(timer);
    window.clearInterval(spawn);

    //remove all items that might still be left
    var stragglers = document.getElementsByClassName('item');
    for (var i = 0; i < stragglers.length; i++) {
        stragglers[i].style.display = 'none';
        stragglers[i].parentNode.removeChild(stragglers[i]);
    }
    console.log('the items should be gone');

    //update the body to count the rounds played
    var rounds = parseInt(boday.getAttribute('data-rounds-played'), 10);
    boday.getAttribute('data-rounds-played', rounds++);

    //display the score of the game
    var score = parseInt(document.getElementById('score').innerText, 10);
    var message = endGameMessage(score);
    document.getElementById('endmessage').innerText = message;

    //update the highscore
    var mainHighscore = document.getElementById('highscore-main');
    if (window.localStorage.getItem('high-baconcat')) {
        // there is information stored in this browser
        var storedScore = parseInt(window.localStorage.getItem('high-baconcat'), 10);
        //check if we need to update the info
        if (storedScore < score) {
            //we've done better this time. Update!
            window.localStorage.setItem('high-baconcat', score);
            mainHighscore.innerText = 'highscore: ' + score;
        }
    } else {
        //there is nothing here, so create it
        mainHighscore.innerText = 'highscore: ' + score;
        window.localStorage.setItem('high-baconcat', score);
    }

    //show our footer with the end game messages
    var gameFooter = game.children[4];
    showView(gameFooter, delayedTransition);

    
}

function delayedTransition() {
    //a 3 hour tour (really only 2 seconds)
    window.setTimeout(function() {
        //this takes you from the end of the game back to the open screen
        game.children[4].addEventListener('click', gameTransition, false);
    }, 2000);
}


function gameTransition() {
    //allow someone to click through this
    var gameFooter = game.children[4];
    gameFooter.style.display = 'none';
    gameFooter.removeEventListener('click', gameTransition);
    game.style.display = 'none';
    open.style.display = 'block';
    boday.classList.remove('in-game-view');
    boday.classList.add('in-open-view');
}









/* these are the working
 * and auxillary functions
 * that make the game run
 */

function gameTimer() {
    var time = document.getElementById('timer');
    var amount = parseInt(time.innerText, 10);

    //check if we have time left
    if (amount === 0) {
        //the game is over
        window.clearInterval(timer);
        window.clearInterval(spawn);
        endGame();
    } else {
        //the game is still going, reduce the timer
        time.innerText = amount - 1;
    }
}

function itemSpawn() {
    var random_int = Math.floor(Math.random() * 100);

    //will we spawn an item?
    if (random_int % 2) {
        //not this time
        return;
    } else {
        itemCreation();
    }
}

function itemCreation() {
    //choose a random item to create
    var i = items.length;
    var random_int = Math.floor(Math.random() * itemOptions.length);
    items[i] = itemOptions[random_int];

    //apply a speed to the item
    //we generate a number (x, y, z)
    //and turn it into a second (time) attribute
    //so you can either get 1500 (1.5s), 3000 (3s), or 4500 (4.5s)
    var speed;
    var speedTime = (Math.floor(Math.random() * 3) + 1) * 1500;
    if (speedTime === 4500) {
        speed = 'fast-item';
    } else if (speedTime === 3000) {
        speed = 'normal-item';
    } else {
        speed = 'slow-item';
    }

    //create the DOM element for the item
    var div = document.createElement('div');
    div.id = 'item-' + i;
    div.classList.add('item', items[i], speed);
    div.setAttribute('data-item', items[i]);

    //add the item to a random lane (out of 3)
    var random_el = Math.floor(Math.random() * 3);
    var lane = document.getElementsByClassName('lane')[random_el];
    lane.appendChild(div);

    //now shoot that item through time and space
    //or just down towards the bacon cat
    window.setTimeout(function() {
        div.style.bottom = 0;
    }, 100);
    div.addEventListener('transitionend', collectingBacon, true);
}

function collectingBacon() {
    //where was bacon cat?
    var position;
    if (cat.classList.contains('left')) {
        position = 0;
    } else if (cat.classList.contains('middle')) {
        position = 1;
    } else {
        position = 2;
    }

    //did bacon cat intercept this item?
    var lane = parseInt(this.parentNode.id.replace('lane-', ''), 10) - 1;

    if (position !== lane) {
        console.log('missed it');
    } else {
        //bacon cat got this item... but was it worth it?
        console.log('you got it');

        var identity = this.getAttribute('data-item');
        catEats(identity);
    }

    // now remove the item from the DOM and space and time and existence
    removeBacon(this); 
}

function catEats(item) {
    var score = document.getElementById('score');
    var currentSpeed;
    if (cat.classList.contains('fast-pace')) {
        currentSpeed = 'fast-pace';
    } else if (cat.classList.contains('normal-pace')) {
        currentSpeed = 'normal-pace';
    } else {
        currentSpeed = 'slow-pace';
    }

    //first lets change the speed of the cat
    var updateSpeed = checkSpeed(currentSpeed, item);
    if (updateSpeed) {
        cat.classList.remove(currentSpeed);
        cat.classList.add(updateSpeed);
    }

    //now let's update the score
    var scoreData = {
        'bacon': 100,
        'brocolli': 1,
        'catnip': 1000,
        'coal': -1,
        'poop': null
    };
    if (item === 'poop') {
        //tough nuts, don't eat poop
        score.innerText = 0;
    } else {
        score.innerText = parseInt(score.innerText, 10) + scoreData[item];
    }

    //show a quip about your collection after the score update
    scoreMessage(item); 
}

function jumpingBacon() {
    //bacon cat can only jump one platform at a time

    //where is bacon cat now?
    var current = checkCat();
    //where does bacon cat want to go?
    var platform = checkPlatform(this.id);

    //was the same platform clicked?
    if (current === platform) {
        //b, please
        return;
    }

    //what direction do we need to go
    //how far is bacon cat from the destination?
    var direction;
    var distance;
    if (current <  platform) {
        direction = 'right';
        distance = platform - current;
    } else {
        direction = 'left';
        distance = current - platform;
    }

    //lets move that bacon cat
    if (distance === 1) {
        if ( direction == 'left' ) {
            switch (current) {
                case 1:
                    cat.style.left = '8%';
                    catUpdate('middle', 'left');
                    break;
                case 2:
                    cat.style.left = '41.66%';
                    catUpdate('right', 'middle');
                    break;
            }
        } else if ( direction == 'right' ) {
            switch (current) {
                case 0:
                    cat.style.left = '41.66%';
                    catUpdate('left', 'middle');
                    break;
                case 1:
                    cat.style.left = '74.66%';
                    catUpdate('middle', 'right');
                    break;
            }
        }
    } else {
        // distance === 2
        if ( direction == 'left' ) {
            catUpdate('right', 'middle');
            cat.style.left = '41.66%';
            window.setTimeout(function() {
                catUpdate('middle', 'left');
                cat.style.left = '8%';
            }, 600);
        } else {
            catUpdate('left', 'middle');
            cat.style.left = '41.66%';
            window.setTimeout(function() {
                catUpdate('middle', 'right');
                cat.style.left = '74.66%';
            }, 600);
        }
    }
}









/* these will perform the
 * most mundane but important
 * of tasks for the game
 */

function hideView(whichView, callback) {
    //hide the view we want done hidden
    whichView.style.display = 'none';

    //then perform this function when you are done
    if (typeof callback === 'function') {
        callback();
    }
}

function showView(whichView, callback) {
    //hide the view we want done hidden
    whichView.style.display = 'block';

    //then perform this function when you are done
    if (typeof callback === 'function') {
        callback();
    }
}

function showHow() {
    boday.classList.add('howto-engaged');

    var howto = document.getElementById('howto-content');
    howto.style.display = 'block';

    howto.addEventListener('click', hideHow, false);
}

function hideHow() {
    boday.classList.remove('howto-engaged');

    var howto = document.getElementById('howto-content');
    howto.style.display = 'none';

    howto.removeEventListener('click', hideHow);
}

function removeBacon(item) {
    item.removeEventListener('transitionEnd', collectingBacon);
    item.parentNode.removeChild(item);
    console.log('now the item should be removed');
}

function checkSpeed(current, item) {
    if (current === 'fast-pace' && item !== 'catnip') {
        if (item === 'poop') {
            return 'slow-pace';
        } else {
            return 'normal-pace';
        }
    } else if (current === 'normal-pace' && item === 'catnip') {
        return 'fast-pace';
    } else if (current === 'normal-pace' && item === 'poop') {
        return 'slow-pace';
    } else if (current === 'slow-pace' && item === 'catnip') {
        return 'fast-pace';
    } else if (current == 'slow-pace' && item === 'bacon') {
        return 'normal-pace';
    } else {
        //no need to update speed
        return false;
    }
}

function checkCat() {
    //returns the current position of the bacon cat
    if (cat.classList.contains('left')) {
        return 0;
    } else if (cat.classList.contains('middle')) {
        return 1;
    } else {
        return 2;
    }
}

function checkPlatform(position) {
    switch (position) {
        case 'left':
            return 0;
            break;
        case 'middle':
            return 1;
            break;
        case 'right':
            return 2;
            break;
        default:
            //defaulting to the middle platform
            return 1;
            break;
    }
}

function catUpdate(removeThis, addThat) {
    cat.classList.remove(removeThis);
    cat.classList.add(addThat);
}

function scoreMessage(item) {
    var message = {
        'bacon': 'mmhmmmm',
        'brocolli': 'how delightful',
        'catnip': 'aww yisss',
        'coal': '*hack*',
        'poop': 'what\'s wrong with you?'
    };

    console.log(message[item]);
}

function endGameMessage(score) {
    if (score > 1000) {
        return 'bacon cat is pleased.';
    } else if (score > 100 && score <= 1000) {
        return 'bacon cat wants more bacon. AGAIN!';
    } else {
        return 'do you even think this cat should be eating bacon? IT SHOULD BE. GET TO WORK.';
    }
}

function checkKey(e) {
    if (e.keyCode == 32 && boday.classList.contains('in-open-view')) {
        startGame();
    }
}









/* here is now written
 * the freshest bread and butter
 * that the cat will eat
 */

// everytime the page is reloaded, we run this
init();

// the how-to content gets toggled with this
document.getElementById('howto').addEventListener('click', showHow, false);

// create the controls to start the game
document.getElementById('play').addEventListener('click', startGame, false);
window.addEventListener('keyup', checkKey, false);

//create the controls that move bacon cat
document.getElementById('left').addEventListener('click', jumpingBacon, false);
document.getElementById('middle').addEventListener('click', jumpingBacon, false);
document.getElementById('right').addEventListener('click', jumpingBacon, false);



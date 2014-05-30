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
var itemOptions = ['bacon', 'catnip', 'bacon', 'bacon', 'brocolli', 'coal', 'poop', 'coal', 'poop', 'coal', 'poop', 'coal', 'poop'];
// these are multipliers for increasing spawn counts?
// var itemOptions = [
//     bacon: 2.0,
//     brocolli: 3.0,
//     catnip: 1.5,
//     coal: 2.0;
//     poop: 3.0;
// ];

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

    //hide the opening view, and show the game view
    hideView(open, setGameUp);
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

    // animate this item to the bottom
    // $(id).animate({ bottom: 0 }, speed, 'linear', function() {
    //      //now that it is set to the bottom of the lane, 
    //      //check if it is in the same lane as bacon cat
    //      collectingBacon(items[i], random_k);

    //      //now you can destroy this item
    //      $(this).remove();
    // });
}

function collectingBacon() {
    // console.log('ksjhfksdjf: ' + this.parentNode.id + this.id);
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
    console.log(lane);

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
    var updateSpeed;
    if (currentSpeed === 'fast-pace' && item !== 'catnip') {
        if (item === 'poop') {
            updateSpeed = 'slow-pace';
        } else {
            updateSpeed = 'normal-pace'
        }
    } else if (currentSpeed === 'normal-pace' && item === 'catnip') {
        updateSpeed = 'fast-pace';
    } else if (currentSpeed === 'normal-pace' && item === 'poop') {
        updateSpeed = 'slow-pace';
    } else if (currentSpeed === 'slow-pace' && item === 'catnip') {
        updateSpeed = 'fast-pace';
    } else if (currentSpeed == 'slow-pace' && item === 'bacon') {
        updateSpeed = 'normal-pace';
    } else {
        //no need to update speed
        updateSpeed = false;
    }

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
// $(window).keyup(function(e) {
//     //if it was the space bar
//     if ( e.keyCode === 32 && $('body').hasClass('in-open-view') ) {
//         // console.log('space bar pressed');
//         startGame();
//     }
// });








// //this moves our bacon cat
// // @param platform = (int) starting at 0, which platform to go to
// function jumpingBacon(platform) {
//     //bacon cat can only jump one platform at a time

//     //where is bacon cat now?
//     var current;
//     if ( $('#cat').hasClass('left') ) {
//         current = 0;
//     } else if ( $('#cat').hasClass('middle') ) {
//         current = 1;
//     } else if ( $('#cat').hasClass('right') ) {
//         current = 2;
//     }

//     //was the same platform clicked?
//     if (current === platform) {
//         //b, please
//         return;
//     }

//     //what direction do we need to go
//     //how far is bacon cat from the destination?
//     var direction;
//     var distance;
//     if (current <  platform) {
//         direction = 'right';
//         distance = platform - current;
//     } else {
//         direction = 'left';
//         distance = current - platform;
//     }

//     //lets move that bacon cat
//     var cat = $('#cat');
//     if (distance === 1) {
//         if ( direction == 'left' ) {
//             switch (current) {
//                 case 1:
//                     cat.css({left: '8%'});
//                     cat.removeClass('middle').addClass('left');
//                     break;
//                 case 2:
//                     cat.css({left: '41.66%'});
//                     cat.removeClass('right').addClass('middle');
//                     break;
//             }
//         } else if ( direction == 'right' ) {
//             switch (current) {
//                 case 0:
//                     cat.css({left: '41.66%'});
//                     cat.removeClass('left').addClass('middle');
//                     break;
//                 case 1:
//                     cat.css({left: '74.66%'});
//                     cat.removeClass('middle').addClass('right');
//                     break;
//             }
//         }
//     } else {
//         //distance === 2
//         if ( direction == 'left' ) {
//             cat.removeClass('right').addClass('middle').css({left: '41.66%'}).css({left: '8%'}).removeClass('middle').addClass('left');
//         } else {
//             cat.removeClass('left').addClass('middle').css({left: '41.66%'}).css({left: '74.66%'}).removeClass('middle').addClass('right');
//         }
//     }
// }



// //end our game
// function endGame() {

//     console.log('the game is over');

//     //stop the intervals that run the game
//     // window.clearInterval(timer);
//     // window.clearInterval(spawn);

//     //remove all items that might still be left
//     $('.item').fadeOut(100).remove();
//     console.log('the items should be gone');

//     //update the body to count the rounds played
//     var rounds = parseInt($('body').attr('data-rounds-played'), 10);
//     $('body').attr('data-rounds-played', rounds++);

//     //display the score of the game
//     var score = parseInt($('#score').text(), 10);
//     var message;
//     $('#endscore').text(score);
//     if (score > 1000) {
//         message = 'bacon cat is pleased.';
//     } else if (score > 100 && score <= 1000) {
//         message = 'bacon cat wants more bacon. AGAIN!';
//     } else {
//         message = 'do you even think this cat should be eating bacon? IT SHOULD BE. GET TO WORK.';
//     }
//     $('#endmessage').text(message);


//     //update the highscore
//     if (window.localStorage.getItem('high-baconcat')) {
//         //there is information stored in this browser
//         var storedScore = parseInt(window.localStorage.getItem('high-baconcat'), 10);
//         //check if we need to update the info
//         if (storedScore < score) {
//             //we've done better this time. Update!
//             window.localStorage.setItem('high-baconcat', score);
//             $('#highscore-main').text('highscore: ' + score);
//         }
//     } else {
//         //there is nothing here, so create it
//         $('#highscore-main').text('highscore: ' + score);
//         window.localStorage.setItem('high-baconcat', score);
//     }

//     $('.playing-view').find('footer').fadeIn(200, function() {

//         console.log('you are seeing an end of game message');
//         //now wait a bit, and then execute hiding of this and a transition
//         // var footer = $(this);
//         window.setTimeout(gameTransition, 2000);

//     });
// }


// //transition to the next screen
// function gameTransition() {
//     //allow someone to click through this
//     $('.playing-view').find('footer').click(function() {
//         console.log('you clicked the message in the footer to play again');
//         $(this).fadeOut(200, function() {

//             //add telltale to the body
//             $('body').removeClass('in-game-view').addClass('in-open-view');


//             //hide the playing view, and show the opening view
//             $('.playing-view').fadeOut(150, function() {


//                 //now show the game view
//                 $('.opening-view').fadeIn(150, function() {
                    
//                     console.log('back at the opening view');

//                 });
//             });
//         });
//     });
// }










// //create the controls that move bacon cat
// $('#left').click(function() { jumpingBacon(0); });
// $('#middle').click(function() { jumpingBacon(1); });
// $('#right').click(function() { jumpingBacon(2); });



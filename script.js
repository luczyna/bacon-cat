$(document).ready(function() {

    var timer;
    var spawn;
    var items = [];
    var itemOptions = ['bacon', 'catnip', 'bacon', 'bacon', 'brocolli', 'coal', 'poop'];

    function init() {
        //assign height to wrapper
        $('.wrapper').height($(window).height());

        //see if there is a stored high score
        if (window.localStorage.getItem('high-baconcat')) {
            $('#highscore-main').text('highscore: ' + window.localStorage.getItem('high-baconcat'));
        }

        //add a telltale to the body
        $('body').addClass('in-open-view').attr('data-rounds-played', 0);

        //get bacon cat ready for moving
        if ($('#cat').hasClass('init')) {
            $('#cat').removeClass('init').addClass('middle').addClass('normal-pace');
        }

    }




    //show the how to content
    $('#howto').click(function() {
        $('body').addClass('howto-engaged');
        $('#howto-content').fadeIn(200);
    });

    //hide the how to content
    $('#howto-content').on('click', function() {
        $('body').removeClass('howto-engaged');
        $('#howto-content').fadeOut(200);
    });




    function startGame() {
        //add telltale to the body
        $('body').removeClass('in-open-view').addClass('in-game-view');

        //reset our bacon cat
        $('#cat').removeClass('left right slow-pace fast-pace').addClass('middle normal-pace');

        //hide the opening view, and show the game view
        $('.opening-view').fadeOut(150, function() {
            //add time to the game view
            //first find out how many rounds have been played
            var rounds = parseInt($('body').attr('data-rounds-played'), 10);
            $('#timer').text('30');

            //add score to the game view
            $('#score').text(0);

            //now show the game view
            $('.playing-view').fadeIn(150, function() {
                //assign height to lanes
                $('.lane').height($('.space').height());

                console.log('the game should be visible');

                //start doing the things with baconcat, after a bit of a delay
                window.setTimeout(gameWonders, 2000);
            });
        });
    }

    function gameWonders() {
        //start the timer
        timer = window.setInterval(gameTimer, 1000);

        //spawn a new item
        spawn = window.setInterval(itemSpawn, 500);
    }



    //this runs the game timer
    function gameTimer() {
        var amount = parseInt($('#timer').text(), 10);

        //check the amount of time left
        if (amount === 0) {
            //the game is over
            window.clearInterval(timer);
            window.clearInterval(spawn);
            endGame();
        } else {
            //reduce the timer
            $('#timer').text(amount - 1);
            // console.log(amount + ' : this is the amount of time left');
        }
    }



    //this spawns goodies every once in a while
    function itemSpawn() {

        //will we spawn an item this time?
        var random_i = Math.floor(Math.random() * 100);
        if (random_i % 2) {
            // not this time
            return;
        } else {
            //check the item length
            var i = items.length;

            //choose a random option to spawn
            var random_j = Math.floor(Math.random() * itemOptions.length);
            items[i] = itemOptions[random_j];

            //choose a random speed to apply
            var random_el = Math.floor(Math.random() * 3) + 1;
            var speed = random_el * 1500;
            // console.log(speed);

            //add the item to a random lane
            var id = '#item-' + i;
            var add = '<div class="item ' + items[i] + '" id="item-' + i + '"></div>';
            var random_k = Math.floor(Math.random() * 3);
            $('.lane').eq(random_k).append(add);

            // animate this item to the bottom
            $(id).animate({ bottom: 0 }, speed, 'linear', function() {
                //now that it is set to the bottom of the lane, 
                //check if it is in the same lane as bacon cat
                collectingBacon(items[i], random_k);

                //now you can destroy this item
                $(this).remove();
            });

        }
    }



    //check on bacon cat's position relative to an item 
    function collectingBacon(item, lane) {
        //did bacon cat intercept this item?
        var cat = $('#cat');
        var position;
        if ( cat.hasClass('left') ) {
            position = 0;
        } else if ( cat.hasClass('middle') ) {
            position = 1;
        } else if ( cat.hasClass('right') ) {
            position = 2;
        }

        if ( position !== lane ) {
            console.log('missed it!');
        } else {
            var score = parseInt($('#score').text(), 10);
            switch (item) {
                case 'bacon':
                    $('#score').text(score + 100);
                    cat.removeClass('slow-pace');
                    if (!cat.hasClass('fast-pace')) {
                        cat.addClass('normal-pace');
                    }
                    break;
                case 'brocolli':
                    $('#score').text(score + 1);
                    break;
                case 'coal':
                    if (score - 100 <= 0) {
                        $('#score').text(0);
                    } else {
                        $('#score').text(score - 100);
                    }
                    cat.removeClass('normal-pace fast-pace').addClass('slow-pace');
                    break;
                case 'poop':
                    $('#score').text(0);
                    cat.removeClass('normal-pace fast-pace').addClass('slow-pace');
                    break;
                case 'catnip':
                    $('#score').text(score + 1000);
                    cat.removeClass('normal-pace slow-pace').addClass('fast-pace');
                    break;
                default:
                    //no change
                    // $('#score').text(score);
                    break;
            }
        }
    }



    //this moves our bacon cat
    // @param platform = (int) starting at 0, which platform to go to
    function jumpingBacon(platform) {
        //bacon cat can only jump one platform at a time

        //where is bacon cat now?
        var current;
        if ( $('#cat').hasClass('left') ) {
            current = 0;
        } else if ( $('#cat').hasClass('middle') ) {
            current = 1;
        } else if ( $('#cat').hasClass('right') ) {
            current = 2;
        }

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
        var cat = $('#cat');
        if (distance === 1) {
            if ( direction == 'left' ) {
                switch (current) {
                    case 1:
                        cat.css({left: '8%'});
                        cat.removeClass('middle').addClass('left');
                        break;
                    case 2:
                        cat.css({left: '41.66%'});
                        cat.removeClass('right').addClass('middle');
                        break;
                }
            } else if ( direction == 'right' ) {
                switch (current) {
                    case 0:
                        cat.css({left: '41.66%'});
                        cat.removeClass('left').addClass('middle');
                        break;
                    case 1:
                        cat.css({left: '74.66%'});
                        cat.removeClass('middle').addClass('right');
                        break;
                }
            }
        } else {
            //distance === 2
            if ( direction == 'left' ) {
                cat.removeClass('right').addClass('middle').css({left: '41.66%'}).css({left: '8%'}).removeClass('middle').addClass('left');
            } else {
                cat.removeClass('left').addClass('middle').css({left: '41.66%'}).css({left: '74.66%'}).removeClass('middle').addClass('right');
            }
        }
    }



    //end our game
    function endGame() {

        console.log('the game is over');

        //stop the intervals that run the game
        // window.clearInterval(timer);
        // window.clearInterval(spawn);

        //remove all items that might still be left
        $('.item').fadeOut(100).remove();
        console.log('the items should be gone');

        //update the body to count the rounds played
        var rounds = parseInt($('body').attr('data-rounds-played'), 10);
        $('body').attr('data-rounds-played', rounds++);

        //display the score of the game
        var score = parseInt($('#score').text(), 10);
        var message;
        $('#endscore').text(score);
        if (score > 1000) {
            message = 'bacon cat is pleased.';
        } else if (score > 100 && score <= 1000) {
            message = 'bacon cat wants more bacon. AGAIN!';
        } else {
            message = 'do you even think this cat should be eating bacon? IT SHOULD BE. GET TO WORK.';
        }
        $('#endmessage').text(message);


        //update the highscore
        if (window.localStorage.getItem('high-baconcat')) {
            //there is information stored in this browser
            var storedScore = parseInt(window.localStorage.getItem('high-baconcat'), 10);
            //check if we need to update the info
            if (storedScore < score) {
                //we've done better this time. Update!
                window.localStorage.setItem('high-baconcat', score);
                $('#highscore-main').text('highscore: ' + score);
            }
        } else {
            //there is nothing here, so create it
            $('#highscore-main').text('highscore: ' + score);
            window.localStorage.setItem('high-baconcat', score);
        }

        $('.playing-view').find('footer').fadeIn(200, function() {

            console.log('you are seeing an end of game message');
            //now wait a bit, and then execute hiding of this and a transition
            // var footer = $(this);
            window.setTimeout(gameTransition, 2000);

        });
    }


    //transition to the next screen
    function gameTransition() {
        //allow someone to click through this
        $('.playing-view').find('footer').click(function() {
            console.log('you clicked the message in the footer to play again');
            $(this).fadeOut(200, function() {

                //add telltale to the body
                $('body').removeClass('in-game-view').addClass('in-open-view');


                //hide the playing view, and show the opening view
                $('.playing-view').fadeOut(150, function() {


                    //now show the game view
                    $('.opening-view').fadeIn(150, function() {
                        
                        console.log('back at the opening view');

                    });
                });
            });
        });
    }








    //create the controls to start the game
    $('#play').click(startGame);
    $(window).keyup(function(e) {
        //if it was the space bar
        if ( e.keyCode === 32 && $('body').hasClass('in-open-view') ) {
            // console.log('space bar pressed');
            startGame();
        }
    });

    //create the controls that move bacon cat
    $('#left').click(function() { jumpingBacon(0); });
    $('#middle').click(function() { jumpingBacon(1); });
    $('#right').click(function() { jumpingBacon(2); });







    $(window).load(init);

});
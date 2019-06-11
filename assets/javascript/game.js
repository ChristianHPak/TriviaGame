$(document).ready(function () {

    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click', '.option', trivia.guessChecker);

})

var trivia = {
    // trivia properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId: '',
    // questions options and answers data
    questions: {
        q1: 'In S1E1 "Pilot": Who started their first day at Dunder Mifflin Scranton?',
        q2: "In S1E2 'Diversity Day': What famous comedian's stand up routine does Michael imitate?",
        q3: "In S2E4 'The Fire': What are Meredith's five DVD choices for the game 'Desert Island'?",
        q4: "In S2E6 'The Fight': What is Dwight's Sensei's name?",
        q5: "In S2E12 'The Injury': What is Michael's injury?",
        q6: 'In S3E18 "The Negotiation": What gift does Jim try to give Dwight after Dwight saves him from being attacked by Roy, but Dwight refuses to accept?',
        q7: "In S6E1 'Gossip' Someone is rumored to be, and wonders if they might actually be, gay.  Who was it?"
    },
    options: {
        q1: ['Jim Halpert', 'Ryan Howard', 'Erin Hannon', 'Michael Scott'],
        q2: ['Chris Rock', 'Robin Williams', 'Richard Pryor', 'George Carlin'],
        q3: ["The Shawshank Redemption, 40 Year Old Virgin, Gentlemen Prefer Blondes, Disney's Sleeping Beauty, Life of Pi", 'Gone With The Wind, The Burbs, Clerks II, Sense & Sensibility, Chronicles of Riddick', 'Legends of the Fall, Legally Blonde, Bridges of Madison County, My Big Fat Greek Wedding, Ghost (but just that one scene)', 'Fargo, Edward Scissor-hands, The Breakfast Club, Dazed and Confused, The Princess Bride'],
        q4: ['George', 'Ira', 'Stuart', 'Mr. Miyagi'],
        q5: ['He gets his head stuck in a stair railing', 'He crashes his car into a telephone pole', 'He falls into a koi pond', 'He burns his foot on a George Foreman Grill'],
        q6: ['Bobblehead', 'Champagne', 'Glass display case for his bobblehead', 'Pepper Spray'],
        q7: ['Andy', 'Kevin', 'Creed', 'Dwight']
    },
    answers: {
        q1: 'Ryan Howard',
        q2: 'Chris Rock',
        q3: "Legends of the Fall, Legally Blonde, Bridges of Madison County, My Big Fat Greek Wedding, Ghost (but just that one scene)",
        q4: 'Ira',
        q5: 'He burns his foot on a George Foreman Grill',
        q6: 'Glass display case for his bobblehead',
        q7: 'Andy'
    },
    // trivia methods
    // method to initialize game
    startGame: function () {
        // restarting game results
        trivia.currentSet = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0;
        clearInterval(trivia.timerId);

        // show game section
        $('#game').show();

        //  empty last results
        $('#results').html('');

        // show timer
        $('#timer').text(trivia.timer);

        // remove start button
        $('#start').hide();

        $('#remaining-time').show();

        // ask first question
        trivia.nextQuestion();

    },
    // method to loop through and display questions and options 
    nextQuestion: function () {

        // set timer to 20 seconds each question
        trivia.timer = 10;
        $('#timer').removeClass('last-seconds');
        $('#timer').text(trivia.timer);

        // to prevent timer speed up
        if (!trivia.timerOn) {
            trivia.timerId = setInterval(trivia.timerRunning, 1000);
        }

        // gets all the questions then indexes the current questions
        var questionContent = Object.values(trivia.questions)[trivia.currentSet];
        $('#question').text(questionContent);

        // an array of all the user options for the current question
        var questionOptions = Object.values(trivia.options)[trivia.currentSet];

        // creates all the trivia guess options in the html
        $.each(questionOptions, function (index, key) {
            $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
        })

    },
    // method to decrement counter and count unanswered if timer runs out
    timerRunning: function () {
        // if timer still has time left and there are still questions left to ask
        if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
            $('#timer').text(trivia.timer);
            trivia.timer--;
            if (trivia.timer === 4) {
                $('#timer').addClass('last-seconds');
            }
        }
        // the time has run out and increment unanswered, run result
        else if (trivia.timer === -1) {
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Out of time! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
        }
        // if all the questions have been shown end the game, show results
        else if (trivia.currentSet === Object.keys(trivia.questions).length) {

            // adds results of game (correct, incorrect, unanswered) to the page
            $('#results')
                .html('<h3>Thank you for playing!</h3>' +
                    '<p>Correct: ' + trivia.correct + '</p>' +
                    '<p>Incorrect: ' + trivia.incorrect + '</p>' +
                    '<p>Unaswered: ' + trivia.unanswered + '</p>' +
                    '<p>Please play again!</p>');

            // hide game sction
            $('#game').hide();

            // show start button to begin a new game
            $('#start').show();
        }

    },
    // method to evaluate the option clicked
    guessChecker: function () {
        // the answer to the current question being asked
        var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

        // if the text of the option picked matches the answer of the current question, increment correct
        if ($(this).text() === currentAnswer) {
            // turn button green for correct
            $(this).addClass('btn-success').removeClass('btn-info');

            trivia.correct++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Correct Answer!</h3>');
        }
        // else the user picked the wrong option, increment incorrect
        else {
            // turn button clicked red for incorrect
            $(this).addClass('btn-danger').removeClass('btn-info');

            trivia.incorrect++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Better luck next time! ' + currentAnswer + '</h3>');
        }

    },
    // method to remove previous question results and options
    guessResult: function () {

        // increment to next question set
        trivia.currentSet++;

        // remove the options and results
        $('.option').remove();
        $('#results h3').remove();

        // begin next question
        trivia.nextQuestion();

    }

}
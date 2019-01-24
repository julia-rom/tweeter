/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.

//Prevents cross-site scripting
function escape(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

$(document).ready(function () {

    //Displays all tweets 
    function renderTweets(tweets) {
        // loops through tweets
        for (let tweet = 0; tweet < tweets.length; tweet++) {
            // calls createTweetElement for each tweet
            // takes return value and appends it to the tweets container
            $('.container .posted-tweets').prepend(createTweetElement(tweets[tweet]))
        }
    }

    //Creates individual tweet container (name, avatar, tweet, username) after tweet is submitted
    function createTweetElement(tweet) {
        var tweetDate = new Date(tweet.created_at);
        var $tweetPassed = `
    <article class="posted-tweet">
        <header>
            <img src=${tweet.user.avatars.small} alt="Tula">
            <h2>${tweet.user.name}</h2>
            <span>${tweet.user.handle}</span>
        </header >
            <div class="tweet-space">
                <p>${escape(tweet.content.text)}</p>
            </div>
            <footer>
                ${tweetDate.toDateString()}
            </footer >
    </article >`
        return $tweetPassed;
    }


    // Ajax post request to submit tweet

    $('.new-tweet form').on('submit', function (event) {
        var counter = +$(this).children('.counter')['0'].textContent
        event.preventDefault()
        if (counter === 140) {
            $('.container .new-tweet .error-msg').text("You didn't type anything!");
        }
        else if (counter < 0) {

            $('.container .new-tweet .error-msg').text("Your tweet is over the 140 characters!");
        }
        else {
            $('.container .new-tweet .error-msg').text("");

            $.ajax({
                method: "POST",
                url: "/tweets",
                data: $(this).serialize()
            })
                .done(function () {
                    loadTweets()
                })
        }
    });




    //fetches new tweets from tweets page
    function loadTweets() {
        $.ajax({
            method: "GET",
            url: "/tweets",
            dataType: "json"
        })
            .done(function (tweetData) {
                renderTweets(tweetData);
            })
    }


    //toggles new-tweet container when you click compose button
    $('#nav-bar button').on('click', function () {
        $('.container .new-tweet').slideToggle(200);
        $('.container .new-tweet form textarea').focus();
    });
});


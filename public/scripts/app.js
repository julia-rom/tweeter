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

    //fetches new tweets from tweets page
    function loadTweets() {
        $('.posted-tweets').empty();
        $.ajax({
            method: "GET",
            url: "/tweets",
            dataType: "json"
        })
            .done(function (tweetData) {
                renderTweets(tweetData);
            })
    }

    loadTweets();

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
                ${moment(tweet.created_at).fromNow()}
                <span class="icons">
                <img src="/images/flag.png">
                <img src="/images/retweet.png">
                <img src="/images/like.png">
                </span>
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
            //once a form is submitted loadedTweets only prepends the most recent post
            firstLoad = false;
            $.ajax({
                method: "POST",
                url: "/tweets",
                data: $(this).serialize()
            })
                .done(function () {
                    loadTweets()
                    $('.new-tweet form textarea').val('');
                })
        }
    });

    //hides compose tweet section on page load 
    $('.new-tweet').hide();

    //toggles new-tweet container when you click compose button
    $('#nav-bar button').on('click', function () {
        $('.container .new-tweet').slideToggle(200);
        $('.container .new-tweet form textarea').focus();
    });
});


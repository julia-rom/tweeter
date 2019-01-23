/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.
$(document).ready(function () {

    //Displays all tweets 
    function renderTweets(tweets) {
        // loops through tweets
        for (let tweet = 0; tweet < tweets.length; tweet++) {
            // calls createTweetElement for each tweet
            // takes return value and appends it to the tweets container
            $('.container').append(createTweetElement(tweets[tweet]))
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
                <p>${tweet.content.text}</p>
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
            return alert("You didn't type anything in!");
        }
        else if (counter < 0) {
            return alert("Your tweet is too long!");
        }
        else {

            $.ajax({
                method: "POST",
                url: "/tweets",
                data: $(this).serialize()
            })
                .done(function () {
                    console.log("post sent!")
                })
        }
    });




    //fetches new tweets from tweets page
    function loadTweets() {
        $('.new-tweet form').on('submit', function (event) {
            event.preventDefault()
            $.ajax({
                method: "GET",
                url: "/tweets",
                dataType: "json"
            })
                .done(function (tweetData) {
                    renderTweets(tweetData);
                })
        });
    }
    loadTweets();
});


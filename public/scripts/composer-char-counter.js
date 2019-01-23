//Waits till DOM is loaded

$(document).ready(function () {
    $(".new-tweet form textarea").on('keyup', function getChar(event) {
        const lengthCount = $(this).val().length
        const charLeft = 140 - lengthCount
        $(this).siblings('.counter').text(charLeft);
        if (charLeft < 0) {
            $(this).siblings('.counter').addClass("overCount");
        }
    });
});
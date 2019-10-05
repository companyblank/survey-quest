// spawn worker - for anonPrint
myWorker = new Worker('js/worker.min.js');

var m_anonPrint;

myWorker.onmessage = function(e) {
    m_anonPrint = e.data;
};

jQuery(document).ready(function($) {

    var m_userAnonData;

    $('.survey.start').on('click', "button.start", function () {

        var l_continue = true;

        // remove previous errors
        $('div.survey').find('.display-error').removeClass('display-error');

        var l_regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var l_userEmail = $("div.email-cont input.email").val();
        var l_secondaryRegex = /^([a-zA-Z0-9_.+-])+\@(((gmail)|(live)|(hotmail)|(outlook)|(yahoo)|(icloud)|(mail)|(inbox)|(zoho)|(gmx)|(aol)|(yandex)|(msn))+\.)+([a-zA-Z0-9]{2,4})+(.[a-zA-Z0-9]{2,4})?$/;

        // option not selected
        if ($("div.gamer-type input:checked").length == 0) {

            // display option error
            $('div.gamer-type').addClass('display-error');
            scrollToTop($("div.gamer-type"));
            l_continue = false;
        }

        // invalid email / empty email
        if (l_regex.test(l_userEmail) == false) {

            // display email error
            $('div.email-cont').addClass('display-error');
            scrollToTop($("div.email-cont"));
            l_continue = false;
        }

        // unusual email
        else if(l_secondaryRegex.test(l_userEmail) == false) {

            // give user option to change email at survey end
            $('.survey-end .change-email').removeClass('hidden');
            $('.survey-end .change-email input').val(l_userEmail);
        }

        if (l_continue == true) {

            // store user anon info
            var l_captacha = $('.survey-start .captcha-cont input').is(":checked") == true ? "IGN__" : "";

            var l_ageGroup = $('.survey-start .age-group input:checked').val();
            l_ageGroup = l_ageGroup == undefined ? "" : "__AGEGROUP:" + l_ageGroup;

            var l_sexType = $('.survey-start .sex-type input:checked').val();
            l_sexType = l_sexType == undefined ? "" : "__SEX:" + l_sexType;

            var l_referType = $('.survey-start .refer-type input:checked').val();
            l_referType = l_sexType == undefined ? "" : "__REFERBY:" + l_referType;

            var l_userGamerType =  $('.survey-start .gamer-type input:checked').val();

            m_userAnonData = l_captacha + "EMAIL:" + l_userEmail + "__GAMTYPE:"+l_userGamerType + l_referType + l_sexType + l_ageGroup;

            // verify cookie
            genCookieForVerf();

            // clear the checked options
            $('div.survey input:checked').prop('checked', false);

            RandomlyDisplayOptions();

            displaySurveyProgress(33, $('.survey-start'), $(".random-set"), "start", "random");
        }

        l_continue = true;

    });

    $('.survey-start span.background-toggle').on('click', function(){

        if($('.our-background').hasClass('hidden')) {
            $('.our-background').removeClass('hidden');
        }

        else {
            $('.our-background').addClass('hidden');
        }

    });

    var m_randOptions = [
        "Foolish Reality",
        "Fan Made",
        "Game Over",
        "Post Game",
        "Boss Stage",
        "Nearly Finished",
        "Fano Madeo",
        "Portal Oasis",
        "Sinister",
        "Talent Achieved",
        "Mask Select Games",
        "Extra Life",
        "Modest x Monkey",
        "Easy Mode",
        "Neverland",
        "Gladius",
        "Bonfire",
        "Moon Rising",
        "Variance",
        "Priority Games",
        "Game Company X",
        "Festival Corp.",
        "Lost Haven",
        "Hollow Void",
        "Sindulgence",
        "Living Machines",
        "Jester Gesture",
        "Man'*S*laughter",
        "In Ten Siv",
        "Genki Games",
        "Attack the Panic",
        "New Age",
        "Aftermath",
        "3 X Wish",
        "Broken Wonderland",
        "Zero Sum Infinity",
        "Oasis Knight",
        "Solace Bliss",
        "Turn Based",
        "Proteus"
    ];

    var m_chosenOptions = [];

    function getCookie() {
        var name = "bla_surv=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function genCookieForVerf() {

        // if cookie doesn't exist
        if (getCookie() == "") {

            var d = new Date();
            d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = "bla_surv=" + m_anonPrint + "__" + Math.floor((Math.random() * 100000000000000) + 1);
            +";" + expires + ";path=/";
        }
    }

    function RandomlyDisplayOptions() {

        $("div.random-set div.option").fadeOut(400);

        setTimeout(function() {
            // each time option is selected - store the selected option
            for (var l_iterator = 1; l_iterator < 6; l_iterator++) {


                var l_randomOptionIndex = Math.floor(Math.random() * m_randOptions.length);

                // with list of options - randomly display 3 each time function is called
                var l_randomOption = m_randOptions[l_randomOptionIndex];

                // remove the selected option - so as not to display again
                m_randOptions.splice(l_randomOptionIndex, 1);

                // display the random option in the DOM
                $("div.random-set div.option input#option" + l_iterator).attr('value', l_randomOption);
                $("div.random-set div.option label[for='option" + l_iterator + "']").text(l_randomOption);
            }
        }, 325);

        $("div.random-set div.option").fadeIn(400);

    }

    var l_pageCount = 1;

    $('.survey').on('click', 'button.random', function () {

        var l_continue = true;

        // remove previous errors
        $('div.survey').find('.display-error').removeClass('display-error');

        // option not selected
        if ($("div.random-set input:checked").length == 0) {

            // display option error
            $('div.random-set').addClass('display-error');
            scrollToTop();
            l_continue = false;
        }

        else if (l_continue == true) {

            // increment page count, display on DOM
            if(l_pageCount != 8) {
                $(".pagination span:first-child").text(++l_pageCount);
            }

            ProcessRandomOptions();

        }

        l_continue = true;

    });

    var l_surveyProgressTxt = $(".notification.survey-progress .sect-complete h3");

    function ProcessRandomOptions() {

        var l_selectedOption = $('div.survey div.random-set input:checked').attr('value');

        // add to selected option array
        m_chosenOptions.push(l_selectedOption);

        // check whether all options have been displayed
        if (m_randOptions.length == 0) {

            // hide the random options section, and display the chosen set section
            DisplayChosenSet();

            l_surveyProgressTxt.text("Random Names Completed");

            // hide the rand set and display the chosen set section
            displaySurveyProgress(66, $('.random-set'), $(".chosen-set"), 'random', 'chosen');

        }

        // more random options need to be displayed
        else {

            // clear the checked option
            $('div.survey input:checked').prop('checked', false);

            // display random options again
            RandomlyDisplayOptions();

            // scroll to top to display prompt again
            scrollToTop(undefined, true);
        }

        // store submission
        dataLayer.push({
            'event': "option_" + l_selectedOption,
            'event-category': "option_" + l_selectedOption,
            'event-label': m_userAnonData
        });

    }

    function DisplayChosenSet() {

        // each time option is selected - store the selected option
        for (var l_iterator = 0; l_iterator < 8; l_iterator++) {

            var l_randChosenOptionIndex = Math.floor(Math.random() * m_chosenOptions.length);

            // with list of options - randomly display 3 each time function is called
            var l_randomChosenOption = m_chosenOptions[l_randChosenOptionIndex];

            m_chosenOptions.splice(l_randChosenOptionIndex, 1);

            // display the random option in the DOM
            $("div.chosen:eq(" + l_iterator + ") span:not(.reset-choice)").text(l_randomChosenOption);
        }

    }

    // on change of select ranking - disable current selection - undisable other option
    $('.chosen-set .chosen select').on('change', function () {

        // make the first option (rank) disabled on change
        $(this).find('option:eq(0)').prop('disabled', true);
        $(this).removeClass('unaltered');
        $(this).parent().find('.reset-choice').removeClass('hidden');

        var l_selectedOption = $(this).find('option:selected');

        // undisable the previously selected option (not the default rank) - in all select fields
        var l_prevOption = $(this).find('.selectDisable');
        $(".chosen-set select option[data-rank='" + l_prevOption.attr('data-rank') + "']").prop('disabled', false);
        l_prevOption.removeClass('selectDisable');

        // disable current selected option
        l_selectedOption.addClass('selectDisable');
        $(".chosen-set select option[data-rank='" + l_selectedOption.attr('data-rank') + "']").prop('disabled', true);
    });

    // on click on reset choice btn
    $('.chosen-set .chosen .reset-choice').on('click', function() {

        // make the first option (rank) enabled again
        $(this).parent().find('select').addClass('unaltered');
        $(this).parent().find('select option:eq(0)').prop('disabled', false);
        $(this).addClass('hidden');

        var l_selectedOption = $(this).parent().find('option:selected');

        l_selectedOption.removeClass('selectDisable');
        $(".chosen-set select option[data-rank='" + l_selectedOption.attr('data-rank') + "']").prop('disabled', false);
        $(this).parent().find('select option:eq(0)').prop('selected', true);


    });

    // validate chosen ranking before submitting data
    $('.survey').on('click', 'button.chosen', function () {

        var l_continue = true;

        // remove previous errors
        $('div.survey').find('.display-error').removeClass('display-error');

        // select option is set to default
        if ($("div.chosen-set select.unaltered").length != 0) {

            // display option error
            $('div.chosen-set').addClass('display-error');
            l_continue = false;
        }

        // once no errors exist - process submission
        if (l_continue == true) {

            ProcessChosenOptions();

            l_surveyProgressTxt.text("Name Ranking Completed");

            // hide the rand set and display the chosen set section
            displaySurveyProgress(95, $('.chosen-set'), $(".survey-end"),'chosen', 'end');

            // hide this section and proceed to last section
            $('div.survey-end input').prop('checked', true);

        }

        l_continue = true;

    });

    function ProcessChosenOptions() {

        var l_chosenRankSelectors = $("div.chosen-set div.chosen select");

        // store ranking submission
        for (var l_optionIterator = 1; l_optionIterator < 9; l_optionIterator++) {

            // get the current iterated option
            var l_iteratedOption = l_chosenRankSelectors.find("option:eq(" + l_optionIterator + "):selected");
            var l_iteratedLabel = l_iteratedOption.parent().parent().find('span:not(.reset-choice)').text();

            dataLayer.push({
                'event': l_iteratedOption.attr('data-rank') + "_" + l_iteratedLabel,
                'event-category': l_iteratedOption.attr('data-rank') + "_" + l_iteratedLabel,
                'event-label': m_userAnonData
            });
        }
    }

    $('.survey-end .change-email').on('click', function(){

        // display the email input field
        $('.survey-end .change-email input').removeClass('hidden');

    });

    $('.survey').on('click', 'button.end', function () {

        var l_notifyUser = $('.survey-end #notifyMe').val();

        dataLayer.push({
            'event': "notifyUser_" + l_notifyUser,
            'event-category': "notifyUser_" + l_notifyUser,
            'event-label': m_userAnonData
        });

        if(!($('.survey-end .change-email').hasClass('hidden'))) {

            var l_changedEmail = $('.survey-end .change-email input').val();

            dataLayer.push({
                'event': "emailChange_" + l_changedEmail,
                'event-category': "emailChange_" + l_changedEmail,
                'event-label': m_userAnonData
            });
        }

        l_surveyProgressTxt.text("Survey Completed?!?");

        // hide this section and proceed to last section
        displaySurveyProgress(99, $('.survey-end'), $(".optional.section"), 'end', 'optional');

    });

    $('.survey').on('click', 'button.optional', function () {

            var l_optionalInput = $('div.input.optional input').val();

            dataLayer.push({
                'event': "optionalSubmit_" + l_optionalInput,
                'event-category': "optionalSubmit_" + l_optionalInput,
                'event-label': m_userAnonData
            });

            l_surveyProgressTxt.text("Survey Completely Completed!!!");
            l_surveyProgressTxt.addClass('mobile-final');

            displaySurveyProgress(100, $('.optional.section'), $(".notification.end"), 'optional', 'completed');

    });

    /** Share Management **/
    var m_altrusticQuotes = [
        {quote: '"If you remember me, then I don\'t care if everyone else forgets."', quotee: "Haruki Murakami"},
        {quote: '"A person is a person no matter how small."', quotee: "Dr. Seuss"},
        {quote: '"Change is the whim you acted upon"', quotee: "Unknown"},
        {
            quote: '“It is literally true that you can succeed best and quickest by helping others to succeed.”',
            quotee: "Napoleon Hill"
        },
        {quote: '“When you don’t see the light, Be the light, Share the light”', quotee: "Margo Vader"},
        {quote: '“There is no greater agony than bearing an untold story inside you.”', quotee: "Maya Angelou"},
        {
            quote: '“You may say I\'m a dreamer, but I\'m not the only one. I hope someday you\'ll join us. And the world will live as one.”',
            quotee: "John Lennon"
        },
        {quote: '“Happiness is not something ready made. It comes from your own actions.”', quotee: "Dalai Lama XIV"},
        {
            quote: '“Never doubt that a small group of thoughtful, committed, citizens can change the world. Indeed, it is the only thing that ever has.”',
            quotee: "Margaret Mead"
        }
    ];

    function PopulateRandomShareQuote() {

        // get a random quote
        var l_randomQuoteObj = m_altrusticQuotes[Math.floor(Math.random() * m_altrusticQuotes.length)];

        // populate quote and quotee
        $('.survey .please-share .quote').text(l_randomQuoteObj.quote);
        $('.survey .please-share .quotee').text(l_randomQuoteObj.quotee);

    }

    PopulateRandomShareQuote();

    // close share box
    $(".survey .please-share .close").on('click', function () {

        var l_pleaseShareCont = $(this).parent().parent();

        l_pleaseShareCont.addClass('mini');
        l_pleaseShareCont.find('.displaying').addClass('hidden');
        l_pleaseShareCont.find('.minimized').removeClass('hidden');

    });


    // click on share icon
    $(".survey .please-share .icons a").on('click', function () {

        // display clicked message
        $(".survey .please-share .minimized span.clicked").removeClass('hidden');
        $(".survey .please-share .minimized span:not(.clicked)").addClass('hidden');

        // push data to analytics
        dataLayer.push({
            'event': "share_" + $(this).attr('class') + "_" + $(".quotee").text(),
            'event-category': "share_" + $(this).attr('class') + "_" + $(".quotee").text(),
            'event-label': m_userAnonData
        });

    });

    // click on minimized text
    $(".survey .please-share .minimized span").on('click', function () {


        var l_pleaseShareCont = $(this).parent().parent();

        l_pleaseShareCont.removeClass('mini');

        // display share box
        l_pleaseShareCont.find('.displaying').removeClass('hidden');
        l_pleaseShareCont.find('.minimized').addClass('hidden');

    });

    /** Attribution Management **/
    $(".attribution span").on('click', function () {

        var l_attributionCont = $(this).parent();

        l_attributionCont.find('span.hidden').removeClass('hidden');
        $(this).addClass('hidden');

        var l_attributionDiv = l_attributionCont.find('div');

        if (l_attributionDiv.hasClass('hidden')) {
            l_attributionDiv.removeClass('hidden');
        } else {
            l_attributionDiv.addClass('hidden');
        }

    });

    // var m_notifiyResponsiveWidth = $("span.is-mobile").is(":visible") ? 320 : 300;
    // var m_notifiyResponsiveHeight = $("span.is-mobile").is(":visible") ? 330 : 325;

    /** Initial Notification Managment **/
    // $(".survey").fadeIn(2000);

    // $(".notification.initial").effect('scale', {effect: 'scale', percent: m_notifiyResponsiveWidth, direction: "vertical"});
    // $(".notification.initial").effect('scale', {
    //     effect: 'scale',
    //     percent: m_notifiyResponsiveHeight,
    //     direction: "horizontal"
    // }, function () {
    //
    //     $(".initial div.catMsg").fadeIn(400, function () {
    //
    //         setTimeout(function () {
    //             $(".initial").fadeOut(800, function () {
    //                 $(".survey").fadeIn(700, function () {
    //                 });
    //             });
    //         }, 4750);
    //     });
    // });

    /** progress-circle Notifcation Management **/

    function displaySurveyProgress(p_percentComplete, p_hideCompletedSect, p_showNextSect, p_removeClass, p_addClass) {

        var l_displayData = function () {

            $(".survey-progress div.sect-complete").fadeIn(400, function () {

                setTimeout(function () {

                    $(".survey-progress div.sect-complete").fadeOut(400, function () {

                        $(".survey-progress div.progress-circle").fadeIn(400, function () {

                            completeSim();
                            var l_sim = setInterval(function () {

                                progressSim(l_sim, p_percentComplete, function() {

                                    setTimeout(function(){

                                        // hide the progress-circle display, and display the survey
                                        $(".survey-progress").fadeOut(1500, function () {

                                            $(".survey-progress div.progress-circle").hide();

                                            if(p_showNextSect.hasClass('notification')) {
                                                fullyCompletedDisplay();
                                            }
                                            else {
                                                p_showNextSect.removeClass('hidden');

                                                var surveyCont = $(".survey");

                                                surveyCont.fadeIn(1500);

                                                scrollToTop();

                                                $(".notification.survey-progress").attr("style", "");
                                                resetProgress();
                                            }
                                            $(".survey-current-progress").fadeIn(1500);
                                        });
                                    }, 500);


                                });
                            }, 35);
                        });
                    });
                }, 1750);
            });
        };

        var fullyCompletedDisplay = function()  {

            $(".notification.end").fadeIn(400);

            $(".notification.end").effect('scale', {effect: 'scale', percent: 320, direction: "vertical"});
        $(".notification.end").effect('scale', {
            effect: 'scale',
            percent: 300,
            direction: "horizontal"
        }, function () {

            $(".end div.catMsg").fadeIn(400);
        });
        };

        var notificationHeightScaling = p_showNextSect.hasClass('notification') == true ? 180 : 160;

        notificationHeightScaling = notificationHeightScaling == 205 && $("span.is-mobile").is(':visible') == true ? 160 : notificationHeightScaling;

        // hide survey and completed section
        $(".survey").fadeOut(400, function(){
            p_hideCompletedSect.addClass('hidden');
        });
        $(".survey-current-progress").fadeOut(400);
        $(".notification.survey-progress").fadeIn(400, function(){

            // only swap classes after survey fade out
            $('.survey').removeClass(p_removeClass).addClass(p_addClass);
            // swap classes for submit button as well
            $('.survey button.submit').removeClass(p_removeClass).addClass(p_addClass);

            m_scaledOnce = true;
            $(".notification.survey-progress").effect('scale', {effect: 'scale', percent: 300, direction: "vertical"});
            $(".notification.survey-progress").effect('scale', {
                effect: 'scale',
                percent: notificationHeightScaling,
                direction: "horizontal"
            }, l_displayData());

        });
    }

    function scrollToTop(p_scrollTo, p_animateScroll){
        var container = $('.survey');

        var scrollTo;

        if(p_scrollTo == undefined) {
            scrollTo = $('.survey .section:not(.hidden)').find("h1");
        }
        else {
            scrollTo = p_scrollTo;
        }

        if(p_animateScroll == true) {
            container.animate({scrollTop: container.scrollTop() + scrollTo.position().top}, 500);
        }

        else {
            container.scrollTop(container.scrollTop() + scrollTo.position().top);
        }
    }
});
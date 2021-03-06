var AlexaSkill = require('./AlexaSkill'),
    Exercises = require('./exercises');

var Speech = function (){};

/**
 * This function returns the welcome text:
 * 'Alexa, start pilates class'.
 */
Speech.prototype.welcome = function(options, response){
//You can now keep track of you pilates exercises.

    if ( !options ){
        options.welcomeText = "";
        options.workoutTakenText ="";
        options.welcomebacktext ="";
    }

    var speechOutput = {
        speech: "<speak>Welcome " + options.welcomeText  +
        "<break time=\"0.1s\" /> " +
        " to A Lot Of Pilates. " +
        ".<break time=\"0.5s\" /> " +
        options.workoutTakenText +
        ".<break time=\"0.3s\" /> " +
        "Get your mat ready on the floor " + options.welcomebacktext  +
        ".<break time=\"1s\" /> " +
        "Are you ready to start the class?" +
        "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    },
    repromptOutput = {
        speech:  "<speak> I can lead you through a pilates sequence " +
        "<break time=\"0.2s\" /> " +
        " You can also "+
        " visit ALotOfPilates.com and take a video instructed class. " +
        ".<break time=\"0.7s\" /> " +
        "Just say start class when ready. Should I start?" +
        "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };


  response.ask(speechOutput, repromptOutput);
};



/**
 * This function returns the text when StartOverIntent is triggered
 * 'Alexa, start class again'.
 */
Speech.prototype.startOver = function(response){
    var repromptText = "Do you want to start the class?";
    var speechOutput = "I can lead you through a pilates sequence " + "Or you can say exit. " + repromptText;
    response.ask(speechOutput, repromptText);
};

Speech.prototype.getExerciseName = function(pose){
    var exercise = Exercises[pose.id];
    var name;
    if ((typeof exercise != "undefined") || ( ! exercise )){
        name = pose.name;
    }else{
        name = Exercises[pose.id].exerciseName;
    }
    return name;
};

Speech.prototype.getStartingClassText = function(name, index){
    var startTextOptions = ["Get ready on your mat for the " + name, "Let's get started with " + name];
    var nextTextOptions = ["Next exercise is " + name, "Moving on to the" +name, "Next is " + name];
    if(name.length > 0){
        if (index === 0){
            return startTextOptions[Math.floor(Math.random() * startTextOptions.length)];
        }else{
             return nextTextOptions[Math.floor(Math.random() * nextTextOptions.length)];
        }
    }else{
        if (index === 0){
            return "Get ready on your mat to get started";
        }else{
            return "Moving on to the next exercise";
        }
    }
};

/**
 * Call for workout was successfull, so this function responsability is to loop thru the 
 * exercises the output the exercise information. It calls Speech.exerciseTimings for descriptions.
 * At this point, the user is at stage 1 of the session.
 */
Speech.prototype.teachClass = function (alopAPIResponse, response){
    console.error("TEACH CLASS " , alopAPIResponse.poses.length);
    var speechPoseOutput ="";
    for(var i = 0; i <  alopAPIResponse.poses.length; i++){
        var pose = alopAPIResponse.poses[i];
        var name = this.getExerciseName(pose);
        speechPoseOutput += this.getStartingClassText(name, i);
        speechPoseOutput += ". <break time=\"0.2s\" />. " + pose.repetition;
        speechPoseOutput += ". <break time=\"1s\" />. ";
        speechPoseOutput += this.exerciseTimings(pose);
    }
    speechPoseOutput += "You are all done! Hope you feel as great as me! Did you enjoy this class?";
    var speechText ="<speak>" + speechPoseOutput + "</speak>";
    console.log("CLASS SPEACH OUT NUMBER OF CHAR (max 8000)", speechText.length);
    var speechOutput = {
                speech: speechText,
                type: AlexaSkill.speechOutputType.SSML
        },
        repromptOutput = {
            speech:  "<speak> Was this class fun? Say yes or no in order for this class to be tracked on the A Lot of Pilates activities calendar.</speak>",
            type: AlexaSkill.speechOutputType.SSML
        };
    response.ask(speechOutput,repromptOutput);
};

Speech.prototype.exerciseTimings = function (pose){
    var speechExerciseOutput ="";
        var sideLegSeriesPoseIdArray = [431,432,434,435,326];
        var plankPosesIdArray = [133];
        var otherSuppotedPoses =[158, 160, 247, 266, 267, 273, 274, 276, 287, 289, 291, 310, 315, 318, 321, 324, 326, 327, 451, 487, 499, 511, 536, 545, 528, 529, 541, 547, 564, 431, 432, 434, 435, 631];
         var name = this.getExerciseName(pose);

        if (plankPosesIdArray.indexOf(pose.id) > -1){//Planks - Hold it for 20 to 30 seconds
            speechExerciseOutput += "Get in position for the " + name;
            speechExerciseOutput += "<break time=\"3s\" />. ";
            speechExerciseOutput += "Start holding the plank";
            speechExerciseOutput += "<break time=\"2s\" />. ";
            speechExerciseOutput += "Imagine a straight line from the crown of the head down to the toes.";
            speechExerciseOutput += "<break time=\"7s\" />. ";
            speechExerciseOutput += "10 seconds";
            speechExerciseOutput += "Breath in through the nose, out through the mouth.";
            speechExerciseOutput += ".<break time=\"8s\" />. ";
            speechExerciseOutput += "Engage your legs by squeezing an imaginary ball between them";
            speechExerciseOutput += ".<break time=\"5s\" />. ";
            speechExerciseOutput += "Almost done";
            speechExerciseOutput += ".<break time=\"3s\" />. ";
            speechExerciseOutput += "Good job. ";
            speechExerciseOutput += ".<break time=\"0.1s\" />. ";
            speechExerciseOutput += "Relax ";
            speechExerciseOutput += ".<break time=\"10s\" />. ";
        }else if (sideLegSeriesPoseIdArray.indexOf(pose.id) > -1){//Side Leg Series
            speechExerciseOutput += "Lie on one side with bottom arm bent for head to lay on.";
            speechExerciseOutput += ".<break time=\"2s\" />";
            speechExerciseOutput += "Position the legs about 45 degrees in front of the body";
            speechExerciseOutput += ".<break time=\"2s\" />";     
            speechExerciseOutput += "Start";
            speechExerciseOutput += ".<break time=\"10s\" />";
            speechExerciseOutput += "<break time=\"10s\" /> ";
            speechExerciseOutput += "<break time=\"10s\" />. ";
            speechExerciseOutput += "<break time=\"10s\" />. ";
            speechExerciseOutput += "<break time=\"10s\" />. ";
            speechExerciseOutput += "Switch sides";
            speechExerciseOutput += ".<break time=\"5s\" /> ";
            speechExerciseOutput += "Start";
            speechExerciseOutput += ".<break time=\"10s\" /> ";
            speechExerciseOutput += ".<break time=\"10s\" /> ";
            speechExerciseOutput += ".<break time=\"10s\" /> ";
            speechExerciseOutput += ".<break time=\"10s\" /> ";
            speechExerciseOutput += ".<break time=\"10s\" /> ";
        }else if (otherSuppotedPoses.indexOf(pose.id) > -1){

            speechExerciseOutput +=  this.exerciseInfo(pose.id);
       
        }else{  //Generic timining   
            //console.log("Exercise duration " + pose.duration + " formatted " + getFormattedDuration(pose.duration));
            speechExerciseOutput += ". Go. ";
            //var duration = getFormattedDuration(pose.duration);      
            for(var i = 0; i < 10; i++){
                speechExerciseOutput += "<break time=\"5s\" />. ";
            }
        }
    return speechExerciseOutput;
};

/**
 * This function retrieves the exercise information from the exercise.js module
 * It feeds back to the function and set the session parameters necessary to be used by HelpIntent
 */
Speech.prototype.exerciseInfo = function(id){
  return Exercises[id].exerciseDescription;
};

/**
 * This handles the Help intent:
 * 'Alexa, help me'.
 */
Speech.prototype.help = function (stage, response) {
    var speechText = "";
    switch (stage) {
        case 0: //haven't retrieve the class yet
            speechText = "Pilates classes are great way to feel wonderful. " +
                "If you are not familiar with the exercises visit a lot pilates dot com. " +
                "If you are ready to start say go or you can say exit.";
            break;
      
        default:
            speechText = "If you are not familiar with this exercise, " +
                        " visit A Lot Of Pilates dot com and take a video instructed class. " +
                        "To start a new class, just say go, or you can say exit.";
    }

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.ask(speechOutput, repromptOutput);
};


Speech.prototype.stopClass = function (response) {
  var speechOutput = "It is ok that you could not finish the class today. Maybe next time. Visit ALotOfPilates.com for pilates classes. Good-bye";
  response.tellWithStop(speechOutput);
};

Speech.prototype.stopUnStartedClass = function (response) {
  var speechOutput = "Ok. Hope you find a better time to start the class. Visit ALotOfPilates.com for pilates classes. Goodbye!";
  response.tellWithStop(speechOutput);
};

Speech.prototype.cancelClass = function (response) {
 var speechOutput = "It is ok that you could not finish the class today. Maybe next time. Good-bye";
        response.tellWithStop(speechOutput);
};

Speech.prototype.pluralClassText = function(count){
    return count > 1 ? " classes ": " class ";
};

Speech.prototype.trackDisplay = function(data, response, intent) {

    var cardContent = speechText;

    if( data ) {
         //console.log("TRACKING DATA", data);
        
        if (data.length) {
            var trackingIndex = data.length-1;
            var tracking = data[trackingIndex];
            //console.log("TRACKING ITEM", tracking);
            var yearCount = tracking.classCount;
            var yearClassText = this.pluralClassText(tracking.classCount);
            var year = tracking.year;
            var trackingText = "";
            if (tracking.months.length > 0 ){
                var lineBreak = '\n\n----------------------\n\n';
                trackingText = lineBreak;
                for (var i = 0; i < tracking.months.length; i++) {
                    var item = tracking.months[i];
                    var classText = this.pluralClassText(item.classCount);
                    trackingText += item.month + " : " + item.classCount + classText + "taken.";
                    trackingText += lineBreak;
                }
            }
            cardContent = " You have taken " + yearCount + yearClassText + " in " + year + ". \r\nKeep track of your progress per month. \r\n" + trackingText +"\n \nVisit ALotOfPilates.com for many more classes and tracking calendar.";
        }
    }
     if ((response != "undefined") || (response)){
        var speechText = "I am glad you liked the class. Visit ALotOfPilates.com for many more pilates classes. Good-bye!";

        if (intent.name == 'AMAZON.NoIntent') {
            speechText = "I am sorry to hear you did not like this class. Visit ALotOfPilates.com for many more pilates classes. Good-bye!";
        }
        response.tellWithCardWithStop(speechText,"A Lot Of Pilates Class", cardContent, "https://s3.amazonaws.com/s3-us-studio-resources-output/images/Hundred.gif");
    }
};


/************ ERROR Speech **************/
Speech.prototype.accountSetupError = function (response){
    var speechOutput = "You must have an ALotOfPilates.com free account to use this skill. Please use the Alexa app to link your Amazon account with your ALotOfPilates Account.";
    response.tellWithLinkAccount(speechOutput);
};

Speech.prototype.genericAnswer = function (response){
    var speechOutput = "I had a hard time understanding you. Say Start Pilates class or visit ALotOfPilates to take a class.";
    response.tellWithStop(speechOutput);
};

Speech.prototype.userAccountError = function(response){
    var speechOutput = {
                speech:"Sorry, I can not identify your account. You must have an ALotOfPilates.com free account to use this skill. Please use the Alexa app to link your Amazon account with your ALotOfPilates Account.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
    response.tellWithLinkAccount(speechOutput);
};


Speech.prototype.startClassError = function(response, err){
    console.log("ERROR WORKOUT GET SEQUENCE", err);
    var speechOutput = {
                speech:"Sorry, an error occur retrieving a pilates class. Please access ALotOfPilates.com to take a class.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
    response.tellWithStop(speechOutput);
};


module.exports = new Speech();
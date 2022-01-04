const Alexa = require('ask-sdk-core');
const tools = require('./my_modules/tools');
const data = require('./my_modules/data');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        let speakOutput= `Welcome to find my pace, `;
        let pause = "<break time='0.25s'/>";
        let prefix = tools.getRandomPhrase(data.pools.launchPrompt);
        let suffix = tools.getRandomPhrase(data.pools.launchSuffix)
         speakOutput += prefix + pause + suffix;
        let repromptText = `Sorry I did not get that, ` + suffix;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

//--------------------------------------------------------------------------------
const SetTimeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetTimeIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let speakOutput = `Set time Intent called.`;

        //get slot values
        let hours = handlerInput.requestEnvelope.request.intent.slots.hours.value;
        let minutes = handlerInput.requestEnvelope.request.intent.slots.minutes.value;
        let seconds = handlerInput.requestEnvelope.request.intent.slots.seconds.value; 
        let h = (hours) ? hours : 0;
        let m = (minutes) ? minutes : 0;
        let s = (seconds) ? seconds : 0;
        
        //turn the slot values into seconds
        let totalSeconds = tools.convertToSeconds(sessionAttributes, h, m, s)
        
        speakOutput = `You said ${h} hours ${m} minutes ${s} seconds`;
        //if all the proper info exists, calculate the splits
        if(sessionAttributes.distance && sessionAttributes.unit && totalSeconds){
            const split = tools.calculateSplits(sessionAttributes, totalSeconds)
            const formattedTime = tools.formatSecondsToTime(split)
            speakOutput = ` the split for running ${sessionAttributes.distance} ${sessionAttributes.unit} in converted ${totalSeconds} seconds is ${split} ${formattedTime}`
            
            speakOutput = `running ${sessionAttributes.distance} ${sessionAttributes.unit} requires a pace of ${formattedTime} per ${sessionAttributes.unit}`
       
            
        }
        /*
        if(sessionAttributes.distance && sessionAttributes.unit && sessionAttributes.totalSeconds){
            const split = tools.calculateSplits(sessionAttributes)

            speakOutput = ` the split for running ${sessionAttributes.distance} ${sessionAttributes.unit} in ${sessionAttributes.totalSeconds} is ${split}`

            const formattedTime = tools.formatSecondsToTime(split)
            speakOutput = ` ${split} seconds formatted is ${formattedTime}`
        }
        */
        let repromptText = speakOutput;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};



const SetDistanceIntentHandler = {
    //TODO -What is there is already a time value 
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetDistanceIntent';
    },
    handle(handlerInput) {

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let speakOutput = 'Set distance Intent called. ';
        let repromptText = speakOutput;
        //collect slot values
        let distance = handlerInput.requestEnvelope.request.intent.slots.distance.value;
        let decimal = handlerInput.requestEnvelope.request.intent.slots.decimal.value;
        let unit = handlerInput.requestEnvelope.request.intent.slots.unit.value;

        //turn slot calues into bumerica values
        distance = parseFloat(distance);
        sessionAttributes.distance = distance;
        if(decimal){
            decimal = parseFloat(decimal * 0.1);
            sessionAttributes.decimal = decimal;
            sessionAttributes.distance = distance + decimal;
        }

        if(unit){
            sessionAttributes.unit = unit;
            let resolvedUnit = tools.resolvedValue(handlerInput.requestEnvelope, `unit`)
            sessionAttributes.resolvedUnit = resolvedUnit;
            //speakOutput = `In minutes, hours, and seconds; what time are you looking to complete ${sessionAttributes.distance} ${resolvedUnit}? `;
            speakOutput = tools.getRandomPhrase(data.pools.requestTime)
            speakOutput += ` ${sessionAttributes.distance} ${resolvedUnit}`;
        } else {
            //no unit given
            speakOutput = `${sessionAttributes.distance}, is that miles or kilometers? `;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
        }
};

//--------------------------------------------------------------------------------

const SetRaceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetRaceIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let speakOutput = 'Set Race Intent called ';
        let repromptText = speakOutput;
        //collect slot values
        let race = handlerInput.requestEnvelope.request.intent.slots.race.value;
        race = tools.resolvedValue(handlerInput.requestEnvelope, 'race')

        tools.raceToDistance(sessionAttributes, race)

        //TODO convert to unit and distance
        speakOutput = `Test So you plan to run a ${race}`

        speakOutput = tools.getRandomPhrase(data.pools.requestTime)
        speakOutput += ` the ${race}`

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


//--------------------------------------------------------------------------------


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        
        const speakOutput = tools.getRandomPhrase(data.pools.goodbyes);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SetTimeIntentHandler,
        SetRaceIntentHandler,
        SetDistanceIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
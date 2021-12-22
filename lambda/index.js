const Alexa = require('ask-sdk-core');
const tools = require('./my_modules/tools');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Well howdy,  How far do you want to run?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
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
        let hours = handlerInput.requestEnvelope.request.intent.slots.hours.value;
        let minutes = handlerInput.requestEnvelope.request.intent.slots.minutes.value;
        let seconds = handlerInput.requestEnvelope.request.intent.slots.seconds.value; 
        let h = (hours) ? hours : 0;
        let m = (minutes) ? minutes : 0;
        let s = (seconds) ? seconds : 0;
        
        let totalSeconds = tools.convertToSeconds(sessionAttributes, h, m, s)
        let speakOutput = `Set time Intent called. You said ${h} hours ${m} minutes ${s} seconds`;
        speakOutput = `You said ${h} hours ${m} minutes ${s} seconds`;

        if(sessionAttributes.distance && sessionAttributes.unit && sessionAttributes.totalSeconds){
            const split = tools.calculateSplits(sessionAttributes)

            speakOutput = ` the split for running ${sessionAttributes.distance} ${sessionAttributes.unit} in ${sessionAttributes.totalSeconds} is ${split}`

            const formattedTime = tools.formatSecondsToTime(split)
            speakOutput = ` ${split} seconds formatted is ${formattedTime}`
            
           // speakOutput = `running ${sessionAttributes.distance} ${sessionAttributes.unit} requires a pace of ${formattedTime} per ${sessionAttributes.unit}`
      
            
        }


       
       // speakOutput += `That is a total of ${totalSeconds} seconds`;
        let repromptText = speakOutput;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};



const SetDistanceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetDistanceIntent';
    },
    handle(handlerInput) {

        let speakOutput = 'Set distance Intent called. ';
        let repromptText = speakOutput;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let distance = handlerInput.requestEnvelope.request.intent.slots.distance.value;
        let decimal = handlerInput.requestEnvelope.request.intent.slots.decimal.value;
        let unit = handlerInput.requestEnvelope.request.intent.slots.unit.value;
        let resolvedUnit = tools.resolvedValue(handlerInput.requestEnvelope, `unit`)

        distance = parseFloat(distance);
        sessionAttributes.distance = distance;

        if(decimal){
            decimal = parseFloat(decimal * 0.1);
            sessionAttributes.decimal = decimal;
            sessionAttributes.distance = distance + decimal;
        }

        if(unit){
            sessionAttributes.unit = unit;
           // sessionAttributes.resolvedUnit = tools.resolvedValue(handlerInput.requestEnvelope, `unit`)
            speakOutput = `In minutes, hours, and seconds; what time are you looking to complete ${distance} ${resolvedUnit}? `;
        } else {
            //no unit given
        }
        /*
        
        

        let speakOutput = `Set distance Intent called ${distance} ${unit}resolves to ${resolvedUnit}`;
        let repromptText = speakOutput;

        if(unit){
            sessionAttributes.unit = unit;
            sessionAttributes.resolvedUnit = resolvedUnit;

           
            reprompt = speakOutput;
        }

        */
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
        }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

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
        const speakOutput = 'Goodbye!';

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
        HelloWorldIntentHandler,
        SetTimeIntentHandler,
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
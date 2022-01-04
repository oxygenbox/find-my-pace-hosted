var tools = {
    convertToSeconds(attributes, hours, minutes, seconds){
        let total = 0
        
        if(seconds){
            total += parseInt(seconds)
        }
        
        if(minutes){
            total += parseInt(minutes)*60
        }
        
        if(hours){
            total += parseInt(hours)*60*60
        }
        
        attributes.totalSeconds = total;
        return total;
    },

    calculateSplits(attributes){
        let splitSeconds = attributes.totalSeconds/attributes.distance
        
        
        return splitSeconds
    },
    
    formatSecondsToTime(seconds){
        let date = new Date(seconds * 1000);
        let hh = date.getUTCHours();
        let mm = date.getUTCMinutes();
        let ss = date.getSeconds();
        
        if (hh < 10) {hh = "0"+hh;}
        if (mm < 10) {mm = "0"+mm;}
        if (ss < 10) {ss = "0"+ss;}
        // This formats your string to HH:MM:SS
        var t = hh+":"+mm+":"+ss;
        
        let h = date.getUTCHours();
        let m = date.getUTCMinutes();
        let s = date.getSeconds();
        
        let time = ``
        if(h>0){
            time += `${h} `
            time += this.formatUnit(`hour`, h)
        }
        
        if(m){
            time += `${m} `
            time += this.formatUnit(`minute`, m)
        }
        
        if(s){
            time += `${s} `
            time += this.formatUnit(`second`, s)
        }
        
        return time
    },

    raceToDistance(attributes, race){
        let distance
        let unit = 'miles'
        switch(race){
            case "5k": 
                distance = 3.1
                break;
            case "8k": 
               distance = 4.97
                break;
            case "10k": 
                distance = 6.2
                break;
            case "15k": 
                distance = 9.3
                break;
            case "ten miler": 
                distance = 10;
                break;
            case "half marathon":
                distance = 13.1;
                break;
            case "marathon":
                distance = 26.2;
                break;
            case "50k":
                distance = 31;
                break;
            case "100k":
                distance = 62;
                break;
            case "hundred":
                distance = 100;
                break;
        }
        attributes.distance = distance;
        attributes.unit = unit;
        attributes.race = race;

    },
    
    formatUnit(unit, num){
        if(num > 1){
            return `${unit}s `
        }
        return unit
    },

    getRandomPhrase(array) {
        // the argument is an array [] of words or phrases
        var i = 0;
        i = Math.floor(Math.random() * array.length);
        return(array[i]);
    },

    resolvedValue(requestEnvelope, slotName) {
        if (requestEnvelope &&
          requestEnvelope.request &&
          requestEnvelope.request.intent &&
          requestEnvelope.request.intent.slots &&
          requestEnvelope.request.intent.slots[slotName] &&
          requestEnvelope.request.intent.slots[slotName].resolutions &&
          requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority &&
          requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0] &&
          requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values &&
          requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0]
            .values[0] &&
          requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0]
            .value &&
          requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0]
            .value.name) {
          return requestEnvelope.request.intent.slots[slotName].resolutions
            .resolutionsPerAuthority[0].values[0].value.name;
        }
    
        return requestEnvelope.request.intent.slots[slotName].value
        //return undefined;
        
      }
    
    
    
}

module.exports = tools





/*
const SetDistanceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetDistanceIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let dist = handlerInput.requestEnvelope.request.intent.slots.distance.value
        let decimal = handlerInput.requestEnvelope.request.intent.slots.decimal.value
        const unit = handlerInput.requestEnvelope.request.intent.slots.unit.value
        const resolvedUnit = resolvedValue(handlerInput.requestEnvelope, `distance`)
        
        let speakOutput = `Distance Intent called ${dist} ${unit}`;
        let repromptText = speakOutput
        
        dist = parseInt(dist);
        
        
        if(dist){
            if(decimal){
                decimal = parseInt(decimal) * 0.1
                dist += decimal
            }
            
            
            sessionAttributes.distance = dist
        }
        
        if(unit){
            sessionAttributes.unit = unit
        }
        
        speakOutput = `In minutes, hours, and seconds; what time are you looking to complete ${dist} ${unit}? `

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};


const SetTimeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetTimeIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const hours = handlerInput.requestEnvelope.request.intent.slots.hour.value
        const minutes = handlerInput.requestEnvelope.request.intent.slots.minute.value
        const seconds = handlerInput.requestEnvelope.request.intent.slots.second.value
        
        let h = (hours) ? hours : 0
        let m = (minutes) ? minutes : 0
        let s = (seconds) ? seconds : 0
      
        let totalSeconds = tools.convertToSeconds(h, m, s)
        
        sessionAttributes.totalSeconds = tools.convertToSeconds(h, m, s)
        
      
        
        let speakOutput = `Time Intent called. `;
        
        
        
        if(sessionAttributes.distance && sessionAttributes.unit && sessionAttributes.totalSeconds){
            const split = tools.calculateSplits(sessionAttributes)
            const formattedTime = tools.formatSecondsToTime(split)
            speakOutput = ` the split for running ${sessionAttributes.distance} ${sessionAttributes.unit} in ${sessionAttributes.totalSeconds} is ${split} ${formattedTime}`
            
            speakOutput = `running ${sessionAttributes.distance} ${sessionAttributes.unit} requires a pace of ${formattedTime} per ${sessionAttributes.unit}`
      
            
        }
        
       // 
        
        //speakOutput = `${h}: ${m}: ${s}`

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


*/
var data =  {
    qualifyingStart: `September 11, 2019 `,
    qualifyingEnd: `November 12, 2021 `,
    raceDate: `April 18th 2022 `,
       
     pools: {
          launchPrompt : [
            `I can help you find the pace needed to reach your race goal. `,
            `Allow me to find the pace required to achieve your race goal. `,
            `If you are trying to figure out the pace necessary to hit your race goal, you are in the right place. `,
            `If you want to know what pace is required to hit your race goal, then let me help you. `,
            `I can provide the pace required to reach your desired finish time.  `
           ],

           launchSuffix : [
            `I just need a few bits of info. To start, tell me the length of your race, or how far to plan to run. `,
            `To begin, tell me the length of the race or run. `,
            `To get started, I need to know the length of your race or the distance you are asking about. `,
            `To start off, provide me with the distance you plan to run. `,
            `To kick things off, tell me the distance you are looking to run. `
           ],


           OLDlaunchSuffix :[
               `I just need you to tell me the length of your race, and your desired finish time. `,
               `Tell me your race distance, and the time you wish to finish it in. `,
               `I need to know the length of your race, along with the time you are hoping to complete it. `,
               `Provide me with the distance you plan to run, and the time you are hoping to finish in. `,
               `Just let me know the distance, along  with the desired finish time. `
           ],
           goodbyes : [
                "OK. Don't forget to plan your race, and race your plan. ",
                "Alright, and remember to never fear the distance, but always respect it. ",
                "Ok! remember the bigger the smile, the faster the mile. ",
           ],

           requestTime : [
                `What time do you want to finish your `,
                `What time do you want to finish the`,
                `In minutes, hours, and seconds; what time are you looking to complete `,
                `In minutes, hours, and seconds; what is your goal time for completing `,
                `Tell me your target time for completing `
              ],
               mininumAge : [
               "I'm sorry, you need to be 18 years old to qualify for Boston. ",
               "Oops, you need to be at least 18 years old to enter the Boston Marathon. ",
               "Pissa, The minumum age to run the Boston Marathon is 18. ",
           ],
           
           followUp: [
               `Feel free to ask about a different age or gender. If you are finished, say done. `,
               `You can provide a different age or gender. If you are done, say end. `,
               `You can ask about a different age, or if you're finished, say done. `,
               ],
               
            altAthletePrompt: [
                `Let me know if you are a wheel chair athlete or if you are a para athlete and I will provide information for you. `,
                `If you are a wheel chair or para athlete let me know and I can provide the qualifying times for you. `,
                `Tell me if you are a para or wheelchair athlete and I'll provide information for you. `
                ],
                
       fallback:[
               `I am sorry, I did not get that, please try again. `,
               `Sorry, I did not userstand you might try asking in a different way. `,
               `I did not get that, please ask again. `
           ]
       
       },
       response:{
           help_basic: `You can say repeat qualifying time; you can ask about a different age and gender; you can ask for the race date; or if you are done say stop. `,
           help_adv:`Before I can provide your qualifying time for the Boston Marathon, I need to know how old you'll be on race day, and if you are a male or female.`,
           basicInquiry: `I need to know how old you are, and if you are male or female. `,
           ageInquiry: `I need to know how old you'll be on race day. `,
           wheelChairPrompt: `If you are a wheel chair athlete, say get my wheel chair time`,
           underAgeReprompt: ` Feel free to ask about a different age. `,
       },
       
      
       
     }
    
       
      module.exports = data;
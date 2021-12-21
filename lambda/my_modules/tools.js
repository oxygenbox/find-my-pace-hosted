var tools = {
    convertToSeconds(hours, minutes, seconds){
        let tot = 0
        
        if(seconds){
            tot += seconds
        }
        
        if(minutes){
            tot += minutes*60
        }
        
        if(hours){
            tot += hours*60*60
        }
        
        return tot
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
    
    formatUnit(unit, num){
        if(num > 1){
            return `${unit}s `
        }
        return unit
    }
    
    
    
}

module.exports = tools
Date.prototype.toLocaleDateString = function(){
    return `${this.getFullYear()}년 ${this.getMonth() + 1}월 ${this.getDate()}일`;
}

Number.prototype.sectotime = function(){
    let min = parseInt(this / 60);
    let sec = parseInt(this % 60);
    
    if(min < 10) min = "0" + min;
    if(sec < 10) sec = "0" + sec;
    return `${min}:${sec}`;
}
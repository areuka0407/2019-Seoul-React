import {toast} from 'react-toastify';

Date.prototype.toLocaleYMString = function(){
    return `${this.getFullYear()}년 ${this.getMonth() + 1}월`;
}

Date.prototype.toLocaleDateString = function(){
    return `${this.getFullYear()}년 ${this.getMonth() + 1}월 ${this.getDate()}일`;
}

Date.prototype.toLocaleTimeString = function(){
    let hour = this.getHours();
    let minute = this.getMinutes();

    if(hour < 10) hour = "0" + hour;
    if(minute < 10) minute = "0" + minute;

    return `${this.getFullYear()}년 ${this.getMonth() + 1}월 ${this.getDate()}일 ${hour}시 ${minute}분`;
}

Date.prototype.toDetailTimeString = function(){
    let month = this.getMonth() + 1;
    let date = this.getDate();

    let hour = this.getHours();
    let minute = this.getMinutes();
    let second = this.getSeconds();

    if(month < 10) month = "0" + month;
    if(date < 10) date = "0" + date;

    if(hour < 10) hour = "0" + hour;
    if(minute < 10) minute = "0" + minute;
    if(second < 10) second = "0" + second;

    return `${this.getFullYear()}-${month}-${date} ${hour}:${minute}:${second}`;
}

String.prototype.toTime = function(){
    let split = this.split(":");
    let min = parseInt(split[0]) * 60;
    let sec = parseFloat(split[1]);
    return min + sec;
}

Number.prototype.sectotime = function(){
    let min = parseInt(this / 60);
    let sec = parseInt(this % 60);
    
    if(min < 10) min = "0" + min;
    if(sec < 10) sec = "0" + sec;
    return `${min}:${sec}`;
}

Number.prototype.sectodetailtime = function(){
    let min = parseInt(this / 60);
    let sec = parseInt(this % 60);
    let ms = parseFloat(this - (min * 60) - sec).toFixed(2).substr(-2);
    
    if(min < 10) min = "0" + min;
    if(sec < 10) sec = "0" + sec;
    return `${min}:${sec}.${ms}`;
}


export function createToast(title, message, type = "danger"){
    toast.configure({draggable: true});

    const toastInfo = {
        className: `bg-${type} text-white`,
        bodyClassName: "keep-all px-3 pt-2 pb-3",
        progressClassName: "bg-none bg-light",
    }
    toast(
    <>
        <div className="font-weight-bold">{title}</div>
        <div className="mt-1 fx-n4">{message}</div>
    </>,
    toastInfo)
}


export function randomStr(length){
    const str = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    let result = "";
    for(let i = 0; i < length; i++)
        result += str[parseInt(Math.random() * str.length - 1)];
    return result;
}

export function toString(value){
    return `${value}`;
}
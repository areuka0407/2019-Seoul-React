import {toast} from 'react-toastify';

Date.prototype.toLocaleYMString = function(){
    return `${this.getFullYear()}년 ${this.getMonth() + 1}월`;
}

Date.prototype.toLocaleDateString = function(){
    return `${this.getFullYear()}년 ${this.getMonth() + 1}월 ${this.getDate()}일`;
}

String.prototype.toTime = function(){
    let split = this.split(":");
    let min = parseInt(split[0]);
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
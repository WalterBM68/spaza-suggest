
document.addEventListener('DOMContentLoaded', function(){
    let errorMsg = document.querySelector('.errorMsgs');
    if(errorMsg.innerHTML !== ''){
        setTimeout(function(){
            errorMsg.innerHTML = '';
        }, 4000);
    }
});
document.addEventListener('DOMContentLoaded', function(){
    let errorReg = document.querySelector('.errorReg');
    if(errorReg.innerHTML !== ''){
        setTimeout(function(){
            errorReg.innerHTML = '';
        }, 4000);
    }
});
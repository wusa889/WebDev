function addme(a, b) {
    return a + b;
}

function imstealingyourdata() {
    let form = document.getElementById('myform');
    let formData = new FormData(form);
    let formObj = {};
    formData.forEach(function (value, key) {
        formObj[key] = value;
    });

    let json = JSON.stringify(formObj);

    console.log('i got you data');
    console.log(json);
}


let script1 = (function () {
    function myFunction() {
        return 5;
    }
    return {
        a: myFunction,
    } 
})()

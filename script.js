document.getElementById("nextBtn").addEventListener("click", function () {

let age = document.getElementById("age").value;
let weight = document.getElementById("weight").value;
let height = document.getElementById("height").value;
let asa = document.getElementById("asa").value;

if(age=="" || weight=="" || height=="" || asa==""){

alert("Please complete all required fields.");

return;

}

alert("Patient information saved.\nNext page will be Surgical Information.");

});
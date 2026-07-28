function toggleDropdown(){

let d=document.getElementById("dropdown");

d.style.display=d.style.display==="block"?"none":"block";

}

document.querySelectorAll("#dropdown input").forEach(function(item){

item.addEventListener("change",updateSelected);

});

function updateSelected(){

let checked=[...document.querySelectorAll("#dropdown input:checked")];

let text=document.getElementById("selectedText");

if(checked.length===0){

text.innerHTML="Select Comorbidities";

}

else if(checked.length<=2){

text.innerHTML=checked.map(x=>x.value).join(", ");

}

else{

text.innerHTML=checked[0].value+" +"+(checked.length-1)+" more";

}

}

window.onclick=function(e){

if(!e.target.closest(".multi-select")){

document.getElementById("dropdown").style.display="none";

}

}
document.getElementById("nextBtn").addEventListener("click", function () {

    // اینجا بعداً اعتبارسنجی اطلاعات را انجام می‌دهیم

    window.location.href = "surgical.html";

});
function showFunctionalInfo() {

alert(
`NYHA Functional Classification

Class I
No limitation of physical activity.

Class II
Slight limitation of physical activity.

Class III
Marked limitation of physical activity.

Class IV
Symptoms at rest or with minimal activity.`
);

}

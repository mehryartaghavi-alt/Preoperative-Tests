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
function showMetsInfo() {

alert(
`Functional Capacity (METs)

≥10 METs (Excellent)
Examples:
• Running
• Competitive sports
• Heavy manual labor

4–10 METs (Moderate–Good)
Examples:
• Climbing 2 flights of stairs
• Brisk walking
• Gardening

<4 METs (Poor)
Examples:
• Unable to climb one flight of stairs
• Walking slowly on level ground
• Limited by dyspnea or chest pain

Unknown
Functional capacity cannot be reliably assessed.`
);

}

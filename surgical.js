document.getElementById("nextBtn").addEventListener("click",function(){

let type=document.getElementById("surgicalType").value;

let grade=document.getElementById("grade").value;

let blood=document.getElementById("bloodLoss").value;

let urgency=document.getElementById("urgency").value;

if(type=="" || grade=="" || blood=="" || urgency==""){

alert("Please complete all fields.");

return;

}

alert("Surgical information saved.");

});
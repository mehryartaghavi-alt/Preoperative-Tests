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
document.getElementById("nextBtn").addEventListener("click", function () {

    window.location.href = "investigations.html";

});
function showGradeInfo() {
    alert(
`SURGICAL GRADE

Minimal
• Superficial procedures with negligible physiological stress.
Examples:
- Skin lesion excision
- Cataract surgery
- Diagnostic endoscopy

Minor
• Low-risk procedures with limited physiological stress.
Examples:
- Inguinal hernia repair
- Breast lumpectomy
- Arthroscopic knee surgery

Intermediate
• Moderate physiological stress.
Examples:
- Total hip replacement
- Thyroidectomy
- Hysterectomy

Major
• Major physiological stress and/or significant blood loss.
Examples:
- CABG
- Whipple procedure
- Major liver resection
- CRS + HIPEC`
    );
}

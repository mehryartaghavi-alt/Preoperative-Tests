// ==========================================
// Surgical Information – Version 4
// ==========================================

document.getElementById("nextBtn").addEventListener("click", function () {

    const type = document.getElementById("surgicalType").value;
    const grade = document.getElementById("grade").value;
    const blood = document.getElementById("bloodLoss").value;
    const urgency = document.getElementById("urgency").value;

    // Check required fields
    if (
        type === "" ||
        grade === "" ||
        blood === "" ||
        urgency === ""
    ) {
        alert("Please complete all fields.");
        return;
    }

    // Temporary confirmation
    // This will later be replaced by the Version 4
    // investigation rule engine.

    alert("Surgical information saved.");

    // Go to Page 5
    window.location.href = "investigations.html";

});


// ==========================================
// Surgical Grade Help
// ==========================================

function showGradeInfo() {

    alert(
`SURGICAL GRADE

Minimal:
• Superficial or very low physiological stress
• Minimal expected blood loss

Examples:
• Skin lesion excision
• Cataract surgery
• Diagnostic endoscopy

Mild:
• Limited physiological stress
• Usually low blood loss

Examples:
• Inguinal hernia repair
• Breast lumpectomy
• Minor orthopedic procedures

Grade 2:
• Moderate physiological stress
• Moderate risk of complications or blood loss

Examples:
• Total hip replacement
• Thyroidectomy
• Hysterectomy

Grade 3:
• Major physiological stress and/or significant blood loss
• Higher perioperative risk

Examples:
• Major abdominal surgery
• Major vascular surgery
• Major thoracic surgery
• CRS + HIPEC`
    );

}

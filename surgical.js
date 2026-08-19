// ==========================================
// Surgical Information - TESTING MODE
// ==========================================

document.getElementById("nextBtn")
    .addEventListener("click", function () {

        const surgeryData = {

            surgicalType:
                document.getElementById("surgicalType").value,

            grade:
                document.getElementById("grade").value,

            bloodLoss:
                document.getElementById("bloodLoss").value,

            urgency:
                document.getElementById("urgency").value

        };

        // Save data
        localStorage.setItem(
            "surgeryData",
            JSON.stringify(surgeryData)
        );

        // Go directly to Page 5
        window.location.href =
            "investigations.html";

    });


// ==========================================
// Surgical Grade Help
// ==========================================

function showGradeInfo() {

    alert(`
SURGICAL GRADE

Minimal:
Low physiological stress procedures.

Mild:
Low-risk procedures.

Grade 2:
Moderate physiological stress.

Grade 3:
Major physiological stress.
`);

}

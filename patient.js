// ===============================
// Patient Information – Version 4
// ===============================


// ---------- BMI Calculation ----------

function calculateBMI() {

    const height = parseFloat(
        document.getElementById("height").value
    );

    const weight = parseFloat(
        document.getElementById("weight").value
    );

    const bmiField = document.getElementById("bmi");

    if (
        !height ||
        !weight ||
        height <= 0 ||
        weight <= 0
    ) {
        bmiField.value = "";
        return;
    }

    const heightInMeters = height / 100;

    const bmi =
        weight / (heightInMeters * heightInMeters);

    bmiField.value = bmi.toFixed(1);
}


// Recalculate BMI whenever height or weight changes

document
    .getElementById("height")
    .addEventListener("input", calculateBMI);

document
    .getElementById("weight")
    .addEventListener("input", calculateBMI);


// ---------- METs Help ----------

function showMetsInfo() {

    alert(
`Functional Capacity (METs)

≥10 METs – Excellent
Examples:
• Running
• Competitive sports
• Heavy manual work

4–10 METs – Moderate / Good
Examples:
• Brisk walking
• Climbing stairs
• Gardening

<4 METs – Poor
Examples:
• Difficulty climbing one flight of stairs
• Slow walking
• Limited by dyspnea or chest pain

Unknown
Functional capacity cannot be reliably assessed.`
    );
}


// ---------- Navigation ----------

function goBack() {

    window.location.href = "index.html";

}


function goNext() {

    // Temporary navigation.
    // Page 3 (Comorbidities) will replace this target
    // in the next development step.

    window.location.href = "surgical.html";

}

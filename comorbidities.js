// ==========================================
// Comorbidities – Version 4
// ==========================================


const conditions = [
    ["hypertension", "hypertensionStatus"],
    ["diabetes", "diabetesStatus"],
    ["cad", "cadStatus"],
    ["heartFailure", "heartFailureStatus"],
    ["arrhythmia", "arrhythmiaStatus"],
    ["valvular", "valvularStatus"],
    ["ckd", "ckdStatus"],
    ["liver", "liverStatus"],
    ["respiratory", "respiratoryStatus"],
    ["smoking", "smokingStatus"],
    ["cva", "cvaStatus"],
    ["thyroid", "thyroidStatus"],
    ["bleeding", "bleedingStatus"],
    ["anemia", "anemiaStatus"]
];


conditions.forEach(function(item) {

    const checkbox =
        document.getElementById(item[0]);

    const subOptions =
        document.getElementById(item[1]);

    checkbox.addEventListener("change", function() {

        if (checkbox.checked) {
            subOptions.style.display = "block";
        } else {
            subOptions.style.display = "none";

            const select =
                subOptions.querySelector("select");

            if (select) {
                select.value = "";
            }
        }

    });

});


// ------------------------------------------
// Navigation
// ------------------------------------------

function goBack() {

    window.location.href = "patient.html";

}


function goNext() {

    // Temporary:
    // Page 4 will be surgical.html

    window.location.href = "surgical.html";

}

// ==========================================
// Comorbidities – Version 5
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


// Checkbox behavior
conditions.forEach(function (item) {

    const checkbox =
        document.getElementById(item[0]);

    const subOptions =
        document.getElementById(item[1]);

    if (!checkbox || !subOptions) {
        return;
    }

    checkbox.addEventListener("change", function () {

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


// Save comorbidities
function saveComorbidities() {

    const data = {};

    conditions.forEach(function (item) {

        const checkbox =
            document.getElementById(item[0]);

        data[item[0]] =
            checkbox ? checkbox.checked : false;

    });

    localStorage.setItem(
        "comorbiditiesData",
        JSON.stringify(data)
    );
}


// Next
function goNext() {

    saveComorbidities();

    window.location.href =
        "surgical.html";
}

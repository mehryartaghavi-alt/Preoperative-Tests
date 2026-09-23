// ==========================================
// Medications – Selection only
// No perioperative medication rules are applied here yet.
// ==========================================

const medicationIds = [
    "metformin", "sglt2", "sulfonylurea", "dpp4", "glp1", "insulin",
    "warfarin", "apixaban", "rivaroxaban", "edoxaban", "dabigatran", "heparin",
    "aspirin", "clopidogrel", "prasugrel", "ticagrelor",
    "acei", "arb", "betaBlocker", "ccb", "diuretic",
    "steroid", "thyroidMedication", "antiepileptic", "parkinsonMedication", "herbal"
];

function loadMedications() {
    const saved = JSON.parse(localStorage.getItem("medicationsData") || "{}");

    medicationIds.forEach(function (id) {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = saved[id] === true;
    });
}

function saveMedications() {
    const data = {};

    medicationIds.forEach(function (id) {
        const checkbox = document.getElementById(id);
        data[id] = checkbox ? checkbox.checked : false;
    });

    localStorage.setItem("medicationsData", JSON.stringify(data));
}

function goNext() {
    saveMedications();
    window.location.href = "surgical.html";
}

medicationIds.forEach(function (id) {
    const checkbox = document.getElementById(id);
    if (!checkbox) return;

    checkbox.addEventListener("change", function () {
        saveMedications();
    });
});

loadMedications();

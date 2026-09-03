// ============================================================
// PREOPERATIVE TESTS ADVISOR
// Rule Engine - Version 5
// ============================================================
//
// Inputs:
// Patient:
// age, sex, bmi, asa, mets
//
// Comorbidities:
// hypertension, diabetes, cad, heartFailure, arrhythmia,
// valvular, ckd, liver, respiratory, smoking, cva,
// thyroid, bleeding, anemia
//
// Surgery:
// surgicalType, grade, bloodLoss, urgency
//
// Output:
// REQUIRED
// ADVISE
// CLINICAL ACTION
//
// ============================================================


// ============================================================
// STORAGE HELPERS
// ============================================================

function getStoredObject(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) {
        return {};
    }
}


// ============================================================
// LOAD DATA
// ============================================================

const patient = getStoredObject("patientData");
const comorbidities = getStoredObject("comorbiditiesData");
const surgery = getStoredObject("surgeryData");


// ============================================================
// NORMALIZE DATA
// ============================================================

const data = {

    age: Number(patient.age || 0),

    sex: patient.sex || "",

    bmi: Number(patient.bmi || 0),

    asa: Number(patient.asa || 0),

    mets: patient.mets || "",

    hypertension: !!comorbidities.hypertension,
    diabetes: !!comorbidities.diabetes,
    cad: !!comorbidities.cad,
    heartFailure: !!comorbidities.heartFailure,
    arrhythmia: !!comorbidities.arrhythmia,
    valvular: !!comorbidities.valvular,
    ckd: !!comorbidities.ckd,
    liver: !!comorbidities.liver,
    respiratory: !!comorbidities.respiratory,
    smoking: !!comorbidities.smoking,
    cva: !!comorbidities.cva,
    thyroid: !!comorbidities.thyroid,
    bleeding: !!comorbidities.bleeding,
    anemia: !!comorbidities.anemia,

    surgicalType: surgery.surgicalType || "",

    grade: surgery.grade || "",

    bloodLoss: surgery.bloodLoss || "",

    urgency: surgery.urgency || ""
};


// ============================================================
// GRADE NORMALIZATION
// ============================================================
//
// Your current surgical page:
//
// minimal → minor
// mild    → minor
// grade2  → intermediate
// grade3  → major
//
// ============================================================

function normalizeGrade(grade) {

    switch (grade) {

        case "minimal":
        case "mild":
            return "minor";

        case "grade2":
            return "intermediate";

        case "grade3":
            return "major";

        default:
            return "";

    }
}

data.normalizedGrade = normalizeGrade(data.grade);


// ============================================================
// RESULT CONTAINERS
// ============================================================

const results = {

    required: [],
    advise: [],
    actions: []

};


// ============================================================
// ADD RESULT
// ============================================================

function addRequired(test, reason) {

    results.required.push({
        test: test,
        reason: reason
    });

}

function addAdvise(test, reason) {

    results.advise.push({
        test: test,
        reason: reason
    });

}

function addAction(action, reason) {

    results.actions.push({
        action: action,
        reason: reason
    });

}


// ============================================================
// DEDUPLICATION
// ============================================================

function uniqueResults(array) {

    const seen = new Set();

    return array.filter(item => {

        const key =
            item.test || item.action;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;

    });

}


// ============================================================
// RULE R001
// AGE
// ============================================================
//
// Age alone should NOT automatically trigger a battery
// of investigations.
//
// Age may modify risk assessment and may interact with
// other clinical factors.
//
// ============================================================

function R001_age() {

    if (data.age > 65) {

        // No automatic laboratory testing.

        addAction(
            "Age-related clinical risk assessment",
            "Age alone is not considered an indication for routine laboratory testing, But CBC, FBS, BUN, Cr sometimes consider."
                  );

    }

}

// ============================================================
// RULE R001_2
// HYPERTENSION
// ============================================================
//
// Hypertension alone does NOT automatically trigger
// routine preoperative investigations.
//
// Poorly controlled hypertension or target-organ damage
// may affect ASA classification.
//
// BP ≥180/110 mmHg may warrant postponement of elective
// surgery, independent of routine preoperative testing.
//
// ============================================================

function R001_2_hypertension() {

    if (data.hypertension) {

        addAction(
            "Hypertension-related clinical assessment",
            "Hypertension alone does not indicate routine preoperative testing. Elective surgery should be postponed if blood pressure is ≥180/110 mmHg."
        );

    }

}
// ============================================================
// RULE R002
// DIABETES / HbA1c
// ============================================================

function R002_diabetes() {

    if (data.diabetes) {

        addRequired(
            "HbA1c, FBS",
            "Diabetes mellitus: obtain HbA1c if no result is available from the previous 3 months. FBS, at the morning of surgery."
                       );
addAction(
            "Preferred HbA1c for elective surgery is <8%",
            "Perioperative target for FBS is 100–180 mg/dL (5.6–10 mmol/L)."
        );

    }

}


// ============================================================
// RULE R003
// FEMALE / PREGNANCY
// ============================================================

function R003_pregnancy() {

    if (data.sex === "Female") {

        addAdvise(
            "Pregnancy assessment",
            "Ask about possibility of pregnancy; pregnancy testing should be performed when pregnancy is suspected or uncertain."
        );

    }

}


// ============================================================
// RULE R004
// BASELINE CBC
// ============================================================

function R004_CBC() {

    if (data.normalizedGrade === "major") {

        addRequired(
            "CBC",
            "Major/complex surgery."
        );

    }

    if (data.normalizedGrade === "intermediate") {

        addAdvise(
            "CBC" 
            );

    }

    if (
        data.anemia ||
        data.bleeding ||
        data.bloodLoss === "high"
    ) {

        addRequired(
            "CBC",
            "Anemia, bleeding risk, or anticipated high blood loss."
        );

    }

}

// ============================================================
// RULE R004_5
//  ASA3_Minor
// ============================================================

function R004_5_ASA3_Minor() {

    if (
        data.asa >= 3 &&
        data.normalizedGrade === "minor"
    ) {

        addAdvise(
            "CBC",
            "Consider CBC based on clinical assessment and patient-related risk factors."
        );

        addAdvise(
            "ECG",
            "Consider ECG if no ECG result is available from the past 12 months."
        );

        addAdvise(
            "Renal function + electrolytes",
            "Consider renal function testing if the patient is at risk of acute kidney injury (AKI)."
        );

    }

}

// ============================================================
// RULE R005
// KIDNEY FUNCTION + ELECTROLYTES
// ============================================================

function R005_kidney() {

    if (data.asa >= 2) {

        if (
            data.normalizedGrade === "intermediate" ||
            data.normalizedGrade === "major"
        ) {

            addRequired(
                "Renal function + electrolytes",
                "ASA II or higher with intermediate/major surgery."
            );

        }

    }

    
    // Grade 3 + ASA I → clinical assessment for AKI risk
    if (
        data.asa === 1 &&
        data.normalizedGrade === "major"
    ) {

        addAdvise(
            "Kidney function assessment",
            "Consider renal function testing if the patient is at risk of acute kidney injury (AKI)."
        );

    }

}

// ============================================================
// RULE R006
// HEART FAILURE + ELECTROLYTES
// ============================================================

function R006_heartFailure() {

    if (data.heartFailure) {

        if (
            data.normalizedGrade === "intermediate" ||
            data.normalizedGrade === "major"
        ) {

            addRequired(
                "Renal function + electrolytes",
                "Heart failure with intermediate or major surgery."
            );

            
        }

    }

}


// ============================================================
// RULE R007
// ECG
// ============================================================

function R007_ECG() {

    const cardiovascularDisease =
        data.cad ||
        data.heartFailure ||
        data.arrhythmia ||
        data.valvular;

    const intermediateOrMajor =
        data.normalizedGrade === "intermediate" ||
        data.normalizedGrade === "major";

    // =========================
    // REQUIRED
    // =========================

    if (data.asa >= 3 && intermediateOrMajor) {

        addRequired(
            "ECG",
            "ASA III/IV undergoing intermediate or major surgery."
        );

        return;
    }

    if (
        data.asa === 2 &&
        cardiovascularDisease &&
        intermediateOrMajor
    ) {

        addRequired(
            "ECG",
            "ASA II with cardiovascular disease undergoing intermediate or major surgery."
        );

        return;
    }
if (
    data.asa === 2 &&
    data.age >= 65 &&
    data.normalizedGrade === "intermediate"
) {

    addAdvise(
        "ECG",
        "Consider ECG in patients aged 65 years or older undergoing intermediate surgery."
    );

}
    // =========================
    // ADVISE
    // =========================

    if (
        data.age > 65 &&
        data.normalizedGrade === "major"
    ) {

        addAdvise(
            "ECG",
            "Advise ECG if the patient is >65 years and has not had an ECG within the past 12 months."
        );

        return;
    }

    if (cardiovascularDisease) {

        addAdvise(
            "ECG",
            "Advise ECG according to cardiovascular history, symptoms and availability of a recent ECG."
        );
    }
}

// ============================================================
// RULE R008
// COAGULATION
// ============================================================
function R008_coagulation() {

    if (data.bleeding) {

        // All surgical grades
        addRequired(
            "CBC + Platelet count",
            "Known coagulation disorder."
        );

        addRequired(
            "PT / INR",
            "Known coagulation disorder."
        );

        addRequired(
            "aPTT / PTT",
            "Known coagulation disorder."
        );


        // Intermediate and major surgery
        if (
            data.normalizedGrade === "intermediate" ||
            data.normalizedGrade === "major"
        ) {

            addAdvise(
                "Fibrinogen",
                "Consider fibrinogen measurement according to the type and severity of the coagulation disorder and the expected blood loss."
            );

            addAdvise(
                "Hematology consultation",
                "Consider hematology consultation for perioperative hemostatic planning."
            );
        }


        // Major surgery
        if (data.normalizedGrade === "major") {

            addAction(
                "Perioperative hemostatic planning",
                "Establish a specific perioperative hemostatic plan based on the type of coagulation disorder, bleeding history, current treatment, and planned surgery."
            );
        }

    }
}
// ============================================================
// RULE R009
// ALBUMIN
// ============================================================

function R009_albumin() {

    if (
        data.liver &&
        (
            data.normalizedGrade === "intermediate" ||
            data.normalizedGrade === "major"
        )
    ) {

        addRequired(
            "Albumin",
            "Chronic liver disease/cirrhosis with intermediate or major surgery."
        );

    }

}


// ============================================================
// RULE R010
// ANEMIA
// ============================================================

function R010_anemia() {

    if (data.anemia) {

        addRequired(
            "CBC",
            "Known anemia."
        );

        addAdvise(
            "Anemia evaluation",
            "Determine cause, severity and chronicity before elective major surgery."
        );

        addAction(
            "Hematology consultation if newly diagnosed or unexplained anemia",
            "Newly diagnosed, significant or unexplained anemia may require specialist evaluation."
        );

    }

}


// ============================================================
// RULE R011
// HIGH BLOOD LOSS
// ============================================================

function R011_bloodLoss() {

    if (data.bloodLoss === "high") {

        addRequired(
            "CBC",
            "Expected blood loss >1000 mL."
        );

        addAdvise(
            "Type & Screen / Crossmatch",
            "High anticipated blood loss."
        );

    }

}


// ============================================================
// RULE R013
// THORACIC SURGERY
// ============================================================

function R013_thoracic() {

    if (data.surgicalType === "thoracic") {

        addRequired(
            "Spirometry",
            "Thoracic surgery."
        );

        addRequired(
            "DLCO",
            "Thoracic surgery."
        );

    }

}


// ============================================================
// RULE R014
// UNCONTROLLED / EXACERBATED RESPIRATORY DISEASE
// ============================================================
//
// This rule does NOT infer uncontrolled disease from ASA.
// It requires clinical assessment on Page 4.
// Therefore the action is advisory rather than automatically
// assuming uncontrolled status.
// ============================================================

function R014_respiratoryAction() {

    if (data.respiratory) {

        // Respiratory assessment for major surgery
        if (
            data.asa >= 3 &&
            data.normalizedGrade === "major"
        ) {

            addAction(
                "Respiratory consultation",
                "Consider pulmonary consultation when respiratory disease is clinically significant or inadequately optimized."
            );

            if (data.urgency === "elective") {

                addAction(
                    "Optimize respiratory condition before elective surgery",
                    "Elective major surgery may need postponement when active respiratory disease is not adequately controlled."
                );

            }
        }


        // Spirometry
        if (
            data.normalizedGrade === "intermediate" ||
            data.normalizedGrade === "major" ||
            data.mets === "poor" ||
            data.mets === "unknown"
        ) {

            addAdvise(
                "Spirometry",
                "Consider spirometry in patients with respiratory disease when pulmonary function assessment may help optimize perioperative management."
            );

        }


        // Chest X-ray
        if (
            data.asa >= 3 &&
            data.normalizedGrade === "major"
        ) {

            addAdvise(
                "Chest X-ray",
                "Consider chest X-ray when clinically indicated in patients with significant respiratory disease undergoing major surgery."
            );

        }


        // ABG
        if (
            data.asa >= 3 &&
            data.normalizedGrade === "major" &&
            (
                data.mets === "poor" ||
                data.mets === "unknown"
            )
        ) {

            addAdvise(
                "ABG",
                "Consider arterial blood gas analysis when severe respiratory impairment, hypoxemia, or hypercapnia is suspected."
            );

        }

    }

}
// ============================================================
// RULE R015
// OBESITY / OSA
// ============================================================

function R015_obesityOSA() {

    if (data.bmi >= 40) {

        addAdvise(
            "OSA assessment",
            "BMI ≥40 kg/m²: screen for obstructive sleep apnea, for example with STOP-BANG."
        );

    }

}


// ============================================================
// RULE R016
// BMI >40 / ADDITIONAL METABOLIC ASSESSMENT
// ============================================================

function R016_obesityLabs() {

    if (data.bmi > 40) {

        addAdvise(
            "Liver function tests",
            "Severe obesity may be associated with metabolic dysfunction-associated steatotic liver disease and other liver abnormalities."
        );

    }

}

// ============================================================
// RULE R017
// CORONARY ARTERY DISEASE (CAD)
// Stable CAD / No active cardiac symptoms
// ============================================================

function R017_CAD() {

    if (data.cad) {

        if (
            (
                data.normalizedGrade === "intermediate" ||
                data.normalizedGrade === "major"
            ) &&
            (
                data.mets === "poor" ||
                data.mets === "unknown"
            )
        ) {

            addAdvise(
                "Stress testing",
                "Consider stress testing if the result is expected to change management."
            );

            addAdvise(
                "Cardiology consultation",
                "Consider cardiology consultation in patients with stable coronary artery disease undergoing intermediate or major surgery with poor or unknown functional capacity."
            );

        }

    }

}
// ============================================================
// RULE R018
// HEART FAILURE
// ============================================================

function R018_HF() {

    if (data.heartFailure) {

        addAction(
            "Assess heart failure stability",
            "Proceed only after assessment of current symptoms, volume status and clinical stability."
        );
 if (
            data.normalizedGrade === "intermediate" ||
            data.normalizedGrade === "major"
        ) {

            addAdvise(
                "BNP / NT-proBNP",
                "Preoperative cardiac biomarker assessment and abnormal threshold: BNP >92 pg/mL or NT-proBNP ≥300 pg/mL."
            );

        }
        if (
            data.mets === "poor" ||
            data.mets === "unknown"
        ) {

            addAdvise(
                "Cardiac consultation",
                "Heart failure with poor or unknown functional capacity."
            );

        }

    }

}


// ============================================================
// RULE R019
// ARRHYTHMIA
// ============================================================

function R019_arrhythmia() {

    if (data.arrhythmia) {

       addAdvise(
        "Cardiology consultation",
        "Consider for new, symptomatic arrhythmia before elective surgery."
    );
        addAction(
            "Assess rhythm stability and rate control",
            "Perioperative arrhythmia management should be based on current rhythm, symptoms and hemodynamic stability."
        );

    }

}


// ============================================================
// RULE R020
// VALVULAR DISEASE
// ============================================================

function R020_valvular() {

    if (data.valvular) {

        addAction(
    "Valvular heart disease reassessment",
    "If valvular disease has worsened, symptoms have changed, or echocardiography has not been performed within the past year, consider repeat echocardiographic assessment before elective surgery."
);
        // ----------------------------------------------------
        // Echocardiography
        // Grade 2 or 3
        // OR poor/unknown METs
        // ----------------------------------------------------

        if (
            data.normalizedGrade === "intermediate" ||
            data.normalizedGrade === "major" ||
            data.mets === "poor" ||
            data.mets === "unknown"
        ) {

            addAdvise(
                "Echocardiography",
                "Consider echocardiographic assessment in patients with known valvular heart disease before non-cardiac surgery."
            );

        }


        // ----------------------------------------------------
        // Echocardiography
        // ASA III + Grade 1
        // ----------------------------------------------------

        if (
            data.asa === 3 &&
            data.normalizedGrade === "minor"
        ) {

            addAdvise(
                "Echocardiography",
                "Consider echocardiographic assessment in patients with valvular heart disease who are ASA III undergoing minor surgery."
            );

        }


        // ----------------------------------------------------
        // Cardiology consultation
        // Grade 3 + poor/unknown METs
        // OR Grade 2 + ASA III + poor/unknown METs
        // ----------------------------------------------------

        if (
            (
                data.normalizedGrade === "major" &&
                (
                    data.mets === "poor" ||
                    data.mets === "unknown"
                )
            ) ||
            (
                data.normalizedGrade === "intermediate" &&
                data.asa === 3 &&
                (
                    data.mets === "poor" ||
                    data.mets === "unknown"
                )
            )
        ) {

            addAdvise(
                "Cardiology consultation",
                "Consider cardiology consultation in patients with valvular heart disease undergoing major surgery with poor or unknown functional capacity, or intermediate surgery with ASA III and poor or unknown functional capacity."
            );

        }

    }

}


// ============================================================
// RULE R021
// CVA
// ============================================================

function R021_CVA() {

    if (data.cva) {

        // Minor surgery
        if (data.normalizedGrade === "minor") {
            // No specific tests
        }


        // Mild surgery
        if (data.normalizedGrade === "mild") {

            addAdvise(
                "CBC",
                "Consider CBC in patients with a history of cerebrovascular disease undergoing mild surgery."
            );

            addAdvise(
                "ECG",
                "Consider preoperative ECG in patients with a history of cerebrovascular disease undergoing mild surgery."
            );
        }


        // Intermediate surgery
        if (data.normalizedGrade === "intermediate") {

            addRequired(
                "CBC",
                "History of cerebrovascular disease with intermediate surgery."
            );

            addRequired(
                "Renal function + electrolytes",
                "History of cerebrovascular disease with intermediate surgery."
            );

            addRequired(
                "ECG",
                "History of cerebrovascular disease with intermediate surgery."
            );
        }


        // Major surgery
        if (data.normalizedGrade === "major") {

            addRequired(
                "CBC",
                "History of cerebrovascular disease with major surgery."
            );

            addRequired(
                "Renal function + electrolytes",
                "History of cerebrovascular disease with major surgery."
            );

            addRequired(
                "ECG",
                "History of cerebrovascular disease with major surgery."
            );
        }


        // Poor or unknown functional capacity
        if (
            (
                data.normalizedGrade === "intermediate" ||
                data.normalizedGrade === "major"
            ) &&
            (
                data.mets === "poor" ||
                data.mets === "unknown"
            )
        ) {

            addAdvise(
                "Neurology consultation",
                "Consider neurology consultation in patients with previous cerebrovascular disease and poor or unknown functional capacity undergoing intermediate or major surgery."
            );

            addAdvise(
                "Echocardiography",
                "Consider echocardiographic assessment in patients with previous cerebrovascular disease and poor or unknown functional capacity undergoing intermediate or major surgery."
            );
        }


        // Anticoagulant therapy
        if (
            data.anticoagulant &&
            (
                data.normalizedGrade === "intermediate" ||
                data.normalizedGrade === "major"
            )
        ) {

            addAdvise(
                "PT / PTT / INR",
                "Consider coagulation testing in patients receiving anticoagulant therapy undergoing intermediate or major surgery."
            );
        }
    }
}
// ============================================================
// RULE R022
// STRESS TEST
// ============================================================
//
// IMPORTANT:
// NOT triggered by BMI alone.
// NOT triggered by CAD alone.
// NOT triggered by Grade 3 alone.
//
// Requires poor/unknown METs + elevated clinical/surgical risk.
// ============================================================

function R022_stressTest() {

    const poorFunctionalCapacity =
        data.mets === "poor" ||
        data.mets === "unknown";

    const cardiovascularRisk =
        data.cad ||
        data.heartFailure ||
        data.cva ||
        data.asa >= 3;

    const elevatedRiskSurgery =
        data.normalizedGrade === "major";

    if (
        poorFunctionalCapacity &&
        cardiovascularRisk &&
        elevatedRiskSurgery
    ) {

        addAdvise(
            "Stress testing",
            "Consider only after formal perioperative cardiovascular risk assessment in a patient with poor/unknown functional capacity and elevated perioperative risk."
        );

    }

}



// ============================================================
// RULE R024
// SMOKING
// ============================================================

function R024_smoking() {

    if (data.smoking) {

        addAdvise(
            "Respiratory risk assessment",
            "Smoking history should be incorporated into perioperative respiratory assessment."
        );

    }

}


// ============================================================
// RULE R025
// CKD
// ============================================================

function R025_CKD() {

    if (data.ckd) {

        // ----------------------------------------------------
        // Renal function + electrolytes
        // Grade 2 or 3
        // OR poor/unknown METs
        // ----------------------------------------------------

        if (
            data.normalizedGrade === "intermediate" ||
            data.normalizedGrade === "major" ||
            data.mets === "poor" ||
            data.mets === "unknown"
        ) {

            addRequired(
                "Renal function + eGGR + electrolytes",
                "Chronic kidney disease with intermediate or major surgery, or poor/unknown functional capacity."
            );

        }


        // ----------------------------------------------------
        // Grade 2 → ECG Advice
        // ----------------------------------------------------

        if (
            data.normalizedGrade === "intermediate"
        ) {

            addAdvise(
                "ECG",
                "Advise preoperative ECG in patients with chronic kidney disease undergoing intermediate surgery."
            );

        }

addAction(
    "Dialysis and preoperative electrolyte assessment",
    "Perform dialysis 12–24 hours before surgery when appropriate and recheck serum sodium and potassium on the morning of surgery."
);
        // ----------------------------------------------------
        // Grade 3 → ECG Required
        // ----------------------------------------------------

        if (
            data.normalizedGrade === "major"
        ) {

            addRequired(
                "ECG",
                "Chronic kidney disease with major surgery."
            );

        }

    }

}
// ============================================================
// RULE R026
// LIVER DISEASE
// ============================================================

function R026_liver() {

    if (data.liver) {

        // ----------------------------------------------------
        // Minor surgery
        // ----------------------------------------------------

        if (data.normalizedGrade === "minor") {

            addAdvise(
                "CBC",
                "Consider CBC based on clinical assessment and patient-related risk factors."
            );

        }


        // ----------------------------------------------------
        // Mild surgery
        // ----------------------------------------------------

        if (data.normalizedGrade === "mild") {

            addRequired(
                "CBC",
                "Liver disease with mild surgery."
            );

            addRequired(
                "Renal function + electrolytes",
                "Liver disease with mild surgery."
            );

            addAdvise(
                "LFT",
                "Consider liver function assessment in patients with liver disease undergoing mild surgery."
            );

        }


        // ----------------------------------------------------
        // Intermediate surgery
        // ----------------------------------------------------

        if (data.normalizedGrade === "intermediate") {

            addRequired(
                "CBC",
                "Liver disease with intermediate surgery."
            );

            addRequired(
                "Renal function + electrolytes",
                "Liver disease with intermediate surgery."
            );

            addAdvise(
                "LFT",
                "Consider liver function assessment in patients with liver disease undergoing intermediate surgery."
            );

            addAdvise(
                "PT / PTT / INR",
                "Consider coagulation testing in patients with chronic liver disease undergoing intermediate surgery."
            );

        }


        // ----------------------------------------------------
        // Major surgery
        // ----------------------------------------------------

        if (data.normalizedGrade === "major") {

            addRequired(
                "CBC",
                "Liver disease with major surgery."
            );

            addRequired(
                "Renal function + electrolytes",
                "Liver disease with major surgery."
            );

            addAdvise(
                "LFT",
                "Consider liver function assessment in patients with liver disease undergoing major surgery."
            );

            addAdvise(
                "PT / PTT / INR",
                "Consider coagulation testing in patients with chronic liver disease undergoing major surgery."
            );

        }

    }

}// ============================================================
// RULE R027
// THYROID
// ============================================================

function R027_thyroid() {

    if (data.thyroid) {

        addAdvise(
            "Thyroid function assessment",
            "Assess when clinically indicated by symptoms, known thyroid disease or inadequate recent control."
        );

    }

}


// ============================================================
// RULE R028
// CARDIAC SURGERY
// ============================================================

function R028_cardiacSurgery() {

    if (data.surgicalType === "cardiac") {

        addAction(
            "Specialized cardiac surgical pathway",
            "Cardiac surgery requires institution-specific cardiac anesthesia and cardiac surgery assessment."
        );

    }

}


// ============================================================
// RULE R029
// NEUROSURGERY
// ============================================================

function R029_neurosurgery() {

    if (data.surgicalType === "neurosurgery") {

        addAction(
            "Neurosurgical anesthesia pathway",
            "Apply procedure-specific neurosurgical preoperative assessment."
        );

    }

}


// ============================================================
// RULE R030
// EMERGENCY SURGERY
// ============================================================

function R030_emergency() {

    if (data.urgency === "emergency") {

        addAction(
            "Urgent perioperative assessment",
            "Routine elective-surgery testing recommendations should not delay emergency surgery."
        );

    }

}


// ============================================================
// RULE R031
// ELECTIVE SURGERY + ACTIVE CONDITION
// ============================================================

function R031_electiveRisk() {

    if (data.urgency === "elective") {

        if (
            data.heartFailure ||
            data.respiratory ||
            data.cad
        ) {

            addAction(
                "Confirm clinical stability before elective surgery",
                "Active or unstable cardiovascular/respiratory disease should be assessed and optimized before elective surgery."
            );

        }

    }

}


// ============================================================
// RUN ALL RULES
// ============================================================

const rules = [

    R001_age,
    R001_2_hypertension,
    R002_diabetes,
    R003_pregnancy,
    R004_CBC,
    R004_5_ASA3_Minor,
    R005_kidney,
    R006_heartFailure,
    R007_ECG,
    R008_coagulation,
    R009_albumin,
    R010_anemia,
    R011_bloodLoss,
    R013_thoracic,
    R014_respiratoryAction,
    R015_obesityOSA,
    R016_obesityLabs,
    R017_CAD,
    R018_HF,
    R019_arrhythmia,
    R020_valvular,
    R021_CVA,
    R022_stressTest,
   
    R024_smoking,
    R025_CKD,
    R026_liver,
    R027_thyroid,
    R028_cardiacSurgery,
    R029_neurosurgery,
    R030_emergency,
    R031_electiveRisk

];

rules.forEach(rule => rule());


// ============================================================
// DEDUPLICATE
// ============================================================

results.required = uniqueResults(results.required);
results.advise = uniqueResults(results.advise);
results.actions = uniqueResults(results.actions);


// ============================================================
// SORT
// ============================================================

results.required.sort((a, b) =>
    a.test.localeCompare(b.test)
);

results.advise.sort((a, b) =>
    a.test.localeCompare(b.test)
);

results.actions.sort((a, b) =>
    a.action.localeCompare(b.action)
);


// ============================================================
// SAVE RESULTS
// ============================================================

localStorage.setItem(
    "investigationResults",
    JSON.stringify(results)
);


// ============================================================
// DISPLAY
// ============================================================

function displayResults() {

    const container =
        document.getElementById("results");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    // ----------------------------------------
    // REQUIRED
    // ----------------------------------------

    const requiredSection =
        document.createElement("div");

    requiredSection.className =
        "result-section required-section";

    requiredSection.innerHTML =
        "<h2>REQUIRED</h2>";

    results.required.forEach(item => {

        const row =
            document.createElement("div");

        row.className =
            "result-row";

        row.innerHTML = `
            <strong>${item.test}</strong>
            <p>${item.reason}</p>
        `;

        requiredSection.appendChild(row);

    });

    container.appendChild(requiredSection);


    // ----------------------------------------
    // ADVISE
    // ----------------------------------------

    const adviseSection =
        document.createElement("div");

    adviseSection.className =
        "result-section advise-section";

    adviseSection.innerHTML =
        "<h2>ADVISE</h2>";

    results.advise.forEach(item => {

        const row =
            document.createElement("div");

        row.className =
            "result-row";

        row.innerHTML = `
            <strong>${item.test}</strong>
            <p>${item.reason}</p>
        `;

        adviseSection.appendChild(row);

    });

    container.appendChild(adviseSection);


    // ----------------------------------------
    // CLINICAL ACTION
    // ----------------------------------------

    const actionSection =
        document.createElement("div");

    actionSection.className =
        "result-section action-section";

    actionSection.innerHTML =
        "<h2>CLINICAL ACTION</h2>";

    results.actions.forEach(item => {

        const row =
            document.createElement("div");

        row.className =
            "result-row";

        row.innerHTML = `
            <strong>${item.action}</strong>
            <p>${item.reason}</p>
        `;

        actionSection.appendChild(row);

    });

    container.appendChild(actionSection);

}


// ============================================================
// START
// ============================================================

displayResults();


// ============================================================
// DEBUG
// ============================================================

console.log(
    "Preoperative Rule Engine Version 5",
    data,
    results
);
function checkActiveCardiacCondition() {

    const activeCardiac =
        localStorage.getItem("activeCardiac");

    const activeCardiacType =
        localStorage.getItem("activeCardiacType");

    const urgency =
        localStorage.getItem("urgency");

    if (activeCardiac !== "yes") {
        return;
    }


    const alertBox =
        document.getElementById("activeCardiacAlert");

    const conditionText =
        document.getElementById(
            "activeCardiacConditionText"
        );

    const actionText =
        document.getElementById(
            "activeCardiacAction"
        );


    alertBox.style.display = "block";


    let condition = "Active cardiac condition";

    if (activeCardiacType === "acs") {

        condition =
            "Acute Coronary Syndrome (ACS)";

    }

    else if (activeCardiacType === "arrhythmia") {

        condition =
            "Unstable / Symptomatic Arrhythmia";

    }

    else if (activeCardiacType === "heartFailure") {

        condition =
            "Decompensated Heart Failure";

    }

    else if (activeCardiacType === "other") {

        condition =
            "Other Unstable Cardiac Condition";

    }


    conditionText.innerHTML =
        `<strong>${condition}</strong> has been identified.`;


    // ------------------------------------------
    // ELECTIVE
    // ------------------------------------------

    if (urgency === "elective") {

        actionText.innerHTML =
            `Defer elective surgery pending
            cardiovascular evaluation and optimization.
            Cardiology consultation and multidisciplinary
            team discussion are advised.`;

    }


    // ------------------------------------------
    // URGENT
    // ------------------------------------------

    else if (urgency === "urgent") {

        actionText.innerHTML =
            `Urgent cardiovascular evaluation and
            optimization are advised. Multidisciplinary
            discussion regarding the timing and necessity
            of surgery is recommended.`;

    }


    // ------------------------------------------
    // EMERGENCY
    // ------------------------------------------

    else if (urgency === "emergency") {

        actionText.innerHTML =
            `Proceed with immediate cardiovascular and
            anesthesia assessment, stabilization and
            multidisciplinary perioperative management.
            Emergency surgery should not be delayed
            solely for elective cardiac testing.`;

    }

}
console.log("Active Cardiac:", localStorage.getItem("activeCardiac"));
console.log("Cardiac Type:", localStorage.getItem("activeCardiacType"));
const activeCardiac =
    localStorage.getItem("activeCardiac");

if (activeCardiac === "yes") {

    const alertBox =
        document.getElementById("activeCardiacAlert");

    if (alertBox) {
        alertBox.style.display = "block";
    }

}
const activeCardiacType =
    localStorage.getItem("activeCardiacType");

const conditionText =
    document.getElementById(
        "activeCardiacConditionText"
    );

if (conditionText) {

    if (activeCardiacType === "acs") {

        conditionText.innerHTML =
            "<strong>Acute Coronary Syndrome (ACS)</strong> has been identified.";

    }

    else if (activeCardiacType === "arrhythmia") {

        conditionText.innerHTML =
            "<strong>Unstable / Symptomatic Arrhythmia</strong> has been identified.";

    }

    else if (activeCardiacType === "heartFailure") {

        conditionText.innerHTML =
            "<strong>Decompensated Heart Failure</strong> has been identified.";

    }

    else if (activeCardiacType === "other") {

        conditionText.innerHTML =
            "<strong>Other Unstable Cardiac Condition</strong> has been identified.";

    }

}
const actionText =
    document.getElementById(
        "activeCardiacAction"
    );

if (
    actionText &&
    localStorage.getItem("activeCardiac") === "yes"
) {

    actionText.innerHTML =
        "Defer surgery, obtain Cardiology consultation, and perform appropriate cardiovascular evaluation and optimization before proceeding.";

}

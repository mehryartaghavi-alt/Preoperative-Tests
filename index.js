const activeCardiacRadios =
    document.querySelectorAll(
        'input[name="activeCardiac"]'
    );

const activeCardiacOptions =
    document.getElementById(
        "activeCardiacOptions"
    );


activeCardiacRadios.forEach(function (radio) {

    radio.addEventListener(
        "change",
        function () {

            if (this.value === "yes") {

                activeCardiacOptions.style.display =
                    "block";

            } else {

                activeCardiacOptions.style.display =
                    "none";

                document
                    .querySelectorAll(
                        'input[name="activeCardiacType"]'
                    )
                    .forEach(function (checkbox) {

                        checkbox.checked = false;

                    });

            }

        }
    );

});
function showAirwayHelp() {

    alert(
`Airway Assessment

A systematic airway assessment should include:

• Mallampati classification
• Mouth opening
• Thyromental distance
• Neck mobility
• Dentition
• Jaw protrusion
• Facial and mandibular abnormalities
• Previous difficult airway or intubation history`
    );

}


function showOSAHelp() {

    alert(
`OSA Screening – STOP-BANG

S – Snoring
T – Tiredness
O – Observed apnea
P – High blood Pressure
B – BMI >35 kg/m²
A – Age >50 years
N – Neck circumference >40 cm
G – Gender male

STOP-BANG is a screening tool and does not by itself establish a diagnosis of OSA.`
    );

}
document
    .getElementById("startBtn")
    .addEventListener("click", function () {

        window.location.href = "patient.html";

    });

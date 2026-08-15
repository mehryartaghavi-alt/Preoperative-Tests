document.getElementById("nextBtn")
    .addEventListener("click", function () {

        const type =
            document.getElementById("surgicalType").value;

        const grade =
            document.getElementById("grade").value;

        const blood =
            document.getElementById("bloodLoss").value;

        const urgency =
            document.getElementById("urgency").value;


        if (
            type === "" ||
            grade === "" ||
            blood === "" ||
            urgency === ""
        ) {

            alert("Please complete all fields.");

            return;
        }


        const surgeryData = {

            surgicalType: type,

            grade: grade,

            bloodLoss: blood,

            urgency: urgency

        };


        localStorage.setItem(
            "surgeryData",
            JSON.stringify(surgeryData)
        );


        window.location.href =
            "investigations.html";

    });

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
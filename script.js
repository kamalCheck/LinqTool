let originalData = [];

function loadData() {
    const input = document.getElementById("jsonInput").value;

    try {
        originalData = JSON.parse(input);

        if (!Array.isArray(originalData)) {
            alert("JSON must be an array");
            return;
        }

        populateFields(originalData[0]);
        document.getElementById("filterSection").style.display = "block";

    } catch (error) {
        alert("Invalid JSON");
    }
}

function populateFields(obj) {
    const fieldSelect = document.getElementById("fieldSelect");
    fieldSelect.innerHTML = "";

    Object.keys(obj).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.text = key;
        fieldSelect.appendChild(option);
    });
}

function applyFilter() {
    const field = document.getElementById("fieldSelect").value;
    const operator = document.getElementById("operatorSelect").value;
    const value = document.getElementById("valueInput").value;

    const filtered = originalData.filter(item => {
        const itemValue = item[field];

        switch (operator) {
            case ">":
                return itemValue > Number(value);
            case "<":
                return itemValue < Number(value);
            case "==":
                return itemValue == value;
        }
    });

    document.getElementById("resultOutput").textContent =
        JSON.stringify(filtered, null, 2);

    generateLinq(field, operator, value);
}

function generateLinq(field, operator, value) {
    const code = `data.Where(x => x.${field} ${operator} ${value});`;

    document.getElementById("linqOutput").textContent = code;
}
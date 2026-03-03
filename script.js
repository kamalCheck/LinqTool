let originalData = [];

/* ================= TABS ================= */

function showTab(tabId, button) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

    document.getElementById(tabId).style.display = "block";
    button.classList.add("active");
}

/* ================= LINQ ================= */

function loadData() {
    const input = document.getElementById("jsonInput").value;

    try {
        originalData = JSON.parse(input);

        if (!Array.isArray(originalData)) {
            alert("JSON must be an array");
            return;
        }

        populateFields(originalData[0]);
        document.getElementById("linqSection").style.display = "block";

    } catch (error) {
        alert("Invalid JSON");
    }
}

function populateFields(obj) {

    const fieldSelect = document.getElementById("fieldSelect");
    const orderSelect = document.getElementById("orderFieldSelect");
    const selectFieldsDiv = document.getElementById("selectFields");

    fieldSelect.innerHTML = "";
    orderSelect.innerHTML = '<option value="">-- None --</option>';
    selectFieldsDiv.innerHTML = "";

    Object.keys(obj).forEach(key => {

        const option = document.createElement("option");
        option.value = key;
        option.text = key;
        fieldSelect.appendChild(option);

        const orderOption = document.createElement("option");
        orderOption.value = key;
        orderOption.text = key;
        orderSelect.appendChild(orderOption);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = key;
        checkbox.className = "select-checkbox";

        const label = document.createElement("label");
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + key));

        selectFieldsDiv.appendChild(label);
        selectFieldsDiv.appendChild(document.createElement("br"));
    });
}

function applyFilter() {

    const field = document.getElementById("fieldSelect").value;
    const operator = document.getElementById("operatorSelect").value;
    const value = document.getElementById("valueInput").value;

    const orderField = document.getElementById("orderFieldSelect").value;
    const orderDirection = document.getElementById("orderDirectionSelect").value;

    let filtered = originalData.filter(item => {
        const itemValue = item[field];

        switch (operator) {
            case ">": return itemValue > Number(value);
            case "<": return itemValue < Number(value);
            case "==": return itemValue == value;
        }
    });

    if (orderField) {
        filtered = [...filtered].sort((a, b) => {
            if (a[orderField] < b[orderField]) return orderDirection === "asc" ? -1 : 1;
            if (a[orderField] > b[orderField]) return orderDirection === "asc" ? 1 : -1;
            return 0;
        });
    }

    const selectedFields = Array.from(
        document.querySelectorAll(".select-checkbox:checked")
    ).map(cb => cb.value);

    let finalResult = filtered;

    if (selectedFields.length > 0) {
        finalResult = filtered.map(item => {
            const obj = {};
            selectedFields.forEach(field => {
                obj[field] = item[field];
            });
            return obj;
        });
    }

    document.getElementById("resultOutput").textContent =
        JSON.stringify(finalResult, null, 2);

    generateLinq(field, operator, value, selectedFields, orderField, orderDirection);
}

function generateLinq(field, operator, value, selectedFields, orderField, orderDirection) {

    let code = `data.Where(x => x.${field} ${operator} ${value})`;

    if (orderField) {
        if (orderDirection === "asc") {
            code += `\n    .OrderBy(x => x.${orderField})`;
        } else {
            code += `\n    .OrderByDescending(x => x.${orderField})`;
        }
    }

    if (selectedFields.length > 0) {
        const projection = selectedFields.map(f => `x.${f}`).join(", ");
        code += `\n    .Select(x => new { ${projection} })`;
    }

    code += ";";

    document.getElementById("linqOutput").textContent = code;
}

/* ================= JSON ================= */

function formatJSON() {
    try {
        const parsed = JSON.parse(document.getElementById("jsonInputArea").value);
        document.getElementById("jsonOutputArea").textContent =
            JSON.stringify(parsed, null, 2);
    } catch (e) {
        showError(e);
    }
}

function minifyJSON() {
    try {
        const parsed = JSON.parse(document.getElementById("jsonInputArea").value);
        document.getElementById("jsonOutputArea").textContent =
            JSON.stringify(parsed);
    } catch (e) {
        showError(e);
    }
}

function validateJSON() {
    try {
        JSON.parse(document.getElementById("jsonInputArea").value);
        document.getElementById("jsonOutputArea").textContent = "Valid JSON ✅";
    } catch (e) {
        showError(e);
    }
}

function copyOutput() {
    const output = document.getElementById("jsonOutputArea").textContent;
    if (!output) return;
    navigator.clipboard.writeText(output);
}

function clearJSON() {
    document.getElementById("jsonInputArea").value = "";
    document.getElementById("jsonOutputArea").textContent = "";
}

function downloadJSON() {
    const output = document.getElementById("jsonOutputArea").textContent;
    if (!output) return;

    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();

    URL.revokeObjectURL(url);
}

function showError(error) {
    document.getElementById("jsonOutputArea").textContent =
        "Invalid JSON ❌\n\n" + error.message;
}
function copyLinq() {
    const code = document.getElementById("linqOutput").textContent;
    if (!code) return;
    navigator.clipboard.writeText(code);
}
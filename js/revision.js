// Data structure for different categories
const data = {
    primary: {
        "Lower Primary": ["Primary 1", "Primary 2", "Primary 3"],
        "Upper Primary": ["Primary 4", "Primary 5", "Primary 6"]
    },
    ordinary: {
        "Ordinary Level": ["Senior 1", "Senior 2", "Senior 3"]
    },
    advanced: {
        "TTC": {
            "Languages Education": ["Year 1", "Year 2", "Year 3"],
            "Science and Mathematics Education": ["Year 1", "Year 2", "Year 3"],
            "Social and Religious Education": ["Year 1", "Year 2", "Year 3"],
            "Early Childhood and Lower Primary Education": ["Year 1", "Year 2", "Year 3"]
        },
        "TVET": {
            "Masonry": ["Level 3", "Level 4", "Level 5"],
            "Electricity": ["Level 3", "Level 4", "Level 5"],
            "Hotel & Tourism": ["Level 3", "Level 4", "Level 5"]
        },
        "GSS": {
            "MEG": ["Senior 4", "Senior 5", "Senior 6"],
            "PCB": ["Senior 4", "Senior 5", "Senior 6"],
            "PCM": ["Senior 4", "Senior 5", "Senior 6"],
            "HGL": ["Senior 4", "Senior 5", "Senior 6"],
            "BCG": ["Senior 4", "Senior 5", "Senior 6"],
            "MCB": ["Senior 4", "Senior 5", "Senior 6"]
        },
        "ANP": ["Senior 4", "Senior 5", "Senior 6"]
    }
};

// Select elements
const categorySelect = document.getElementById("category");
const classSelect = document.getElementById("class");
const subjectSelect = document.getElementById("subject");
const combinationSelect = document.getElementById("combination");
const subCombinationSelect = document.getElementById("subCombination");
const nextButton = document.getElementById("nextBtn");
const errorMessage = document.getElementById("errorMsg"); // Error message div

// Hide/show fields based on selection
function resetDropdown(dropdown) {
    dropdown.innerHTML = '<option value="">-- Select --</option>';
    dropdown.style.display = "none";
}

function updateDropdown(dropdown, items) {
    resetDropdown(dropdown);
    if (items && items.length > 0) {
        dropdown.style.display = "block";
        items.forEach(item => {
            let option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            dropdown.appendChild(option);
        });
    }
}

// Function to check if all required selections are made
function validateSelections() {
    let category = categorySelect.value;
    let classSelected = classSelect.value;
    let subjectSelected = subjectSelect.value;
    let combinationSelected = combinationSelect.value;
    let subCombinationSelected = subCombinationSelect.value;

    let isValid = false;

    if (category === "Primary" || category === "Ordinary") {
        isValid = category && classSelected && subjectSelected;
    } else if (category === "Advanced") {
        if (combinationSelected === "ANP") {
            isValid = combinationSelected && classSelected;
        } else {
            isValid = combinationSelected && subCombinationSelected && classSelected;
        }
    }

    if (isValid) {
        errorMessage.style.display = "none";
        nextButton.style.display = "block";
    } else {
        nextButton.style.display = "none";
    }
}

// Handle category selection
categorySelect.addEventListener("change", function () {
    resetDropdown(classSelect);
    resetDropdown(subjectSelect);
    resetDropdown(combinationSelect);
    resetDropdown(subCombinationSelect);
    nextButton.style.display = "none";

    if (this.value === "Primary" || this.value === "Ordinary") {
        updateDropdown(classSelect, Object.keys(data[this.value.toLowerCase()]));
    } else if (this.value === "Advanced") {
        updateDropdown(combinationSelect, Object.keys(data.advanced));
    }

    validateSelections();
});

// Handle class selection for Primary/Ordinary
classSelect.addEventListener("change", function () {
    if (categorySelect.value === "Primary" || categorySelect.value === "Ordinary") {
        updateDropdown(subjectSelect, data[categorySelect.value.toLowerCase()][this.value]);
    }
    validateSelections();
});

// Handle combination selection for Advanced
combinationSelect.addEventListener("change", function () {
    resetDropdown(subCombinationSelect);
    resetDropdown(classSelect);

    if (this.value === "ANP") {
        updateDropdown(classSelect, data.advanced.ANP);
    } else {
        updateDropdown(subCombinationSelect, Object.keys(data.advanced[this.value]));
    }

    validateSelections();
});

// Handle subCombination selection for Advanced
subCombinationSelect.addEventListener("change", function () {
    updateDropdown(classSelect, data.advanced[combinationSelect.value][this.value]);
    validateSelections();
});

// Handle class selection for Advanced
classSelect.addEventListener("change", function () {
    validateSelections();
});

// Handle NEXT button click
nextButton.addEventListener("click", function () {
    let category = categorySelect.value.toLowerCase();
    let selectedClass = classSelect.value.replace(/\s+/g, "").toLowerCase();
    let selectedSubject = subjectSelect.value.replace(/\s+/g, "").toLowerCase();
    let selectedCombination = combinationSelect.value.replace(/\s+/g, "").toLowerCase();
    let selectedSubCombination = subCombinationSelect.value.replace(/\s+/g, "").toLowerCase();

    let url = "";

    if (category === "primary" || category === "ordinary") {
        if (!selectedClass || !selectedSubject) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "Please complete all selections before proceeding.";
            return;
        }
        url = `${selectedClass}_${selectedSubject}.html`;
    } else if (category === "advanced") {
        if (combinationSelect.value === "ANP") {
            if (!selectedClass) {
                errorMessage.style.display = "block";
                errorMessage.textContent = "Please complete all selections before proceeding.";
                return;
            }
            url = `anp_${selectedClass}.html`;
        } else {
            if (!selectedCombination || !selectedSubCombination || !selectedClass) {
                errorMessage.style.display = "block";
                errorMessage.textContent = "Please complete all selections before proceeding.";
                return;
            }
            url = `${selectedCombination}_${selectedSubCombination}_${selectedClass}.html`;
        }
    }

    if (url) {
        window.location.href = url;
    }
});

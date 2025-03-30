// Data structure for different categories
const data = {
    primary: {
        "Lower Primary": ["Primary 1", "Primary 2", "Primary 3"],
        "Upper Primary": ["Primary 4", "Primary 5", "Primary 6"]
    },
    ordinary: {
        "Ordinary Level": {
            "Mathematics": ["Senior 1", "Senior 2", "Senior 3"],
            "Science": ["Senior 1", "Senior 2", "Senior 3"],
            "Social Studies": ["Senior 1", "Senior 2", "Senior 3"],
            "English": ["Senior 1", "Senior 2", "Senior 3"]
        }
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
const subjectSelect = document.getElementById("subject");
const combinationSelect = document.getElementById("combination");
const subCombinationSelect = document.getElementById("subCombination");
const classSelect = document.getElementById("class");
const nextButton = document.getElementById("nextBtn");

// Reset dropdowns
function resetDropdown(dropdown) {
    dropdown.innerHTML = '<option value="">-- Select --</option>';
    dropdown.style.display = "none";
}

// Update dropdowns
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

// Handle category selection
categorySelect.addEventListener("change", function () {
    resetDropdown(subjectSelect);
    resetDropdown(combinationSelect);
    resetDropdown(subCombinationSelect);
    resetDropdown(classSelect);
    nextButton.style.display = "none"; // Hide next button initially

    if (this.value === "Primary") {
        updateDropdown(classSelect, Object.keys(data.primary));
    } else if (this.value === "Ordinary") {
        updateDropdown(classSelect, Object.keys(data.ordinary["Ordinary Level"]));
    } else if (this.value === "Advanced") {
        updateDropdown(combinationSelect, Object.keys(data.advanced));
    }
});

// Handle class selection for Primary and Ordinary Level
classSelect.addEventListener("change", function () {
    resetDropdown(subjectSelect);
    
    if (categorySelect.value === "Primary") {
        updateDropdown(subjectSelect, data.primary[this.value]);
    } else if (categorySelect.value === "Ordinary") {
        updateDropdown(subjectSelect, data.ordinary["Ordinary Level"][this.value]);
    }

    checkIfReadyToProceed();
});

// Handle combination selection for Advanced
combinationSelect.addEventListener("change", function () {
    resetDropdown(subCombinationSelect);
    resetDropdown(classSelect);
    resetDropdown(subjectSelect);

    if (this.value === "ANP") {
        updateDropdown(classSelect, data.advanced.ANP);
    } else {
        updateDropdown(subCombinationSelect, Object.keys(data.advanced[this.value]));
    }
});

// Handle subCombination selection for Advanced
subCombinationSelect.addEventListener("change", function () {
    updateDropdown(classSelect, data.advanced[combinationSelect.value][this.value]);
});

// Handle class selection for Advanced
classSelect.addEventListener("change", checkIfReadyToProceed);

// Check if selections are complete before displaying the next button
function checkIfReadyToProceed() {
    if (
        (categorySelect.value === "Primary" && classSelect.value && subjectSelect.value) ||
        (categorySelect.value === "Ordinary" && classSelect.value && subjectSelect.value) ||
        (categorySelect.value === "Advanced" && combinationSelect.value && 
         ((combinationSelect.value === "ANP" && classSelect.value) || 
         (subCombinationSelect.value && classSelect.value)))
    ) {
        nextButton.style.display = "block";
    } else {
        nextButton.style.display = "none";
    }
}

// Handle NEXT button click
nextButton.addEventListener("click", function () {
    let category = categorySelect.value.toLowerCase();
    let selectedClass = classSelect.value.replace(/\s+/g, "").toLowerCase();
    let selectedSubject = subjectSelect.value ? subjectSelect.value.replace(/\s+/g, "").toLowerCase() : "";
    let selectedCombination = combinationSelect.value.replace(/\s+/g, "").toLowerCase();
    let selectedSubCombination = subCombinationSelect.value.replace(/\s+/g, "").toLowerCase();

    let url = "";

    if (category === "primary" || category === "ordinary") {
        url = `${selectedClass}_${selectedSubject}.html`;
    } else if (category === "advanced") {
        if (combinationSelect.value === "ANP") {
            url = `anp_${selectedClass}.html`;
        } else {
            url = `${selectedCombination}_${selectedSubCombination}_${selectedClass}.html`;
        }
    }

    if (url) {
        window.location.href = url;
    } else {
        alert("Please complete all selections before proceeding.");
    }
});

function assessReadiness() {
    const inputs = {
        householdSize: parseInt(document.getElementById('household-size').value),
        income: parseInt(document.getElementById('income').value),
        aloneTime: parseFloat(document.getElementById('alone-time').value),
        houseSize: parseInt(document.getElementById('house-size').value),
        caretakerAge: parseInt(document.getElementById('caretaker-age').value),
        healthStatus: parseFloat(document.getElementById('health-status').value),
        allergies: document.getElementById('allergies').value === 'yes',
        otherPets: parseInt(document.getElementById('other-pets').value),
        vetDistance: parseFloat(document.getElementById('vet-distance').value),
        caregivers: parseInt(document.getElementById('caregivers').value)
    };

    let probability = 1;
    const decisions = [{name: "Start", probability: probability}];

    // Income
    let incomeFactor;
    if (inputs.income < 10000) {
        incomeFactor = 0.4;
        decisions.push({name: "Too Low Income", probability: probability * incomeFactor});
    } else if (inputs.income < 20000) {
        incomeFactor = 0.8;
        decisions.push({name: "Low Income", probability: probability * incomeFactor});
    } else if (inputs.income < 50000) {
        incomeFactor = 0.95;
        decisions.push({name: "Medium Income", probability: probability * incomeFactor});
    } else {
        incomeFactor = 1;
        decisions.push({name: "High Income", probability: probability * incomeFactor});
    }
    probability *= incomeFactor;

    // Alone Time
    let aloneTimeFactor;
    if (inputs.aloneTime > 22) {
        aloneTimeFactor = 0.4;
        decisions.push({name: "Too Long Alone Time", probability: probability * aloneTimeFactor});
    } else if (inputs.aloneTime > 12) {
        aloneTimeFactor = 0.7;
        decisions.push({name: "Long Alone Time", probability: probability * aloneTimeFactor});
    } else if (inputs.aloneTime > 8) {
        aloneTimeFactor = 0.95;
        decisions.push({name: "Medium Alone Time", probability: probability * aloneTimeFactor});
    } else {
        aloneTimeFactor = 1;
        decisions.push({name: "Short Alone Time", probability: probability * aloneTimeFactor});
    }
    probability *= aloneTimeFactor;

    // House Size
    let houseSizeFactor;
    if (inputs.houseSize < 20) {
        houseSizeFactor = 0.4;
        decisions.push({name: "Inadequate House Size", probability: probability * houseSizeFactor});
    } else if (inputs.houseSize < 50) {
        houseSizeFactor = 0.9;
        decisions.push({name: "Adequate House Size", probability: probability * houseSizeFactor});
    } else {
        houseSizeFactor = 1;
        decisions.push({name: "Very Adequate House Size", probability: probability * houseSizeFactor});
    }
    probability *= houseSizeFactor;

    // Caretaker Age
    let ageFactor;
    if (inputs.caretakerAge < 15) {
        ageFactor = 0.4;
        decisions.push({name: "Too Young Caretaker", probability: probability * ageFactor});
    } else if (inputs.caretakerAge <= 65) {
        ageFactor = 1;
        decisions.push({name: "Adequate Caretaker Age", probability: probability * ageFactor});
    } else if (inputs.caretakerAge <= 90) {
        ageFactor = 0.95;
        decisions.push({name: "Older Caretaker", probability: probability * ageFactor});
    } else {
        ageFactor = 0.9;
        decisions.push({name: "Old Caretaker", probability: probability * ageFactor});
    }
    probability *= ageFactor;

    // Health Status
    let healthFactor;
    if (inputs.healthStatus < 3) {
        healthFactor = 0.4;
        decisions.push({name: "Too Bad Health", probability: probability * healthFactor});
    } else if (inputs.healthStatus < 5) {
        healthFactor = 0.6;
        decisions.push({name: "Bad Health", probability: probability * healthFactor});
    } else if (inputs.healthStatus < 7) {
        healthFactor = 0.9;
        decisions.push({name: "Good Health", probability: probability * healthFactor});
    } else {
        healthFactor = 1;
        decisions.push({name: "Great Health", probability: probability * healthFactor});
    }
    probability *= healthFactor;

    // Allergies
    let allergyFactor = inputs.allergies ? 0.4 : 1;
    decisions.push({name: inputs.allergies ? "Has Allergies" : "No Allergies", probability: probability * allergyFactor});
    probability *= allergyFactor;

    // Vet Distance
    let vetDistanceFactor;
    if (inputs.vetDistance > 120) {
        vetDistanceFactor = 0.4;
        decisions.push({name: "Too Long Vet Distance", probability: probability * vetDistanceFactor});
    } else if (inputs.vetDistance > 50) {
        vetDistanceFactor = 0.75;
        decisions.push({name: "Long Vet Distance", probability: probability * vetDistanceFactor});
    } else if (inputs.vetDistance > 30) {
        vetDistanceFactor = 0.85;
        decisions.push({name: "Medium Vet Distance", probability: probability * vetDistanceFactor});
    } else if (inputs.vetDistance > 20) {
        vetDistanceFactor = 0.95;
        decisions.push({name: "Short Vet Distance", probability: probability * vetDistanceFactor});
    } else {
        vetDistanceFactor = 1;
        decisions.push({name: "Very Short Vet Distance", probability: probability * vetDistanceFactor});
    }
    probability *= vetDistanceFactor;

    // External Caregivers
    let caregiverFactor;
    if (inputs.caregivers < 1) {
        caregiverFactor = 0.7;
        decisions.push({name: "Very Few Caregivers", probability: probability * caregiverFactor});
    } else if (inputs.caregivers = 2) {
        caregiverFactor = 0.9;
        decisions.push({name: "Few Caregivers", probability: probability * caregiverFactor});
    } else {
        caregiverFactor = 1;
        decisions.push({name: "Adequate Caregivers", probability: probability * caregiverFactor});
    }
    probability *= caregiverFactor;

    // Final assessment
    let assessment = "";
    if (probability > 0.8) {
        assessment = "Very Ready for cat ownership!";
    } else if (probability > 0.6) {
        assessment = "Probably Ready for cat ownership, but consider improving some factors.";
    } else if (probability > 0.4) {
        assessment = "You might want to reconsider or improve your situation before getting a cat.";
    } else {
        assessment = "It's not recommended to get a cat at this time. Please address the key factors first.";
    }

    document.getElementById('result').innerHTML = `Readiness Score: ${(probability * 100).toFixed(2)}%<br>${assessment}`;

    // Visualize the decision tree
    visualizeTree(decisions);
}

function visualizeTree(decisions) {
    const width = 700;
    const height = 500;
    const margin = {top: 20, right: 120, bottom: 20, left: 120};

    // Clear previous SVG
    d3.select("#tree-container").selectAll("*").remove();

    const svg = d3.select("#tree-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create hierarchy
    const root = d3.stratify()
        .id((d, i) => i)
        .parentId((d, i) => i > 0 ? i - 1 : null)
        (decisions);

    // Create tree layout
    const treeLayout = d3.tree().size([width, height - 100]);
    const treeData = treeLayout(root);

    // Add links
    const link = svg.selectAll(".link")
        .data(treeData.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y));

    // Add nodes
    const node = svg.selectAll(".node")
        .data(treeData.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add circles to nodes
    node.append("circle")
        .attr("r", 5);

    // Add labels to nodes
    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -8 : 8)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => `${d.data.name} (${(d.data.probability * 100).toFixed(2)}%)`)
        .clone(true).lower()
        .attr("stroke", "white");
}

// Check if D3 is loaded
window.onload = function() {
    if (typeof d3 === 'undefined') {
        console.error("D3 library is not loaded. Please check your internet connection and try again.");
        alert("There was an error loading the visualization library. Please check your internet connection and try again.");
    }
};

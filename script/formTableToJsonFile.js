const { Form } = require('../src/db/models')
const fs = require('fs');
const path = require('path');

async function exportFormsToJson() {
    try {
        // Fetch all entries from the Form table
        const forms = await Form.findAll();

        // Convert the data to JSON string
        const json = JSON.stringify(forms, null, 2);

        // Define the output path
        const outputPath = path.join(__dirname, '../data/review.json');

        // Save the JSON string to a file
        fs.writeFileSync(outputPath, json, 'utf8');

        console.log(`Data successfully saved to ${outputPath}`);
    } catch (error) {
        console.error('Error fetching data from Form table or saving to file:', error);
    }
}

// Run the function
exportFormsToJson();

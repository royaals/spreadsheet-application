# Spreadsheet Application

## Overview

This project is an spreadsheet application built with Next.js. It provides a user-friendly interface for creating, editing, and analyzing spreadsheet data with features similar to popular spreadsheet software like Microsoft Excel or Google Sheets.

## Features

- Create and edit spreadsheets with a familiar grid interface
- Import and export spreadsheets in Excel (.xlsx, .xls) and CSV formats
- Perform mathematical operations (SUM, AVERAGE, MAX, MIN, COUNT)
- Apply data quality functions (TRIM, UPPER, LOWER, REMOVE DUPLICATES)
- Find and replace functionality
- Cell formatting options (bold, italic, underline, text color)
- Generate charts from selected data
- Add and delete rows and columns
- Responsive design for various screen sizes

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- XLSX library for spreadsheet file handling
- Chart.js for data visualization

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/royaals/spreadsheet-application.git
   cd spreadsheet-application
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to \`http://localhost:3000\` to see the application running.

## Usage

1. **Creating a New Spreadsheet**: When you open the application, you'll see an empty spreadsheet grid.

2. **Importing Data**: Click the "Load Spreadsheet" button to import an existing Excel or CSV file.

3. **Editing Cells**: Click on any cell to edit its content. You can use the formatting buttons (Bold, Italic, Underline, Text Color) to style the cell text.

4. **Using Functions**:
   - Select a column and row range using the input fields at the top of the page.
   - Choose a mathematical or data quality function from the respective tabs.
   - Click the function button to apply it to the selected range.

5. **Adding/Deleting Rows and Columns**: Use the "Add Row", "Delete Row", "Add Column", and "Delete Column" buttons to modify the spreadsheet structure.

6. **Generating Charts**: Select a range of numeric data and click the "Generate Chart" button to create a visual representation of the data.

7. **Find and Replace**: Click the search icon to open the Find and Replace dialog. Enter the text to find and the replacement text, then click "Replace All".

8. **Exporting Data**: Click the "Save Spreadsheet" button to export your work as an Excel file.

## Contributing

Contributions to this project are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch: \`git checkout -b feature-name\`
3. Make your changes and commit them: \`git commit -m 'Add some feature'\`
4. Push to the branch: \`git push origin feature-name\`
5. Submit a pull request






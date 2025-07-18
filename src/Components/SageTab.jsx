import React from 'react';
import '../css/Dashboard.css'
import * as XLSX from 'xlsx';
import templates from '../Template/template.js';

const sageHeaders = [
    "Employee Code",
    "Employee Display Name",
    "Company Rule",
    "Pay Run Definition",
    "Line Type",
    "Payroll Definition Code",
    "Date Worked",
    "Units",
    "Input Amount",
    "Charge Out Rate",
    "Job Cost Code",
    "Note",
    "Rate Capture"
];

function SageTemplateTab({ excelData }) {


    function handleExportExcel() {
        const formattedData = excelData.map(row =>
            sageHeaders.reduce((acc, key) => {
                acc[key] = row[key] ?? 'N/A';
                return acc;
            }, {})
        );

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'SageTemplate');
        XLSX.writeFile(workbook, 'sage_template_export.xlsx');


    }
    return (
        <>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button className="import-button"
            onClick={handleExportExcel}>Export Excel</button>
            <button className="import-button">Push to Sage</button>
        </div>
        <div className="table-scroll-wrapper">
            <table>
                <thead>
                <tr>
                    {sageHeaders.map((header, idx) => (
                        <th key={idx}>{header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {excelData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {sageHeaders.map((header, colIndex) => (
                            <td key={colIndex}>
                                {row[header] ?? 'N/A'}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </>
    );
}

export default SageTemplateTab;

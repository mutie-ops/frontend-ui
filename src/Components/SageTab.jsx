import React from 'react';
import '../css/Dashboard.css'
import * as XLSX from 'xlsx';
import payrollTemplate from '../Template/payroll_template.js';


function SageTemplateTab({ excelData, templateKey = 'sage' }) {
    const template = payrollTemplate[templateKey];
    const headers = template.headers;

    const payrollSettings = {
        categories: JSON.parse(localStorage.getItem('selectedCategories') || '{}'),
        definitions: JSON.parse(localStorage.getItem('selectedItems') || '{}'),


    }

    function transformToSageRow(row){

        const transformedRows = []

        const totalOT = parseFloat(String(row['Total OT'] || '0').replace(":", '.'));
        const totalDiffOT = parseFloat(String(row['Total Diff OT'] || '0').replace(":", '.'));
        const totalAbsent = parseFloat(String(row['Total Absent'] || '0').replace(":", '.'));



        const { definitions } = payrollSettings

        if (definitions?.EA.OVERTIME_15 && totalAbsent > 0) {
            transformedRows.push({
                'Employee Code': row['Employee ID'],
                'Employee Display Name': row['First Name'],
                'Company Rule': 'MINET_RE',
                'Pay Run Definition': 'MAIN',
                'Line Type': 'EA',
                'Payroll Definition Code': 'OVERTIME_15',
                'Units': totalOT,
                'Date Worked': row['Date Worked'] || '',
                // Other fields can be filled as needed or default to 'N/A'
            });
        }
        if (definitions?.EA?.OVERTIME_20 && totalDiffOT > 0) {
            transformedRows.push({
                'Employee Code': row['Employee ID'],
                'Employee Display Name': row['First Name'],
                'Company Rule': 'MINET_RE',
                'Pay Run Definition': 'MAIN',
                'Line Type': 'EA',
                'Payroll Definition Code': 'OVERTIME_20',
                'Units': totalDiffOT,
                'Date Worked': row['Date Worked'] || '',
            });
        }

        if (definitions?.DD?.ABSENTEEISM && totalAbsent > 0) {
            transformedRows.push({
                'Employee Code': row['Employee ID'],
                'Employee Display Name': row['First Name'],
                'Company Rule': 'MINET_RE',
                'Pay Run Definition': 'MAIN',
                'Line Type': 'DD',
                'Payroll Definition Code': 'ABSENTEEISM',
                'Units': totalAbsent,
                'Date Worked': row['Date Worked'] || '',
            });
        }

        return transformedRows;


    }

    function handleExportExcel() {
        // const formattedData = excelData.map(row =>
        //     headers.reduce((acc, key) => {
        //         acc[key] = row[key] ?? 'N/A';
        //         return acc;
        //     }, {})
        // );
        const transformedData = excelData.flatMap(transformToSageRow);
        const worksheet = XLSX.utils.json_to_sheet(transformedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, template.name || 'payrollExport');
        XLSX.writeFile(workbook, `${template.name?.toLowerCase().replace(/\s+/g, '_') || 'export'}.xlsx`);


    }

    const transformedRows = excelData.flatMap(transformToSageRow);
    return (
        <>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button className="import-button"
            onClick={handleExportExcel}>Export Excel</button>
            <button className="import-button" onClick={()=> alert('Cannot push to sage, connection to sage error')}>Push to Sage</button>
        </div>
        <div className="table-scroll-wrapper">
            <table>
                <thead>
                <tr>
                    {headers.map((header, idx) => (
                        <th key={idx}>{header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {transformedRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {headers.map((header, colIndex) => (
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

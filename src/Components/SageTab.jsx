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

        const workDayOT = parseFloat(String(row['WORKDAY Overtime'] || '0').replace(":", '.'));
        const holidayOT = parseFloat(String(row['HOLIDAY Overtime'] || '0').replace(":", '.'));
        const restDayOT = parseFloat(String(row['RESTDAY Overtime'] || '0').replace(":", '.'));
        const totalAbsent = parseFloat(String(row['Total Absent'] || '0').replace(":", '.'));

        // for Kisima
        const workingHours = parseFloat(String(row['Worked Normal Hrs'] || '0').replace(":", '.'));
        const overtime1 = parseFloat(String(row['Overtime Hrs @ 1.5'] || '0').replace(":", '.'));
        const overtime2 = parseFloat(String(row['Overtime Hrs @ 2.0'] || '0').replace(":", '.'));
        const lostHours = parseFloat(String(row['Lost  Hrs'] || '0').replace(":", '.'));



        const { definitions } = payrollSettings

        const companyPrefixMap = {
            KN: 'KENTALYASEASONA',
            TA: 'ARABLE-TEMP',
            PA: 'ARABLE-PERM',
            SA: 'ARABLE-SHORT',
            PF: 'FLORI-PERM',
            TR:'FLORI-TEMP'
        };

        const employeeId = row['Employee ID'] || row['Staff No.'] || row['User ID'] || '';
        const prefix = employeeId.substring(0, 2); // first two letters
        const companyRule = companyPrefixMap[prefix] || 'KENTALYAPERMANE';

        if (definitions?.EA.OVERTIME_15 && workDayOT > 0) {
            transformedRows.push({
                'Employee Code': row['Employee ID'],
                'Employee Display Name': row['First Name'] + row['Last Name'],
                'Company Rule': companyRule,
                'Pay Run Definition': 'MAIN',
                'Line Type': 'EA',
                'Payroll Definition Code': 'OVERTIME1',
                'Units': workDayOT,
                'Date Worked': row['Date Worked'] || '',
                // Other fields can be filled as needed or default to 'N/A'
            });
        }
        if (definitions?.EA?.OVERTIME_20 && holidayOT || restDayOT > 0) {
            transformedRows.push({
                'Employee Code': row['Employee ID'],
                'Employee Display Name': row['First Name'] + row['Last Name'],
                'Company Rule': companyRule,
                'Pay Run Definition': 'MAIN',
                'Line Type': 'EA',
                'Payroll Definition Code': 'OVERTIME2',
                'Units': holidayOT + restDayOT,
                'Date Worked': row['Date Worked'] || '',
            });
        }

        if (definitions?.DD?.ABSENTEEISM && totalAbsent > 0) {
            transformedRows.push({
                'Employee Code': row['Employee ID'],
                'Employee Display Name': row['First Name'] + row['Last Name'],
                'Company Rule': companyRule,
                'Pay Run Definition': 'MAIN',
                'Line Type': 'DD',
                'Payroll Definition Code': 'ABSENTEEISM',
                'Units': totalAbsent,
                'Date Worked': row['Date Worked'] || '',
            });
        }

        // FOR KISIMA
        if (definitions?.EA.OVERTIME_15 && overtime1 > 0) {
            transformedRows.push({
                'Employee Code':  row['Employee ID'] || row['Staff No.'] || row['User ID'] || '',
                'Employee Display Name': row['First Name'] + row['Last Name'] || row['Staff Name'],
                'Company Rule': companyRule,
                'Pay Run Definition': 'MAIN',
                'Line Type': 'EA',
                'Payroll Definition Code': 'OVERTIME1',
                'Units': overtime1,
                'Date Worked': row['Date Worked'] || '',
                // Other fields can be filled as needed or default to 'N/A'
            });
        }
        if (definitions?.EA?.OVERTIME_20 && overtime2 > 0) {
            transformedRows.push({
                'Employee Code': row['Employee ID'] || row['Staff No.'] || row['User ID'] || '',
                'Employee Display Name': row['First Name'] + row['Last Name'] || row['Staff Name'],
                'Company Rule': companyRule,
                'Pay Run Definition': 'MAIN',
                'Line Type': 'EA',
                'Payroll Definition Code': 'OVERTIME2',
                'Units': overtime2,
                'Date Worked': row['Date Worked'] || '',
            });
        }

        if (definitions?.EA?.LOST_HOURS && lostHours > 0) {
            transformedRows.push({
                'Employee Code':  row['Employee ID'] || row['Staff No.'] || row['User ID'] || '',
                'Employee Display Name': row['First Name'] + row['Last Name'] || row['Staff Name'],
                'Company Rule': companyRule,
                'Pay Run Definition': 'MAIN',
                'Line Type': 'EA',
                'Payroll Definition Code': 'LOSTHOURS',
                'Units': -lostHours,
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

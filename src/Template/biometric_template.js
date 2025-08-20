// Different Biometric templates

const templates = {
    "suprema-readers":{
        name: 'Suprema Readers Biometrics',
        expectedHeaders: [  "Name",
                            "User ID",
                            "Department",
                            "Regular hours",
                            "Overtime hours",
                            "Total Work Hours",
                            "No of Absence",
                            "No of Insufficient Work Time",
                            "No of Late In",
                            "No of Early Out",
                            "No of Missing Event Type",
                            "No of Missing Punch In",
                            "No of Missing Punch Out"],

        editableColumns :[  "Regular hours",
                            "Overtime hours",
                            "Total Work Hours",
                            "No of Absence",
                            "No of Insufficient Work Time",
                            "No of Late In",
                            "No of Early Out",
                            "No of Missing Event Type",
                            "No of Missing Punch In",
                            "No of Missing Punch Out"],

        filterableColumns :["Name",
                            "User ID",
                            "Department"]
    },

    "Fingertec-biometrics": {
        name: "Fingertec",
        expectedHeaders: [
            'User ID',
            'First Name',
            'Last Name',
            'Employee ID',
            'Department',
            'Total Work',
            'Total OT',
            'Total Diff OT',
            'Total Short',
            'Total Absent',
            'WORKDAY Count',
            'WORKDAY Present',
            'WORKDAY Day',
            'WORKDAY Work'


        ],
        editableColumns: ['Total Work',
            'Total OT',
            'Total Diff OT',
            'Total Short',
            'Total Absent'],

        filterableColumns: ['USER ID',
            'First Name',
            'Last Name',
            'Employee ID',
            'Department']
    },
    "Kentalya-biometrics": {
        name: "Fingertec",
        expectedHeaders: [
            'User ID',
            'First Name',
            'Last Name',
            'Employee ID',
            'Department',
            'RESTDAY Overtime',
            'HOLIDAY Overtime',
            'WORKDAY Overtime',
            'WORKDAY Diff OT',
            'WORKDAY Short',
            'HOLIDAY Present',
            'Total Work'


        ],
        editableColumns: [
            'RESTDAY Overtime',
            'HOLIDAY Overtime',
            'WORKDAY Overtime',
        ],

        filterableColumns: ['USER ID',
            'First Name',
            'Last Name',
            'Employee ID',
            'Department']
    },
    "Kisima Musterol":{
        name: 'Kisima Musterol',
        expectedHeaders: [  "Staff No.",
            "Staff Name",
            "Department",
            "Date",
            "In",
            "Out",
            "Shift",
            "View Status",
            "Shift Planned Hours",
            "Worked Normal Hrs",
            "Overtime Hrs @ 1.5",
            "Overtime Hrs @ 2.0",
            "Lost  Hrs",
            "Total Worked Hours",
            "Clockings"],

        editableColumns :[  "Worked Normal Hrs",
            "Overtime Hrs @ 1.5",
            "Total Work Hours",
            "Overtime Hrs @ 2.0",
            "Lost  Hrs"],

        filterableColumns :["Staff No.",
            "Staff Name",
            "Department"]
    }


}

export default templates;
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
    }


}

export default templates;
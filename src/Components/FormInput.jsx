import React from 'react'
import {useFormContext, useController} from "react-hook-form";

function FormInput({ name, label, rules = {}, type = "text", ...rest }) {

    const {control} = useFormContext();
    const {field, fieldState:{error}} =useController({name, control, rules})

    return (
        <div style={{width: '100%', marginBottom: '1em'}}>
            <label>{label}</label><br/>
            <input style={{width:'250px',height:"25px", border: "2px solid #19a9f7", borderRadius:"4px", padding :"4px 6px", outline:"none"}} {...field} type={type} {...rest} />
            {error && <p style={{color: '#f82237', marginTop:'1px',fontSize:'0.8rem' ,marginBottom:'6px'}}>{error.message}</p>}
        </div>
    )


}
export default FormInput;
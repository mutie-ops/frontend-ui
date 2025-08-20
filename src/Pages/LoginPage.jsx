/* eslint-disable no-unused-vars */
import React from 'react';
import bg from '../assets/bg_int.png'
import FormInput from '../Components/FormInput.jsx'
import {useForm, FormProvider} from "react-hook-form";
import {motion, AnimatePresence} from "framer-motion";
import '../css/loginPage.css'
import {rules} from "eslint-plugin-react-hooks";
import {useNavigate} from "react-router";
function LoginPage() {

    const form = useForm();
    const control = form.control;

    const [step, setSteps]= React.useState(0)
    const [setupMode, isSetupMode] = React.useState(false);
    const navigate = useNavigate();



    const steps= [
        {
            key: "login",
            show: () => !setupMode,
            title: 'Credentials',
            content: (
                <>
                    <FormInput name="userName"
                               control={control}
                               label={"Username"}
                               rules={{required: "Username is required"}}/>

                    <FormInput name="password"
                               control={control}
                               label={"Password"}
                               type="password"
                               rules={{
                                   required: "Password is required",
                                   minLength: {value: 6, message: "Password must be at least 6 characters"}
                               }}/>

                    {/* ILL GET BACK TO THIS */}
                    {/*<div className="metaContainer">*/}
                        <span onClick={()=> alert('Password is Sage@123')}>Forgot Password</span>
                    {/*    <span onClick={handleSetupClick}>Setup</span>*/}
                    {/*</div>*/}


                    <button className="LoginSubmit" type="submit">Login</button>  </>)

        },
        {
            key: "step1",
            show: () => setupMode,
            title:'Sage Database Credentials',
            content: (
                <>
                    <FormInput
                        name="serverName"
                        control={control}
                        label="Server Name"
                        rules={{ required: 'Servername is required' }}
                    />
                    <FormInput
                        name="DBuserName"
                        control={control}
                        label="DB Username"
                        rules={{ required: 'Database username is required' }}
                    />
                    <FormInput
                        name="Password"
                        control={control}
                        label="DB password"
                        rules={{ required: 'Database password is required' }}
                    />
                    <div className="metaContainer">
                        <span onClick={prevStep}>Back</span>
                        <span onClick={nextStep}>Next</span>
                    </div>
                </>
            )
        },
        {
            key: "step2",
            show: () => setupMode,
            title:'Sage Api Credentials',
            content: (
                <>
                    <FormInput
                        name="apiKey"
                        control={control}
                        label="Api Key"
                        rules={{required: 'Api Key is required'}}
                    />
                    <div className="metaContainer">
                        <span onClick={prevStep}>Back</span>
                        <span>Help</span>
                    </div>
                    <button className="LoginSubmit" type="submit">
                        Submit
                    </button>
                </>
            )
        }

    ];

    const visibleSteps = steps.filter(step => step.show());

    function goToStep(index) {
        setSteps(index);
    }

    function nextStep() {
        setSteps(prev => Math.min(prev + 1, visibleSteps.length - 1));
    }

    function prevStep() {
        setSteps(prev => Math.max(prev - 1, 0));
        // Transition back to credentials only when on the first visible setup step
        if (step === 0 && setupMode && visibleSteps.length > 0 && visibleSteps[0].key === "step1") {
            isSetupMode(false);
            setSteps(0); // Reset step to 0 for credentials
        } else if (!setupMode) {
            setSteps(0); // Ensure step is 0 when on credentials
        }
    }

    function handleSetupClick(){
        isSetupMode(true);
        setSteps(0);
    }

    function onSubmit(data) {
        const hardcodedUsername ='Admin'
        const hardcodedPassword ='Sage@123'
        if(data.userName ===hardcodedUsername && data.password === hardcodedPassword){
            navigate('/main')
        }else {
            alert('Invalid username or password');
        }
    }

    return (
        <div className="LoginFullPage">
            <div  className='LoginInformation'></div>

            <div  className='Credentials'>
                <h1>{visibleSteps[step]?.title || steps[0]?.title}</h1>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div style={{ overflow: 'hidden',padding:"30px",width:"300px", height:'100%' ,display:'flex', justifyContent:'center', alignItems: 'center' }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key = {visibleSteps[step]?.key || steps[0]?.key}
                                    initial={{x:300, opacity:0}}
                                    animate ={{x:0 ,opacity:1}}
                                    exit ={{x:-300, opacity:0}}
                                    transition = {{duration:0.5}}
                                    layout>

                                    {visibleSteps[step]?.content || steps[0]?.content}

                                </motion.div>

                            </AnimatePresence>
                        </div>
                    </form>
                </FormProvider>
                {/*{isSetupMode && (*/}
                {/*    <div className='step-indicator'>*/}
                {/*        {visibleSteps.map((stepItem, index) => (*/}
                {/*            <div*/}
                {/*                key={stepItem.key}*/}
                {/*                className={`dot ${index === step-1 ? 'active' : ''}`}*/}
                {/*                onClick={() => goToStep(index + 1)}*/}
                {/*            >*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </div>
    );
}

export default LoginPage;
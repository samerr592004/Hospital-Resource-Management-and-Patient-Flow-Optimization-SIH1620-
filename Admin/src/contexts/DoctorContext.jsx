import { createContext ,useState} from "react";

export const DoctorContext = createContext()


const DoctorContextProvider = (props) => {

        const backendUrl = import.meta.env.VITE_BACKEND_UR
        const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')

        const loginDoctor = async (req,res)=>{
            try{

            }catch(error){
                
            }
        }


    const value = {
        backendUrl,
        dToken,setDToken,


    }

    return (
        <DoctorContext.Provider value={value}>

            {props.children}


        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider













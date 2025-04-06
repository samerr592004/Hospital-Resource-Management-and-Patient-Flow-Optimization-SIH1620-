import axios from "axios";
import { createContext, useState,useEffect } from "react";
import { toast } from 'react-toastify'


export const DoctorContext = createContext()


const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])




    const getAppointments = async () => {
        try {
            console.log('ok')

            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
                headers: { dtoken: dToken } // lowercase 'dtoken'
            })

            console.log(data)
            if (data.success) { // Correct spelling
                setAppointments(data.appointments.reverse());
                console.log(data.appointments.reverse());
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }

    
    


    const value = {
        backendUrl,
        dToken, setDToken,
        appointments, setAppointments,
        getAppointments


    }

    return (
        <DoctorContext.Provider value={value}>

            {props.children}


        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider













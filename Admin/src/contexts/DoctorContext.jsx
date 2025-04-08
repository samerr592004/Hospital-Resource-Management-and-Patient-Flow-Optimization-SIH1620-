import axios from "axios";
import { createContext, useState,useEffect } from "react";
import { toast } from 'react-toastify'



export const DoctorContext = createContext()


const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [doctorData, setDoctorData] = useState({})
    const [hospitalData, setHospitalData] = useState({})
    const [dashboardData, setDashboardData] = useState({})


    const getDocotrData = async () => {
        try {
           
            const { data } = await axios.get(backendUrl + '/api/doctor/get-doctor-data', {
                headers: { dtoken: dToken } // lowercase 'dtoken'
            })
            if (data.success) { // Correct spelling
                setDoctorData(data.doctorData)
                setHospitalData(data.hospitalInfo)
               
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }
    const getDashboardData = async () => {
        try {
           
            const { data } = await axios.get(backendUrl + '/api/doctor/get-dashboard-data', {
                headers: { dtoken: dToken } // lowercase 'dtoken'
            })

           
            if (data.success) { 
               setDashboardData(data.dashboardData)
            } else {
                console.log('error')
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }

    const getAppointments = async () => {
        try {
           
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
                headers: { dtoken: dToken } // lowercase 'dtoken'
            })

            if (data.success) { // Correct spelling
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
          
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment',{appointmentId}, {
                headers: { dtoken: dToken } 
            })

            console.log(data)
            if (data.success) { 
                getAppointments()
                toast.success(data.message)
               
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }
    const calculateAge= (dob) =>{
        const today = new Date()
        const birthDate = new Date(dob)

        let age = today.getFullYear()-birthDate.getFullYear()

        return age

    }

    
    useEffect(() => {
      if(dToken){
     
        getDocotrData()
        // getDashboardData()
        
      }
    }, [dToken])
    


    const value = {
        backendUrl,
        dToken, setDToken,
        appointments, setAppointments,
        getAppointments,
        cancelAppointment,
        doctorData,setDoctorData,hospitalData,setHospitalData,
        getDocotrData,
        getDashboardData,dashboardData,setDashboardData,
        calculateAge


    }

    

    return (
        <DoctorContext.Provider value={value}>

            {props.children}


        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider













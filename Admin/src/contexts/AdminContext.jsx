import { useState, createContext, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const AdminContext = createContext()


const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors, setDoctors] = useState([])
    const [hospitals, setHospitals] = useState([])
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(false)
    L


    const getAllDoctors = async () => {

        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/all-doctors`, {}, { headers: { atoken: aToken } })

            if (data.success) {
                setDoctors(data.doctors)
                
            }
        } catch (error) {
            toast.error(error.message)
        }

    }


    const getDoctorsByHospital = async (hospitalId) => {

        try {

            console.log()
            const { data } = await axios.post(`${backendUrl}/api/admin/all-doctors-by-hospital`, {}, { headers: { atoken: aToken, hospitalid: hospitalId } })
            // console.log(data)
            if (data.success) {
                setDoctors(data.doctors)
                // console.log(data.doctors)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    const getAllHospitals = async () => {

        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/all-hopitals`, {}, { headers: { atoken: aToken } })
            // console.log(data)
            if (data.success) {

                setHospitals(data.hospitals)

            }
        } catch (error) {
            toast.error(error.message)
        }

    }


    const changeAvilability = async (docId) => {

        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/change-avalibility`, { docId }, { headers: { atoken: aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }


    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + "/api/admin/appointments", { headers: { aToken } })

            if (data.success) {
                
                setAppointments(data.appointments)
                setLoading(false)
                // console.log(data.appointments)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)

        }

    }


    const cancelAppointment = async (appointmentId) => {

        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })
            if (data.success) {

                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)

        }

    }


    const getDashboardData = async () =>{
        try{

            const {data} = await axios.get(backendUrl+"/api/admin/dashboard-data",{headers:{aToken}})

            if(data.success){
                setDashboardData(data.dashboardData)
                
            }else{
                toast.error(data.message)
                
            }


        }catch(error){
            toast.error(error.message)
        }
    }


    useEffect(() => {
      if(aToken){
        getDashboardData()
      }
    }, [aToken])
    










    const value = {
        aToken, setAToken,
        backendUrl, doctors, hospitals,
        getAllDoctors, changeAvilability, getAllHospitals, getDoctorsByHospital,
        appointments, setAppointments,
        getAllAppointments, cancelAppointment,
        dashboardData,setDashboardData,getDashboardData,
        loading, setLoading
    }

    return (
        <AdminContext.Provider value={value}>

            {props.children}


        </AdminContext.Provider>
    )



}

export default AdminContextProvider













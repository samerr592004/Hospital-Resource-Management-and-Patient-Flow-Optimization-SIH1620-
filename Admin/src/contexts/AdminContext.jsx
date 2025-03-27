import { useState,createContext } from "react";
import axios from 'axios'
import {toast } from 'react-toastify'

export const AdminContext=createContext()


const AdminContextProvider=(props)=>{

    const [aToken,setAToken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [doctors,setDoctors]=useState([])
    const [hospitals,setHospitals]=useState([])
    const backendUrl=import.meta.env.VITE_BACKEND_URL

    
    const getAllDoctors=async()=>{

        try{
            const {data}=await axios.post(`${backendUrl}/api/admin/all-doctors`,{}, { headers: { atoken: aToken } })

            if(data.success){
                setDoctors(data.doctors)
                // console.log(data.doctors)
            }
        }catch(error){
            toast.error(error.message)
        }

    }

    
    const getDoctorsByHospital=async(hospitalId)=>{

        try{

            console.log() 
            const {data}=await axios.post(`${backendUrl}/api/admin/all-doctors-by-hospital`,{}, { headers: { atoken: aToken,hospitalid:hospitalId } })
                // console.log(data)
            if(data.success){
                setDoctors(data.doctors)
                // console.log(data.doctors)
            }
        }catch(error){
            toast.error(error.message)
        }

    }

    const getAllHospitals=async()=>{

        try{
            const {data}=await axios.post(`${backendUrl}/api/admin/all-hopitals`,{}, { headers: { atoken: aToken } })
                // console.log(data)
            if(data.success){
                console.log(data.hospitals)
                setHospitals(data.hospitals)
               
            }
        }catch(error){
            toast.error(error.message)
        }

    }


    const changeAvilability=async(docId)=>{

        try{
            const {data}=await axios.post(`${backendUrl}/api/admin/change-avalibility`,{docId}, { headers: { atoken: aToken } })

            if(data.success){
               toast.success(data.message)
               getAllDoctors()
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }

    }



    const value={
        aToken,setAToken,
        backendUrl,doctors,hospitals,
        getAllDoctors,changeAvilability,getAllHospitals,getDoctorsByHospital
    }

    return(
        <AdminContext.Provider value={value}>

           {props.children} 
            

        </AdminContext.Provider>
    )

}

export default AdminContextProvider













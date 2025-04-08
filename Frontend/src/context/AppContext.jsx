import { createContext, useEffect, useState } from "react";
// import { doctors } from "../assets/assets";
import axios from 'axios'
import { toast } from "react-toastify";


export const AppContext=createContext()

const AppContextProvider=(props)=>{

  const currencySymbol='₹'
  const backendUrl=import.meta.env.VITE_BACKEND_URL

  const [token,setToken]=useState(localStorage.getItem('token')? localStorage.getItem('token'): false)
  const [doctors,setDoctors]=useState([])
  const [userData,setUserData] = useState(false)
  const [hospitals, setHospitals] = useState([])
  const [beds, setBeds] = useState([]);




    

    const getDoctorData= async ()=>{

        try{

            const {data}=await axios.get(backendUrl+'/api/doctor/list')

            if(data.success){
                setDoctors(data.doctors)

            }else{
                toast.error(data.message)
            }

        }
        catch(e){
                console.log(e)
                toast.error(data.message)
                
        }


    }
    


    const loadUserProfileData = async () => {
        try{

            const {data}= await axios.get(backendUrl+'/api/user/get-profile',{headers:{token}})

            if(data.success){
                // console.log('yes')
                setUserData(data.userData)
                // if (data.userData?.beds) {
                //     setBeds(Object.values(data.userData.beds).filter(bed => bed !== null));
                //   } else {
                //     setBeds([]);
                //   }
            }else{
                // console.log("No")
                toast.error(data.message)
            }

        }catch(error){
            // console.log(e)
            toast.error(data.message)

        }
    }


    const getBeds = () => {
        if (userData?.beds) {
          const bedsArray = Object.values(userData.beds).reverse();
          setBeds(bedsArray);
        } else {
          setBeds([]);
        }
      }


    const getHospitalData = async () =>{
        try{

            const {data}=await axios.get(backendUrl+'/api/hospital/list')

            if(data.success){
                setHospitals(data.hospital)

            }else{
                toast.error(data.hospital)
            }

        }
        catch(e){
                console.log(e)
                toast.error(data.message)
                
        }

    }

    const value={
        doctors,getDoctorData,
        currencySymbol,
        token,setToken,
        backendUrl,
        userData,setUserData,
        loadUserProfileData,
        hospitals,setHospitals,
        beds,setBeds,
        getBeds,
        getHospitalData
    }

    useEffect(()=>{
        getDoctorData()
    },[])


    useEffect(()=>{
        getHospitalData()
    },[])


    useEffect(()=>{
        if(token){
            loadUserProfileData()
        }else{
            setUserData(false)
        }
    },[token])

    useEffect(()=>{
        if(token){
            getBeds()
        }else{
            getBeds([])
        }
    },[token,userData,hospitals])









    return(
        <AppContext.Provider value={value}>
            {props.children}

        </AppContext.Provider>

    )
}
export default AppContextProvider
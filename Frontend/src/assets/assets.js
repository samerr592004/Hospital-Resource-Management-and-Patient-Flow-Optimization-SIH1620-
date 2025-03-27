import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Sarah Patel',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        image: doc6,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
]

export const hospitals = [
  {
    _id: 1,
    name: "Sub-Divisional Hospital, Gunupur",
    address: "Gunupur, Rayagada - 765022",
    latitude: 19.0790,
    longitude: 83.8081,
    image: "https://via.placeholder.com/100",
    about: "The primary government hospital serving the Gunupur region, offering a range of medical services to the local population.",
    constructed: 1980,
    zipcode: "765022",
    contact: {
      email: "sdh.gunupur@odishahealth.in",
      phone: "(06857) 250123"
    },
    bednumber: 200,
    occupied: {
      5: true,
      8: true,
      12: true,
      25: true,
      40: true
    }
  },
  {
    _id: 2,
    name: "Christian Hospital, Bissamcuttack",
    address: "State Highway 5, Gojabahal, Bissamcuttack, Rayagada, Odisha 765019",
    latitude: 19.3106,
    longitude: 83.5070,
    image: "https://via.placeholder.com/100",
    about: "A missionary hospital known for providing quality healthcare services, including general medicine, surgery, and maternal care.",
    constructed: 1954,
    zipcode: "765019",
    contact: {
      email: "info@chbmck.org",
      phone: "(06863) 247505"
    },
    bednumber: 150,
    occupied: {
      2: true,
      7: true,
      15: true,
      23: true
    }
  },
  {
    _id: 3,
    name: "District Headquarters Hospital, Rayagada",
    address: "Old Sainik School Road, Unit 15, Bhubaneswar, Odisha 765001",
    latitude: 19.1726,
    longitude: 83.4115,
    image: "https://via.placeholder.com/100",
    about: "The main government hospital serving Rayagada district, offering a range of healthcare services to the local population.",
    constructed: 1985,
    zipcode: "765001",
    contact: {
      email: "cdmorayagada@gmail.com",
      phone: "(06856) 235603"
    },
    bednumber: 300,
    occupied: {
      10: true,
      22: true,
      37: true,
      45: true,
      67: true
    }
  },
  {
    _id: 4,
    name: "UPHC Hospital, Gunupur",
    address: "Gunupur, Rayagada, Odisha 765022",
    latitude: 19.0790,
    longitude: 83.8081,
    image: "https://via.placeholder.com/100",
    about: "A government hospital in Gunupur offering primary healthcare services and vaccinations.",
    constructed: 2010,
    zipcode: "765022",
    contact: {
      email: "uphc.gunpur@health.gov.in",
      phone: "(06857) 250456"
    },
    bednumber: 50,
    occupied: {
      3: true,
      10: true,
      25: true
    }
  },
  {
    _id: 5,
    name: "MKCG Medical College and Hospital",
    address: "Ring Road, Brahmapur, Odisha 760004",
    latitude: 19.3149,
    longitude: 84.7941,
    image: "https://via.placeholder.com/100",
    about: "A leading medical college and hospital providing tertiary healthcare services and medical education.",
    constructed: 1962,
    zipcode: "760004",
    contact: {
      email: "info@mkcg.ac.in",
      phone: "(0680) 2292746"
    },
    bednumber: 500,
    occupied: {
      12: true,
      33: true,
      49: true,
      101: true,
      205: true
    }
  },
  {
    _id: 6,
    name: "Hi-Tech Medical College and Hospital",
    address: "Pandara, Rasulgarh, Bhubaneswar, Odisha 751025",
    latitude: 20.2961,
    longitude: 85.8256,
    image: "https://via.placeholder.com/100",
    about: "A reputed private medical college and hospital offering modern medical facilities and specialized healthcare services.",
    constructed: 2005,
    zipcode: "751025",
    contact: {
      email: "info@hi-techmedical.org",
      phone: "(0674) 2372756"
    },
    bednumber: 400,
    occupied: {
      5: true,
      12: true,
      60: true,
      102: true,
      205: true
    }
  },
  {
    _id: 7,
    name: "KIMS Hospital",
    address: "KIIT Campus, Patia, Bhubaneswar, Odisha 751024",
    latitude: 20.3553,
    longitude: 85.8193,
    image: "https://via.placeholder.com/100",
    about: "Kalinga Institute of Medical Sciences hospital providing comprehensive healthcare services and medical education.",
    constructed: 2007,
    zipcode: "751024",
    contact: {
      email: "info@kims.ac.in",
      phone: "(0674) 2725471"
    },
    bednumber: 600,
    occupied: {
      8: true,
      33: true,
      58: true,
      210: true,
      365: true
    }
  },
  {
    _id: 8,
    name: "Apollo Hospitals Bhubaneswar",
    address: "Plot No. 251, Old Sainik School Road, Unit 15, Bhubaneswar, Odisha 751005",
    latitude: 20.2961,
    longitude: 85.8256,
    image: "https://via.placeholder.com/100",
    about: "A multi-specialty hospital offering cutting-edge medical treatment and healthcare facilities.",
    constructed: 2009,
    zipcode: "751005",
    contact: {
      email: "info@apollobhubaneswar.com",
      phone: "(0674) 6660100"
    },
    bednumber: 500,
    occupied: {
      3: true,
      17: true,
      30: true,
      85: true
    }
  },
  {
    _id: 10,
    name: "SCB Medical College and Hospital",
    address: "Manglabag, Cuttack, Odisha 753007",
    latitude: 20.4680,
    longitude: 85.8793,
    image: "https://via.placeholder.com/100",
    about: "A premier government medical college and hospital, offering extensive healthcare services and medical education.",
    constructed: 1944,
    zipcode: "751005",
    contact: {
      email: "info@scbmch.in",
      phone: "(0671) 2414080"
    },
    bednumber: 500,
    occupied: {
      22: true,
      55: true,
      78: true,
      95: true
    }
  }
];

  
  
// import React from 'react'
// import { Navigate, useNavigate } from 'react-router-dom'



// const UpdateZone = () => {
//   const [timeZone,setTimeZone]=useState([]);
//   const [selectedZone,setSelectedZone]=useState("");


//   const navigate=useNavigate();

//   const handleTimeZoneChange=(e)=>{
//       setSelectedZone(e.target.value);
//       console.log(selectedZone);
//   }

//   const HandleUpdate=async(req,res)=>{
//       try {
//           const foundZone=timeZone.find(tz=>tz.ZoneName===selectedZone);
//           const deletedZone=await axiosInstance.delete(`/api/timezone/${foundZone._id}`);
//           console.log(deletedZone);
//           alert("TimeZone deleted Successfully!");
//           navigate("/");
//           res.status(200).json(deletedZone);
          
         
//       } catch (error) {
//           console.log({message:error.message});
//       }
//   }

//   useEffect(()=>{
//       const fetchTimeZones=async ()=>{
//         try {
//           const response=await axiosInstance.get('./api/timeZone');
//           // console.log("response is:\n");
//           setTimeZone(response.data);
//           // console.log(timeZone);
//           // console.log(selectedZone);
      
//         } catch (error) {
//           console.log(error);
//         }
//       }
  
//       fetchTimeZones();
//     },[selectedZone]);
//   return (
//     <div>
//       <div className="mb-3">
//          <label for="formGroupExampleInput" class="form-label">Select the Time thats needs Update</label>
//          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
//               <select value={selectedZone} className="form-select form-select-default " aria-label="default select example" onChange={handleTimeZoneChange}>
//                 {
//                   timeZone.map(tz=>(
//                     <option key={tz._id} value={tz.ZoneName}>{tz.ZoneName}</option>
//                   ))
//                 }
//               </select>
//         </ul> 
//       </div>   
//     </div>
//   )
// }

// export default UpdateZone

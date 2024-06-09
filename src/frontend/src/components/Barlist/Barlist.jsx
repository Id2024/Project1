import React,{useState,useEffect,useRef} from 'react'
import Bar from '../Bar/Bar'
import "./barlist.css"
import GoogleCalendar from '../GoogleCalendar/GoogleCalendar'


const adjustdatebyOffset=(date,offsetHours)=>{
  // console.log(date);
  return new Date(date+offsetHours*60*60*1000)
}

const formatTime=(date)=>{
  return date.toISOString().substring(11,16);
}



function Barlist({timezone,selectedDate,selectedZone}) {
  const [referenceoffset, setReferenceOffset] = useState(0);
  const [Timeline,setTimeline]=useState(null);
  const [ReorderedZone,setReorderedZone]=useState(null);
  const [selectedHour, setSelectedHour] = useState(null);


  const barlistRef = useRef(null);

  const calculateTimeline = (timeZone, referenceOffsetHours) => {
   
    const [hoursOffset, minuteOffset] = timeZone.Zone_offset.split(':').map(Number);
    const totalOffsetHours = hoursOffset + minuteOffset / 60;
     
    const offsetDifference = totalOffsetHours - referenceOffsetHours;

    const parsedDate = new Date(selectedDate);

    if (!isNaN(parsedDate.getTime())) {
     
        const baseTime = parsedDate.setUTCHours(0, 0, 0, 0);
        let localTimes = [];
        let localDates=[];

        for (let i = 0; i < 24; i++) {

            const localTime = adjustdatebyOffset(baseTime, offsetDifference + i);
            const formattedTime=formatTime(localTime);
            const currentDate=new Date(localTime);
         
            
             localTimes.push(formattedTime+' ');
             localDates.push(currentDate.toISOString().substring(0,10));
        }
      
        return {localTimes,localDates} ;
       } else {
        console.log("Invalid Date format", selectedDate);
        return {localTimes:[],localDates:[]};
    }
  }

  
  useEffect(()=>{
    const fetchTimeZones= async()=>{
      try {
       
        if(!selectedZone) selectedZone="IST";
        const foundZone=timezone.find(tz=>tz.ZoneName===selectedZone);
        if(foundZone){
         
          const [refHoursOffset,refMinutesOffset]=foundZone.Zone_offset.split(':').map(Number);
          const referenceoffset=refHoursOffset+refMinutesOffset/60;
          setReferenceOffset(referenceoffset);
        
          const reorder=timezone.slice().sort((a,b)=>{
            if(a.ZoneName==selectedZone) return -1;
            if(b.ZoneName==selectedZone)return 1;
            return 0;
          })
          setReorderedZone(reorder);
        
          const timelines= await Promise.all(reorder.map((tz)=>{
             return calculateTimeline(tz,referenceoffset);
          }))
          console.log(timelines.localDates);
          setTimeline(timelines);
        
        }else{
          console.log("cannot set offset hours");
        }
      } catch (error) {
        console.log(error);
      }
    }
   
    fetchTimeZones();
  },[referenceoffset,selectedZone,selectedDate]);
  


  useEffect(()=>{
    const timeoutId=setTimeout(()=>{

      if(Timeline===null){
        alert("Error fetching the Timezones.")
        window.location.reload();
      }
    },5000);

    return()=>clearTimeout(timeoutId);
  },[Timeline])
 


  if (Timeline === null) {
    return <div>Loading...</div>;
  }


  const handleHourClick = (hour,event) => {
    console.log(event);
    setSelectedHour(hour);
  };
 


  return (
   <div className="barlist-container" style={{marginTop:"20px"}} ref={barlistRef}> 
      {ReorderedZone.map((tz, index) => (
        <div key={tz._id}>
          <Bar timezone={tz} localTimes={Timeline[index].localTimes} localDates={Timeline[index].localDates} selectedZone={selectedZone}  selectedHour={selectedHour} onHourClick={handleHourClick}/>
        </div>
      ))}
      <div className="links">
      <a href="/custom_time">Click Here to compare custom timelines</a>
      <a href="/" style={{marginLeft:"70px"}} >Add to your google Calender</a>
      <GoogleCalendar/>
      </div>
    </div>
  )
}

export default Barlist


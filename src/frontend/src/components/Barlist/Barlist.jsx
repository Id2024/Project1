import React,{useState,useEffect} from 'react'
import Bar from '../Bar/Bar'


const adjustdatebyOffset=(date,offsetHours)=>{
  // console.log(date);
  return new Date(date+offsetHours*60*60*1000)
}

const formatTime=(date)=>{
  return date.toISOString().substring(11,16);
}
// starts here
function Barlist({timezone,selectedDate,selectedZone}) {
  const [referenceoffset, setReferenceOffset] = useState(0);
  const [timeline,setTimeline]=useState([[]]);

  const calculateTimeline = (timeZone, referenceOffsetHours) => {
    const [hoursOffset, minuteOffset] = timeZone.Zone_offset.split(':').map(Number);
    const totalOffsetHours = hoursOffset + minuteOffset / 60;

    const offsetDifference = totalOffsetHours - referenceOffsetHours;

    const parsedDate = new Date(selectedDate);

    if (!isNaN(parsedDate.getTime())) {
      // console.log(parsedDate);
      //   console.log(parsedDate.getTime());
        const baseTime = parsedDate.setUTCHours(0, 0, 0, 0);
        // console.log(baseTime);
        let localTimes = [];

        for (let i = 0; i < 24; i++) {

            const localTime = adjustdatebyOffset(baseTime, offsetDifference + i);
            localTimes.push(formatTime(localTime)+'  ');
        }
        //  console.log(localTimes);
        //  setTimeline(localTimes);
        //  console.log(timeline);
        return localTimes ;
       } else {
        console.log("Invalid Date format", selectedDate);
        return [];
    }
}
  useEffect(()=>{
    const fetchTimeZones= async()=>{
      try {
       
        if(!selectedZone) selectedZone="IST";
        const foundZone=timezone.find(tz=>tz.ZoneName===selectedZone);
        if(foundZone){
          // console.log(foundZone);
          const [refHoursOffset,refMinutesOffset]=foundZone.Zone_offset.split(':').map(Number);
          const referenceoffset=refHoursOffset+refMinutesOffset/60;
          setReferenceOffset(referenceoffset);
          // console.log(timezone);
          const timelines= await Promise.all(timezone.map((tz)=>{
             return calculateTimeline(tz,referenceoffset);
          }))
          console.log(timelines);
          setTimeline(timelines);
           
        }else{
          console.log("cannot set offset hours");
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchTimeZones();
  },[timezone,selectedDate]);

 
  return (
    <div>
      {
       timezone.map((tz,index)=>(
        <div key={tz._id}>
          <Bar timezone={tz} timeline={timeline[index]} selectedDate={selectedDate}/>
        </div>
       ))
      }
    </div>
  )
}

export default Barlist



const PersonalPreviewDetail = ({resumeInfo}) => {
  return (
    <div>
     <h2 style={{color:resumeInfo?.themeColor}} className="font-bold text-center text-2xl">
        {resumeInfo?.firstName} {resumeInfo?.lastName} 
     </h2>
     <h2 className=" text-center text-xl">{resumeInfo?.jobTitle}</h2>
     <h2 className=" text-center text-sm font-normal">{resumeInfo?.address}</h2>
     <div className="flex justify-between" style={{color:resumeInfo?.themeColor}}>
        <h2 className=" text-center text-sm font-normal">{resumeInfo?.phone}</h2>
        <h2 className=" text-center text-sm font-normal">{resumeInfo?.email}</h2>
     </div>
     <hr className="border-t-2 border my-1" style={{borderColor:resumeInfo?.themeColor}} />
    </div>
  )
}

export default PersonalPreviewDetail

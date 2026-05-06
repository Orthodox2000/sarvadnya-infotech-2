 
export default function Productbar()
{
     
    const products=["service 1","service 2", "service 3"," service 4", "service-5" ,"service-6"]
    return(
        <div className="border-b w-full h-7.5 
        flex flex-row justify-evenly text-xs"> 
            { 
                products.map((item,keys)=>(
                <div key={keys} className=" flex items-center h-full pl-2 pr-2">{item}</div>
            )
        
        )}
        </div>
    );
}
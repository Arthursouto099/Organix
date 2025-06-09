

import Menu from "../components/menu"
import SideMenu from "../components/sideMenu"
import CollaboratorsDisplay from "../components/CollaboratorsDisplay"




export default function Collaborations() {

    return (
          <div >
      
             
                    <Menu />        
                  <div className=" flex w-full h-full ">
      
      
                      <div className="w-[400px] h-full mt-10 bg-white border-r border-gray-200 hidden sm:block">
      
                          <SideMenu />
                      </div>
      
                      <div className="w-full" >
                          <CollaboratorsDisplay />
      
                      </div>
      
      
                     
                  </div>
      
      
      
      
              </div>
    )



}
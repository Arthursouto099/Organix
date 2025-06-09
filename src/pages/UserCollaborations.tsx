
import CollaborationsDisplay from "../components/UserCollaborations"
import SideMenu from "../components/sideMenu"
import Menu from "../components/menu"

export default function Collaborations() {
    return (
        <div >

            <Menu />

            <div className=" flex w-full h-full ">


                <div className="w-[400px] h-full mt-10 bg-white border-r border-gray-200 hidden sm:block">

                    <SideMenu />
                </div>

                <div className="w-full" >
                    <CollaborationsDisplay />

                </div>



            </div>




        </div>

    )
}

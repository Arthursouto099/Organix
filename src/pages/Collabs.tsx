import { changeUserStatus } from "@/api/userApi";
import { AlertDialogDef } from "@/components/alert-def";
import PutCollabModal from "@/components/put-collab";
import RegisterCollabModal from "@/components/register-collab-modal";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useCollaborators from "@/hooks/useCollaborators";
import { getInfoBytoken } from "@/utils/decoded";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Search, User2 } from "lucide-react";
import { useState } from "react";






export default function CollabsDisplay() {
    const { data, load } = useCollaborators()

    const [filte_name, setFilter_name] = useState("")
  
    
    console.clear()

    const HandlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter_name(e.target.value)
    }






    const data_not_adm = data.filter((collab) => collab.id !== getInfoBytoken()?.userId)
    const data_collabs = filte_name !== "" ? data_not_adm.filter((collab) => collab.name.toUpperCase().includes(filte_name.toUpperCase()) || collab.email.toUpperCase().includes(filte_name.toUpperCase())) : data_not_adm


    return (

        <section className="h-screen w-[100%]">


            <div className=" h-screen m-7 flex flex-col gap-10">
                <Card className="rounded-sm">

                    <CardHeader>
                        <CardTitle className="flex flex-col gap-8">

                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <Search className="w-5"></Search>
                                <Input className="w-[100%] md:w-[40%]" placeholder="Procure pelo nome ou Email" onChange={HandlerChange}></Input>
                                <RegisterCollabModal onClose={() => {
                                    load()
                                }}></RegisterCollabModal>
                            </div>





                        </CardTitle>

                        <CardDescription className="mt-6">
                            <h1 className="text-[1rem] font-semibold">Informações sobre seu grupo: </h1>
                            <div className="flex gap-4 mt-2">
                                <div className="flex items-center gap-1"    >
                                    <h1>Ativos</h1>
                                    <div className="h-2 w-2 rounded-full  bg-green-300" ></div>
                                </div>
                                <div className="flex items-center gap-1"    >
                                    <h1>Inativos</h1>
                                    <div className="h-2 w-2 rounded-full  bg-red-300" ></div>
                                </div>
                            </div>
                            <div className="flex gap-6">

                                <div className="flex items-center mt-7 gap-1">

                                    <User2 className="h-4"></User2>{ }

                                    <div className="flex items-center gap-2 ">
                                        <h1>{data.filter(c => c.isActive).length}</h1>
                                        <div className="h-2 w-2 rounded-full  bg-green-300" ></div>
                                    </div>


                                </div>
                                <div className="flex items-center mt-7">

                                    <User2 className="h-4"></User2>{ }

                                    <div className="flex items-center gap-2 ">
                                        <h1>{data.filter(c => !c.isActive).length}</h1>
                                        <div className="h-2 w-2 rounded-full  bg-red-300" ></div>
                                    </div>
                                </div>

                            </div>


                        </CardDescription>
                    </CardHeader>

                </Card>




                <Card className="rounded-sm">


                    <div className="overflow-x-auto m-5 md:m-0">
                        <table className="w-full text-sm text-left rtl:text-right">
                            <thead className="hidden md:table-header-group text-xs uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-3 ">Nome</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Cargo</th>
                                    <th scope="col" className="px-6 py-3">Config</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data_collabs.length < 1 ? (
                                    <tr>
                                        <td className="px-6 py-4" colSpan={5}>
                                            Nenhum resultado encontrado
                                        </td>
                                    </tr>
                                ) : null}

                                {data_collabs.map((collab) => (
                                    <tr
                                        key={collab.id}
                                        className="block md:table-row mb-4 md:mb-0 border rounded-lg md:border-0"
                                    >
                                        <td
                                            data-label="Nome"
                                            className="px-6 py-4 font-medium whitespace-nowrap block md:table-cell 
                       before:content-[attr(data-label)] before:font-semibold before:block md:before:hidden"
                                        >
                                            {collab.name}
                                        </td>

                                        <td
                                            data-label="Email"
                                            className="px-6 py-4 block md:table-cell 
                       before:content-[attr(data-label)] before:font-semibold before:block md:before:hidden"
                                        >
                                            {collab.email}
                                        </td>

                                        <td
                                            data-label="Status"
                                            className="px-6 py-4 block md:table-cell 
                       before:content-[attr(data-label)] before:font-semibold before:block md:before:hidden"
                                        >
                                            <div
                                                className={`h-3 w-3 rounded-full ${collab.isActive ? "bg-green-300" : "bg-red-300"
                                                    }`}
                                            ></div>
                                        </td>

                                        <td
                                            data-label="Cargo"
                                            className="px-6 py-4 block md:table-cell 
                       before:content-[attr(data-label)] before:font-semibold before:block md:before:hidden"
                                        >
                                            {collab.role}
                                        </td>

                                        <td
                                            data-label="Config"
                                            className="px-6 py-4 flex gap-3  md:table-cell 
                       before:content-[attr(data-label)] before:font-semibold before:block md:before:hidden"
                                        >
                                            {/* Aqui entra o Dialog e botões como antes */}
                                            <Dialog>
                                                <DialogTrigger>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="hover:fill-violet-300"
                                                        height="20px"
                                                        viewBox="0 -960 960 960"
                                                        width="20px"
                                                        fill="#FFFFFF"
                                                    >
                                                        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                                                    </svg>
                                                </DialogTrigger>
                                                <DialogContent className="w-[300px]">
                                                    <div className="flex flex-col gap-5">
                                                        <h1>Utilidades rápidas</h1>

                                                        <AlertDialog >
                                                            <AlertDialogDef title="Você deseja mudar o status desse colaborador?" content="Esse colaborador não vai poder ter acesso ao sistema!" h1="Mudar Status" clickContinue={async () => {

                                                                const changedStatus = collab.isActive ? false : true
                                                                await changeUserStatus({ userId: collab.id as string, status: changedStatus })
                                                                await load()
                                                            }}>

                                                            </AlertDialogDef>


                                                        </AlertDialog>

                                                    </div>

                                                    <div className="h-[1px] w-[100%] bg-accent"></div>

                                                    <h1>Configurações</h1>


                                                    <div>
                                                        <PutCollabModal initialData={{ email: collab.email, name: collab.name, role: collab.role }} id={collab.id as string} onClose={load}></PutCollabModal>
                                                    </div>


                                                </DialogContent>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>



                </Card>



            </div>




        </section>
    )
}
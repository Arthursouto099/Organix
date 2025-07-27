import React, { useState } from "react";
import { registerInfo } from "../types/allTypes";
import { registerUserOrg } from "../api/userApi";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";

export default function Register() {
    const [registerInfo, setRegisterInfo] = useState<registerInfo>({
        email: "",
        name: "",
        password: "",
        orgName: ""
    })


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterInfo({
            ...registerInfo,
            [e.target.name]: e.target.value
        })
    }


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fetchResponse = await registerUserOrg(registerInfo)
        if (fetchResponse.status) {
            toast.success("Usuario criado com sucesso")
            toast.success("Sua Organização/Empresa já estará disponível no seu dashboard")
            return
        }

        toast.error(fetchResponse.message)

    }


    return (

        <div className="min-h-screen w-full flex items-center justify-center">
            <Card className="m-4 w-full p-4  max-w-sm md:max-w-[900px] md:p-6">

                <div className="flex flex-col gap-2 justify-between m-3 py-3 md:flex-row ">
                    <div className=" flex flex-col w-full">
                        <div className="mb-5">
                            <h1 className="font-bold text-xl">Informações sobre o seu perfil</h1>
                            <p className="font-normal">Coletando seu dados para criar seu usuario</p>
                        </div>

                        <form action="" onSubmit={onSubmit} className="flex flex-col gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name"> Nome </Label>
                                <Input className="" id="name" name="name" type="text" placeholder="Usuario"
                                    value={registerInfo.name}
                                    required
                                    onChange={handleChange}



                                />
                            </div>
                            <div className="grid gap-2">
                                <Label> Email </Label>
                                <Input className="" id="email" name="email" type="text" placeholder="email@gmail.com"
                                    required
                                    value={registerInfo.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label> Senha </Label>
                                <Input className="" id="password" name="password" type="text" placeholder="***********"
                                    required

                                    value={registerInfo.password}
                                    onChange={handleChange}
                                />
                            </div>



                        </form>

                    </div>

                    <div className="w-[1px]   m-10 bg-violet-500"> </div>

                    <div className="flex flex-col w-full ">
                        <div className="mb-5">
                            <h1 className="font-bold text-xl">Informações referente a sua organização/empresa</h1>
                            <p className="font-normal">Coletando seu dados para criar sua org</p>
                        </div>
                        <form action="" onSubmit={onSubmit} className="flex flex-col gap-5">


                            <div className="grid gap-2">
                                <Label> Nome da empresa/org </Label>
                                <Input className="" id="org" name="orgName" type="text" placeholder="Empresa/Organização"
                                    required

                                    value={registerInfo.orgName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>CNPJ/CPF</Label>
                                <Input className="" id="org" name="orgName" type="text" placeholder="Empresa/Organização"
                                    disabled

                                 
                                />
                                  
                            </div>

                           
                            <Button type="submit"  variant={"default"}  className="bg-violet-500 text-gray-200 hover:bg-violet-400" >Create Account</Button>
                            
                        </form>
                    </div>
                </div>

            </Card>
        </div>

    )

}
import React, { useState } from "react";
import { loginInfo } from "../types/allTypes";
import { loginUser } from "../api/userApi";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useNavigate } from "react-router-dom";



export default function Login() {
    const navigate_login = useNavigate()

    const [loginInfo, setloginInfo] = useState<loginInfo>({
        email: "",
        password: "",

    })


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setloginInfo({
            ...loginInfo,
            [e.target.name]: e.target.value
        })
    }


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fetchResponse = await loginUser(loginInfo)
        if (fetchResponse.status) {
            toast.success("Usuario logado com sucesso")

            localStorage.setItem("token_access", fetchResponse.token)
            navigate_login("/home")
            return
        }

        toast.error(fetchResponse.message ? "Login Inválido" : fetchResponse.message)

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

                            {/* <div className="grid gap-2">
                                <Label> Email </Label>
                                <Input className="" id="email" name="email" type="text" placeholder="email@gmail.com"
                                    required
                                    value={loginInfo.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label> Senha </Label>
                                <Input className="" id="password" name="password" type="text" placeholder="***********"
                                    required

                                    value={loginInfo.password}
                                    onChange={handleChange}
                                />
                            </div> */}



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
                                <Label> Email </Label>
                                <Input className="" id="email" name="email" type="text" placeholder="email@gmail.com"
                                    required
                                    value={loginInfo.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label> Senha </Label>
                                <Input className="" id="password" name="password" type="text" placeholder="***********"
                                    required

                                    value={loginInfo.password}
                                    onChange={handleChange}
                                />
                            </div>


                            <Button type="submit" variant={"default"} className="bg-violet-500 text-gray-200 hover:bg-violet-400" >Login</Button>

                        </form>
                    </div>
                </div>

            </Card>
        </div>







    )

}
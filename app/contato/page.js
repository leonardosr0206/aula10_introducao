"use client"

import React from 'react';
import { useState } from "react"
import { ToastContainer, toast } from 'react-toastify';


export default function Contato(){

    const[ nome, setNome ] = useState("")
    const[ mensagem, setMensagem ] = useState("")
    const erro = () => toast.error("erro");
    const acerto = () => toast.acerto("acerto");
    

function enviaMensagem(e){

        e.preventDefault()

    if ( nome == "" || mensagem == ""  ){
        console.log("por favor envie de novo")
       erro()
    }else{
        console.log(" Mensagem enviada com sucesso! ")
        acerto()
    }
}


    return(
    <div>
        
        <h1>Pagina de Contato </h1>
        <p>Entre em contato conosco.</p>

        <hr/><br/>

        <form onSubmit={ (e)=> enviaMensagem (e) }>

        

                <label>
                    Digite seu nome:
                    <input onChange={ (e)=> setNome (e.target.value) }/>
                </label>

                <br/><br/>

                <label>
                    Digite sua mensagem:
                    <input onChange={ (e)=> setMensagem (e.target.value) }/>
                </label>

                <br/><br/>
                
                
        <button >enviar</button>
        
        
      
      
      
        </form>
    </div>
        )
}
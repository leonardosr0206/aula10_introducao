'use client'

import "./quiz.css"
import { useState } from "react";

function Quiz() {

const[ p1, alteraP1]=useState(0)
const[ p2, alteraP2]=useState(0)
const[ p3, alteraP3]=useState(0)
const[ p4, alteraP4]=useState("")
const[ total, alteraTotal]=useState(0)

const[selecionado, alteraSelecionado]=useState(["","","",""])

function calculaTotal(){
    if(p4== "Tropa de elite"){
        alteraTotal(p1+p2+p3+1)
    }else{
        alteraTotal(p1+p2+p3)
    }
}


    return ( 
        <div>
            <h1> QUiz Conradito</h1>
            <p> Assina-le opção correta!</p>

            <hr/>

            <h2> Qual a cor do cavalo branco de Napoleãum</h2>
            <label> <input name="p1"  type="radio" onChange={ ()=> alteraP1(1)}/> Preto </label>
            <br/>
            <label> <input name="p1" type="radio"  onChange={ ()=> alteraP1(0)}/> Azul </label>
            <br/>
            <label> <input name="p1" type= "radio"  onChange={ ()=> alteraP1(0)}/> Branco </label>
            <br/>
            <label> <input name="p1" type= "radio"  onChange={ ()=> alteraP1(0)}/> Transparente </label>
            
            <hr/>

            <h2> Qual a cor do cavalo branco de Napoleãum</h2>
            <label> <input name="p2"  type="radio" onChange={ ()=> alteraP2(1)}/> A </label>
            <br/>
            <label> <input name="p2" type="radio" onChange={ ()=> alteraP2(0)}/> B </label>
            <br/>
            <label> <input name="p2" type= "radio" onChange={ ()=> alteraP2(0)}/> C </label>
            <br/>
            <label> <input name="p2" type= "radio" onChange={ ()=> alteraP2(0)}/> D </label>

            <hr/>

            
            <h2> Quanto é dois + 2?</h2>
            
             <p className={selecionado [0]} onClick={()=> { alteraP3(0); alteraSelecionado(["selecinado","","",""])} }> 2</p> 
             <p className={selecionado [1]} onClick={()=> { alteraP3(0); alteraSelecionado(["","selecinado","",""])} }> 0</p> 
             <p className={selecionado [2]} onClick={()=> { alteraP3(0); alteraSelecionado(["","","selecinado",""])} }> aaaaa</p> 
             <p className={selecionado [3]} onClick={()=> { alteraP3(0); alteraSelecionado(["","","","selecinado"])} }> sim</p> 
            

    
            <br/>



            

            <h2> qual é o melhor filme do mundo?</h2>
            
<input onChange={ (e)=> alteraP4(e.target.value)}></input>
            

            <button onClick={ ()=> calculaTotal()}>Enviar respostas</button>
            
            <p> Total de pontos: {total} </p>
            
        </div>
     );
}

export default Quiz;
<div>
    <h1> QUiz Conradito</h1>
    <p> Assina-le opção correta!</p>

    <hr/>

    <h2> Qual a melhor letra</h2>
    <label> <input> type="radio"</input></label>

    <hr/>

    <h2> Quanto é dois + 2?</h2>

    <hr/>

    <h2> qual é o melhor anime do mundo?</h2>

</div>
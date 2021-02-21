import React , { useState, useEffect } from "react";
import { useRecoilState } from 'recoil';
import { ble_device, ble_characteristic } from '../data/data';
import AceEditor from "react-ace";
import { request_Device, disconnect_Device, send_01, send_command_to_device } from '../bluetooth-helper/bluetooth.js'

import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/snippets/javascript";

import "../css/Editor.css"

const JSEditor = () => {
    const [ code, set_code ] = useState('');
    const [ character, set_characteristic] = useRecoilState(ble_characteristic);
    const [ device , setDevice ] = useRecoilState(ble_device);

    const onChange = (newValue) => {
        console.log("change", newValue);
        set_code(newValue);
    }

    const run_code = async () => {
        try {
            await eval(code);
        } catch (e) {
            alert(e);
        }
    }

    const request_device = async () => {
        const { device, characteristic } = await request_Device();

        if(device){
            console.log(device, characteristic);
            set_characteristic(characteristic);
            setDevice(device);
        }
    }

    const disconnect = async () => {
        disconnect_Device(device);
        setDevice();
        set_characteristic();
    }

    const send01 = (event) => {
        event.preventDefault();
        send_01(character, event);
    }

    const move_forward = async (distance) => { //const name = () => {} worked with eval
        const command = 'JS,f,'+distance
        if(character){
            await send_command_to_device(character,command);
        }
        console.log(command);
    }

    const move_backward = async (distance) => {
        const command = 'JS,b,'+distance
        if(character){
            await send_command_to_device(character,command);
        }
        console.log(command);
    }

    const left = async (degree) => {
        const command = 'JS,l,'+degree
        if(character){
            await send_command_to_device(character,command);
        }
        console.log(command);
    }

    const right = async (degree) => {
        const command = 'JS,l,'+degree
        if(character){
            await send_command_to_device(character,command);
        }
        console.log(command);
    }

    const grab = async () => {
        const command = 'JS,g'
        if(character){
            await send_command_to_device(character,command);
        }
        console.log(command);
    }

    const ungrab = async () => {
        const command = 'JS,ug'
        if(character){
            await send_command_to_device(character,command);
        }
        console.log(command);
    }

    const beep = async (time) => {
        const command = 'JS,bp,'+ String(parseInt(time) !== undefined ? parseInt(time) : 1);
        if(character){
            await send_command_to_device(character,command);
        }
        console.log(command);
    }

    return(
        <div className="App">
            <h1>device: { device ? device.name : 'no device' }</h1>
            <div className='editor'>
                <AceEditor
                    mode="javascript"
                    theme="xcode"
                    onChange={onChange}
                    value={code}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                />
                <div>
                    <button className='run-btn' onClick={request_device}>connect</button>
                    <button className='run-btn' onClick={disconnect}>disconnect</button>
                    <button className='run-btn' onClick={send01} data-code="1">on led</button>
                    <button className='run-btn' onClick={send01} data-code="0">off led</button>
                    <button className='run-btn' onClick={run_code}>run</button>
                    <div className="helper">
                        <p>function robot</p>
                        <p>move_forward(paramiter) ; paramiter is distance in mm.</p>
                        <p>move_backward(paramiter) ; paramiter is distance in mm.</p>
                        <p>left(paramiter) ; paramiter is degree.</p>
                        <p>right(paramiter) ; paramiter is degree.</p>
                        <p>grab() ; grab object.</p>
                        <p>ungrab() ; ungrab object.</p>
                        <p>beep(time) ; beep. time in integer second.</p>
                        <p style={{margin: "20px"}}>
                            When you call a function javascript in an asynchronous language, 
                            the function does not complete a step, so it can't command the robot, 
                            so you need to use async-await for javascript to synchronous language. 
                            Example is
                        </p>
                        <p style={{ textAlign:"left", margin:"20px", display:"flex", justifyContent:"center" }}>
                            <code>
                                ================================================ <br></br>
                                //example 1. call 1 function
                                <br></br>
                                {`const myfunc = async () => {`} <br></br>
                                {`await left(10);`} <br></br>
                                {`await right(20);`}<br></br>
                                {`await grab(20);`} <br></br>
                                {`await move_forward(20);`} <br></br>
                                {`}`} <br></br>
                                {`myfunc(); //call myfunc function`} <br></br>
                                <br></br>
                                ================================================ <br></br>
                                //example 2. call 2 function
                                <br></br>
                                {`const myfunc2 = async () => {`} <br></br>
                                {`await left(10);`} <br></br>
                                {`await right(20);`}<br></br>
                                {`await grab(20);`} <br></br>
                                {`await move_forward(20);`} <br></br>
                                {`}`} <br></br>
                                {''} <br></br>
                                {`const myfunc3 = async () => {`} <br></br>
                                {`await left(10);`} <br></br>
                                {`await right(20);`}<br></br>
                                {`await grab(20);`} <br></br>
                                {`await move_forward(20);`} <br></br>
                                {`}`} <br></br>
                                {''} <br></br>
                                {`const call_2function = async () => {`} <br></br>
                                {`await myfunc2(); //call myfunc function`} <br></br>
                                {`await myfunc3(); //call myfunc function`} <br></br>
                                {`}`} <br></br>
                                {`call_2function(); //call myfunc function`} <br></br>

                            </code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JSEditor;
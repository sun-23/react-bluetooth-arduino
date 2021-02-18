import React , { useState } from "react";
import AceEditor from "react-ace";
import { request_Device, disconnect_Device, send_01, send_command_to_device, run_cmd } from '../bluetooth-helper/bluetooth.js'

import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/snippets/javascript";

import "../css/Editor.css"

const JSEditor = () => {
    const [ code, set_code ] = useState('')
    const [ character, set_characteristic] = useState();
    const [ device , setDevice ] = useState();

    function onChange(newValue) {
        console.log("change", newValue);
        set_code(newValue);
    }

    function run_code() {
        try {
            eval(code);
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

    async function disconnect(){
        disconnect_Device(device);
        setDevice();
        set_characteristic();
    }

    function send01(event){
        event.preventDefault();
        send_01(character, event);
    }

    const move_forward = (distance) => { //const name = () => {} worked with eval
        const command = 'JS,f,'+distance
        if(character){
            send_command_to_device(character,command);
        }
        console.log(command);
    }

    const move_backward = (distance) => {
        const command = 'JS,b,'+distance
        if(character){
            send_command_to_device(character,command);
        }
        console.log(command);
    }

    const left = (degree) => {
        const command = 'JS,l,'+degree
        if(character){
            send_command_to_device(character,command);
        }
        console.log(command);
    }

    const right = (degree) => {
        const command = 'JS,l,'+degree
        if(character){
            send_command_to_device(character,command);
        }
        console.log(command);
    }

    const grab = () => {
        const command = 'JS,g'
        if(character){
            send_command_to_device(character,command);
        }
        console.log(command);
    }

    const ungrab = () => {
        const command = 'JS,ug'
        if(character){
            send_command_to_device(character,command);
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
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                />
                <div>
                    <div className="helper">
                        <p>function robot</p>
                        <p>move_forward(paramiter) ; paramiter is distance in mm.</p>
                        <p>move_backward(paramiter) ; paramiter is distance in mm.</p>
                        <p>left(paramiter) ; paramiter is degree.</p>
                        <p>right(paramiter) ; paramiter is degree.</p>
                        <p>grab() ; grab object.</p>
                        <p>ungrab() ; ungrab object.</p>
                    </div>
                    <button className='run-btn' onClick={request_device} >connect</button>
                    <button className='run-btn' onClick={disconnect} >disconnect</button>
                    <button className='run-btn' onClick={send01} data-code="1" >on led</button>
                    <button className='run-btn' onClick={send01} data-code="0" >off led</button>
                    <button className='run-btn' onClick={run_code} >run</button>
                </div>
            </div>
        </div>
    )
}

export default JSEditor;
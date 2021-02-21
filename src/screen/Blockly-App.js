/* eslint-disable import/no-extraneous-dependencies */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Blockly from 'blockly';

import ReactBlockly from '../Blockly-component/index';
import ConfigFiles from '../Blockly-component/initContent/content';
import parseWorkspaceXml from '../Blockly-component/BlocklyHelper';
import "../css/Blockly.css";
import "../css/Editor.css"
import "../Blockly-component/costum-block.js";
import example_img from "../Blockly_example.png"

import { request_Device, disconnect_Device, send_01, send_command_to_device, delay } from '../bluetooth-helper/bluetooth.js'
import { useRecoilState } from 'recoil';
import { ble_device, ble_characteristic } from '../data/data';

const toolbox = [
  ...parseWorkspaceXml(ConfigFiles.INITIAL_TOOLBOX_XML),
  {
    name: 'SAMSUN_Bot',
    colour: '#eb596e',
    blocks: [
      {
        type: "forward"
      },
      {
        type: 'backward'
      },
      {
        type: 'left'
      },
      {
        type: 'right'
      },
      {
        type: 'async_function'
      },
      {
        type: 'call_async_function'
      },
      {
        type: 'call_function'
      },
      {
        type: 'await'
      },
      {
        type: 'print'
      },
    ]
  }
]

const Blocky_App = () => {

  const [toolboxCategories, setToolboxCategories] = useState(toolbox);

  const [ code, set_code ] = useState('');
  const [ character, set_characteristic] = useRecoilState(ble_characteristic);
  const [ device , setDevice ] = useRecoilState(ble_device);

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

  const workspaceDidChange = (workspace) => {
    workspace.registerButtonCallback('myFirstButtonPressed', () => {
      alert('button is pressed');
    });
    //const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    //document.getElementById('generated-xml').innerText = newXml;

    const code = Blockly.JavaScript.workspaceToCode(workspace);
    //document.getElementById('code').value = code;
    set_code(code);
    console.log(code);
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

  return (
    <div className="App">
      <h1>device: { device ? device.name : 'no device' }</h1>
      <div>
        <button className='run-btn' onClick={request_device}>connect</button>
        <button className='run-btn' onClick={disconnect}>disconnect</button>
        <button className='run-btn' onClick={send01} data-code="1">on led</button>
        <button className='run-btn' onClick={send01} data-code="0">off led</button>
        <button className='run-btn' onClick={run_code}>run</button>
      </div>
      <ReactBlockly
        toolboxCategories={toolboxCategories}
        workspaceConfiguration={{
          grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true,
          },
        }}
        initialXml={ConfigFiles.INITIAL_XML}
        wrapperDivClassName="fill-height"
        workspaceDidChange={workspaceDidChange}
      />
      {/* <div style={{height: "600px;", width: "800px;"}} id="blockly">
      </div>
      <pre id="generated-xml">
      </pre>
      <textarea id="code" style={{height: "200px;", width: "800px;"}} value=""></textarea> */}
      <p>example.</p>
      <img src={example_img} alt="example 1" style={{ height: "auto", width: "400px" }}></img>
    </div>
  )
}

export default Blocky_App
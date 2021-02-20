import React, { useState, useEffect } from 'react';
import "../css/CodeUI.css";
import { v4 as uuid } from 'uuid';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import LeftIcon from '@material-ui/icons/ArrowBackRounded';
import RightIcon from '@material-ui/icons/ArrowForwardRounded';
import BackwardIcon from '@material-ui/icons/ArrowDownwardRounded';
import ForwardIcon from '@material-ui/icons/ArrowUpwardRounded';
import RotateLeftRoundedIcon from '@material-ui/icons/RotateLeftRounded';
import RotateRightRoundedIcon from '@material-ui/icons/RotateRightRounded';
import CenterFocusStrongRoundedIcon from '@material-ui/icons/CenterFocusStrongRounded';
import CenterFocusWeakRoundedIcon from '@material-ui/icons/CenterFocusWeakRounded';
import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded';
import FunctionsRoundedIcon from '@material-ui/icons/FunctionsRounded';
// npm install react-beautiful-dnd@10.0.4 --force
// npm install styled-components@3.4.9 --force

import { request_Device, disconnect_Device, send_01, send_command_to_device, run_cmd } from '../bluetooth-helper/bluetooth.js'

const OBJ_BLOCKS = {
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
  [uuid()] : {},
}

const COMMANDS = [
  {
    id: uuid(),
    cmd:'f',
    content: 'forward',
    class_name: 'box f draggable',
    icon: <ForwardIcon fontSize="large"/>
  },
  {
    id: uuid(),
    cmd:'l',
    content: 'left',
    class_name: 'box l draggable',
    icon: <RotateLeftRoundedIcon fontSize="large"/>
  },
  {
    id: uuid(),
    cmd:'r',
    content: 'right',
    class_name: 'box r draggable',
    icon: <RotateRightRoundedIcon fontSize="large"/>
  },
  {
    id: uuid(),
    cmd:'b',
    content: 'backward',
    class_name: 'box b draggable',
    icon: <BackwardIcon fontSize="large"/>
  },
  {
    id: uuid(),
    cmd:'g',
    content: 'grab',
    class_name: 'box g draggable',
    icon: <CenterFocusStrongRoundedIcon fontSize="large"/>
  },
  {
    id: uuid(),
    cmd:'ug',
    content: 'ungrab',
    class_name: 'box g draggable',
    icon: <CenterFocusWeakRoundedIcon fontSize="large"/>
  },
  {
    id: uuid(),
    cmd:'bp',
    content: 'beep',
    class_name: 'box g draggable',
    icon: <VolumeUpRoundedIcon fontSize="large"/>
  },
  {
    id: uuid(),
    option: 'fn',
    cmd: 's',
    content: 'function',
    class_name: 'box-function draggable',
    loop_n: 1 ,
    start: 1 ,
    end: 1,
    icon: <FunctionsRoundedIcon fontSize="large"/>
  }
]

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

function App() {

  const [ character, set_characteristic] = useState();
  const [ device , setDevice ] = useState();
  const [ command, setCommand ] = useState();
  const [obj_blocks, set_obj_blocks] = useState(OBJ_BLOCKS);

  const request_device = async () => {
    const { device, characteristic } = await request_Device();
    console.log(device, characteristic);
    set_characteristic(characteristic);
    setDevice(device);
  }

  async function disconnect(){
    // if(device){
    //   await device.gatt.disconnect();
    //   setDevice();
    //   set_characteristic();
    // }else{
    //   alert('no device connected.');
    // }
    disconnect_Device(device);
    setDevice();
    set_characteristic();
  }

  function send01(event){
    event.preventDefault();
    send_01(character, event);
  }
  
  function send_command(e){
    e.preventDefault();
    send_command_to_device(character, command);
    setCommand('');
  }

  function run(e) {
    e.preventDefault();
    run_cmd(obj_blocks, character);
  }

  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const resultfvp = result;

    console.log('==> result', resultfvp);

    const dest = destination
    console.log('==> dest in log', dest.droppableId);

    const soc = source
    console.log('==> source in log', soc.droppableId);

    switch (source.droppableId) {
      case 'ITEMS':
        if(dest.droppableId !== "TRASH"){
          console.log('copy');
          const item = COMMANDS[source.index] 
          const copy_item = {...item, ["id"]: uuid()} //copy
          set_obj_blocks({
            ...obj_blocks,
            [dest.droppableId]: copy_item
          })
          console.log('item ', item);
          console.log('new item ',copy_item);
        } else {
          console.log('not copy');
        }
        break;
      default:
        if(dest.droppableId !== "TRASH"){
          console.log('move');
          const soc_id = soc.droppableId
          const move_item = obj_blocks[soc_id]
          console.log('soc id', soc_id);
          console.log('dest ', move_item);
          set_obj_blocks({
            ...obj_blocks,
            [soc.droppableId] : [],
            [dest.droppableId] : move_item
          })
          // const result = move(obj_blocks[soc.droppableId],obj_blocks[dest.droppableId],soc,dest)
          // console.log(result);
          // set_obj_blocks({
          //   ...obj_blocks,
          //   ...result
          // })
        } else {
          console.log("trash");
          set_obj_blocks({
            ...obj_blocks,
            [soc.droppableId] : []
          })
        }
        break;
    }
    console.log('obj', obj_blocks);
  };

  return (
      <DragDropContext onDragEnd={result => onDragEnd(result)}>
        <div className='App'>
        <h1>device: { device ? device.name : 'no device' }</h1>
        <button onClick={() => request_device()} className='button'>connect</button>
        <button onClick={() => disconnect()} className='button'>disconnect</button>
        <button onClick={send01} data-code="1" className='button'>on led</button>
        <button onClick={send01} data-code="0" className='button'>off led</button>
        <form onSubmit={send_command}>
          <input
            type='text'
            name='command'
            value={command}
            className='text-input'
            onChange={(e) => setCommand(e.target.value)}
          />
          <button type='submit' className='button'>send command</button>
        </form>
        <div className='code'>
        {Object.keys(obj_blocks).map((list, i) => {
          return (
            <Droppable key={list} droppableId={list}>
              {(provided, snapshot) => (
                <div 
                  className='box-code'
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                ><p>
                  {/* {list} */}
                  <p>BLOCK: {i}</p>
                  {undefined !== obj_blocks[list] && obj_blocks[list].id
                  ? (
                      <Draggable 
                        key={obj_blocks[list].id}
                        draggableId={obj_blocks[list].id}
                        index={0}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            className={obj_blocks[list].class_name} 
                          >
                            {obj_blocks[list].icon}
                            <p>
                              {obj_blocks[list].content}
                              {obj_blocks[list].option == 'fn' ? (
                                <>
                                  <div className="flex-div">
                                    <p>do {obj_blocks[list].loop_n} times</p>
                                    <input type='text' className='func-input' onChange={(e) => {
                                      const value = parseInt(e.target.value) 
                                      set_obj_blocks({
                                        ...obj_blocks,
                                        [list] : {
                                          ...obj_blocks[list],
                                          loop_n : value ? value : 1
                                        }
                                      })
                                    }}/>
                                  </div>
                                  <div className="flex-div">
                                    <p>start:{obj_blocks[list].start}</p>
                                    <input type='text' className='func-input' onChange={(e) => {
                                      const value = parseInt(e.target.value) 
                                      set_obj_blocks({
                                        ...obj_blocks,
                                        [list] : {
                                          ...obj_blocks[list],
                                          start : value !== null && value <= 13 && value >= 0 ? value : 0
                                        }
                                      })
                                    }}/>
                                  </div>
                                  <div className="flex-div">
                                    <p>end:{obj_blocks[list].end}</p>
                                    <input type='text' className='func-input' onChange={(e) => {
                                      const value = parseInt(e.target.value) 
                                      set_obj_blocks({
                                        ...obj_blocks,
                                        [list] : {
                                          ...obj_blocks[list],
                                          end : value !== null && value <= 13 && value >= 0 ? value : 0
                                        }
                                      })
                                    }}/>
                                  </div>
                                </>
                              ) : (
                                <p></p>
                              )}
                            </p>
                          </div>
                        )}
                      </Draggable>
                  ) : !provided.placeholder && (
                    <p> Default stop block </p>
                  )}
                </p></div>
              )}
            </Droppable>
          )
        })}
        </div>

        <div className='code-block'>
          <Droppable droppableId="ITEMS" isDropDisabled={true}>
            {(provided, snapshot) => (
              <div 
                className='code-block'
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}>
                {COMMANDS.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <React.Fragment>
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isDragging={snapshot.isDragging}
                          className={item.class_name} 
                        >
                          {item.icon}
                          <p>
                            {item.content}
                          </p>
                        </div>
                      </React.Fragment>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
          <button className='run-button' onClick={run}> run </button>
          <p>!!!when call function in fucntion it run stop command.!!!</p>
          <Droppable droppableId="TRASH">
            {(provided, snapshot) => (
              <div 
                className='big-box' 
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              ><p>
                <DeleteOutlineRoundedIcon fontSize="large"/>
              </p></div>
            )}
          </Droppable>
        </div>
        </div>
      </DragDropContext>
  );
}

export default App;
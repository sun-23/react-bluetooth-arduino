import React, { useState, Component } from 'react';
import "./App.css";
import { v4 as uuid } from 'uuid';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import LeftIcon from '@material-ui/icons/ArrowBackRounded';
import BackwardIcon from '@material-ui/icons/ArrowDownwardRounded';
import ForwardIcon from '@material-ui/icons/ArrowUpwardRounded';
import RightIcon from '@material-ui/icons/ArrowForwardRounded';
// npm install react-beautiful-dnd@10.0.4 --force
// npm install styled-components@3.4.9 --force

const SEND_SERVICE = 0xFFE0;
const SEND_SERVICE_CHARACTERISTIC = 0xFFE1;

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
    icon: <LeftIcon fontSize="large"/>
  },
  {
    id: uuid(),
    cmd:'r',
    content: 'right',
    class_name: 'box r draggable',
    icon: <RightIcon fontSize="large"/>
  },
  {
    id: uuid(),
    cmd:'b',
    content: 'backward',
    class_name: 'box b draggable',
    icon: <BackwardIcon fontSize="large"/>
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
    if (!navigator.bluetooth) {
      alert('Sorry, your browser doesn\'t support Bluetooth API');
    }

    // const device = await navigator.bluetooth.requestDevice({
    //     filters: [{ namePrefix:'robot' },{ services: [SEND_SERVICE] }]
    // }) ถ้าไม่ใส่ then ก็จะไม่ต้องเขียน return ใส่ catch ไม่มีปัญหา

    const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix:'robot' },{ services: [SEND_SERVICE] }]
    }).then((device) => {
        console.log("request device ok", device);
        return device; //ต้อง retrun ไม่งั้นจะไม่คืนค่า device กลับไป
    }).catch((error) => {
        console.log('error cannot request device', error);
    })

    const server = await device.gatt.connect().then((server) => {
        console.log("connect device ok");
        return server; //ต้อง retrun ไม่งั้นจะไม่คืนค่า server กลับไป
    }).catch((error) => {
        console.log("cannot connect device", error);
    })

    const service = await server.getPrimaryService(SEND_SERVICE).then((service) => {
        console.log("get service ok");
        return service; //ต้อง retrun ไม่งั้นจะไม่คืนค่า service กลับไป
    }).catch((error) => {
        console.log("cannot get service", error);
    })

    const characteristic = await service.getCharacteristic(SEND_SERVICE_CHARACTERISTIC).then((character) => {
        console.log("get characteristic ok");
        console.log("device name", device.name);
        alert('connect to device!');
        return character; //ต้อง retrun ไม่งั้นจะไม่คืนค่า characteristic กลับไป
    }).catch((error) => {
        console.log("cannot get characteristic", error);
        alert('cannot connect to device!');
    })

    set_characteristic(characteristic);
    setDevice(device);
  }

  async function disconnect(){
    if(device){
      await device.gatt.disconnect();
      setDevice();
      set_characteristic();
    }else{
      alert('no device connected.');
    }
  }

  function send01(event){
    const code = Number(event.target.dataset.code);
    let enc = new TextEncoder(); 
    console.log(code);
    if(character){
        character.writeValue(enc.encode(`<${code}>`)).then(() => {
            alert('send code ok')
        }).catch(() => {
            alert('cannot send')
        })
    }else{
      alert('no device connected.')
    }
  }
  
  function send_command(e){
    e.preventDefault();
    let enc = new TextEncoder(); // By default this encodes to utf-8
    // Why the <opening and closing> characters?
    // Went with this guy's example 3 for the reasons he mentions: https://forum.arduino.cc/index.php?topic=396450.0
    if(character){
        character.writeValue(enc.encode(`<${command}>`)).then(() => {
            alert('send code ok')
        }).catch(() => {
            alert('cannot send')
        })
    }else{
      alert('no device connected.')
    }
    setCommand('');
  }

  function run(e) {
    e.preventDefault();
    let enc = new TextEncoder();
    var text = '';
    console.log('run', obj_blocks);
    if(character){
        text = text + '<CODE,'
        Object.keys(obj_blocks).map((list,index) => {
            if(obj_blocks[list].cmd !== undefined){
                console.log(obj_blocks[list].cmd);
                //character.writeValue(enc.encode(`<${obj_blocks[list].content}>`));
                text = text + obj_blocks[list].cmd + ','
            } else {
                console.log('s');
                //character.writeValue(enc.encode('<stop>'));
                text = text + 's,'
            }
        })
        text = text + 'End>'
        console.log('text',text);
        character.writeValue(enc.encode(text)).then(() => {
            alert('send code ok')
        }).catch(() => {
            alert('cannot send')
        })
    }else{
        alert('no device connected.')
    }
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
                  {i}
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
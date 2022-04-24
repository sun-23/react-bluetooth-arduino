#include <SoftwareSerial.h>// import the serial library

SoftwareSerial mySerial(2, 3); // RX, TX
int ledpin=13; // led on D13 will show blink on / off
int BluetoothData; // the data given from Computer
// data sheet my arduino.net at-09 cc2451 hm-10 ble firmware MLT-BT05-V4.4

const byte numChars = 500;
char receivedChars[numChars];
boolean newData = false;

int wheel_dia=54.5; //      # mm (increase = spiral out)
int wheel_base=80; //,    # mm (increase = spiral in) 
int steps_rev=512; //,     # 512 for 64x gearbox, 128 for 16x gearbox
int delay_time=6; //            # time between steps in ms

// Stepper sequence org->pink->blue->yel
int L_stepper_pins[] = {11, 9, 8, 10};
int R_stepper_pins[] = {5, 7, 6, 4};

int fwd_mask[][4] =  {{1, 0, 1, 0},
                      {0, 1, 1, 0},
                      {0, 1, 0, 1},
                      {1, 0, 0, 1}};

int rev_mask[][4] =  {{1, 0, 0, 1},
                      {0, 1, 0, 1},
                      {0, 1, 1, 0},
                      {1, 0, 1, 0}};
 
void setup() {
  // put your setup code here, to run once:
  for(int pin=0; pin<4; pin++){
    pinMode(L_stepper_pins[pin], OUTPUT);
    digitalWrite(L_stepper_pins[pin], LOW);
    pinMode(R_stepper_pins[pin], OUTPUT);
    digitalWrite(R_stepper_pins[pin], LOW);
  }
  
  mySerial.begin(9600);
  mySerial.println("Bluetooth On please press 1 or 0 blink LED ..");

  Serial.begin(9600);

  sendCommand("AT");
  sendCommand("AT+ROLE0");
  sendCommand("AT+NAMErobot");
  sendCommand("AT+VERSION");
  
  pinMode(ledpin,OUTPUT);
}

void loop() {
  receiveWithStartEndMarkers();
  main_function();
  delay(100);// prepare for next data ...
//  for(int x=0; x<12; x++){
//    forward(100);
//    left(90);
//    right(90);
//    backward(100);
//  }
//  done();      // releases stepper motor
//  while(1);
}

void main_function() {
    if (newData == true) {
        Serial.print("This just in ... ");
        Serial.println(receivedChars);
        String receivedString = String(receivedChars);
        String receivedStrArray[20];
        if(receivedString == "1"){
          digitalWrite(ledpin,HIGH);
        } else if (receivedString == "0"){
          digitalWrite(ledpin,LOW);
        }
        if(getValue(receivedString,',',0) == "UI"){
          String command = getValue(receivedString,',',1);
          if(command == "f"){
            forward(100);
          }
          if(command == "b"){
            backward(100);
          }
          if(command == "l"){
            left(100);
          }
          if(command == "r"){
            right(100);
          }
          if(command == "g"){
            Serial.println("grab");
          }
          if(command == "ug"){
            Serial.println("ungrab");
          }
          if(command == "bp"){
            Serial.println("beep");
          }
        }
        if(getValue(receivedString,',',0) == "JS"){
          String command = getValue(receivedString,',',1);
          int deg = getValue(receivedString,',',2).toInt();
          int mm = getValue(receivedString,',',2).toInt();
          if(command == "f"){
            forward(mm);
          }
          if(command == "b"){
            backward(mm);
          }
          if(command == "l"){
            left(deg);
          }
          if(command == "r"){
            right(deg);
          }
          if(command == "g"){
            Serial.println("grab");
          }
          if(command == "ug"){
            Serial.println("ungrab");
          }
          if(command == "bp"){
            Serial.println("beep");
          }
        }
        newData = false;
        done(); // unlock stepper to save batterydone();
    }
}


void receiveWithStartEndMarkers() {
  static boolean receiveInProgress = false;
  static byte index = 0;
  char startMarker = '<';
  char endMarker = '>';
  char incomingCharacter;

  while (mySerial.available() > 0 && newData == false) {
    incomingCharacter = mySerial.read();

    if (receiveInProgress == true)
        if (incomingCharacter != endMarker) {
            receivedChars[index] = incomingCharacter;
            index++;
            if (index >= numChars) {
                index = numChars - 1;
            }
        }
        else {
            receivedChars[index] = '\0'; // terminate the string
            receiveInProgress = false;
            index = 0;
            newData = true;
        }
    else if (incomingCharacter == startMarker) {
        receiveInProgress = true;
    }
  }
}

// ----- HELPER FUNCTIONS -----------
int step(float distance){
  int steps = distance * steps_rev / (wheel_dia * 3.1412); //24.61
  return steps;  
}


void forward(float distance){
  int steps = step(distance);
  Serial.print("steps ");
  Serial.println(steps);
  for(int step=0; step<steps; step++){
    for(int mask=0; mask<4; mask++){
      for(int pin=0; pin<4; pin++){
        digitalWrite(L_stepper_pins[pin], rev_mask[mask][pin]);
        digitalWrite(R_stepper_pins[pin], fwd_mask[mask][pin]);
      }
      delay(delay_time);
    } 
  }
}


void backward(float distance){
  int steps = step(distance);
  for(int step=0; step<steps; step++){
    for(int mask=0; mask<4; mask++){
      for(int pin=0; pin<4; pin++){
        digitalWrite(L_stepper_pins[pin], fwd_mask[mask][pin]);
        digitalWrite(R_stepper_pins[pin], rev_mask[mask][pin]);
      }
      delay(delay_time);
    } 
  }
}


void right(float degrees){
  float rotation = degrees / 360.0;
  float distance = wheel_base * 3.1412 * rotation;
  int steps = step(distance);
  for(int step=0; step<steps; step++){
    for(int mask=0; mask<4; mask++){
      for(int pin=0; pin<4; pin++){
        digitalWrite(R_stepper_pins[pin], rev_mask[mask][pin]);
        digitalWrite(L_stepper_pins[pin], rev_mask[mask][pin]);
      }
      delay(delay_time);
    } 
  }   
}


void left(float degrees){
  float rotation = degrees / 360.0;
  float distance = wheel_base * 3.1412 * rotation;
  int steps = step(distance);
  for(int step=0; step<steps; step++){
    for(int mask=0; mask<4; mask++){
      for(int pin=0; pin<4; pin++){
        digitalWrite(R_stepper_pins[pin], fwd_mask[mask][pin]);
        digitalWrite(L_stepper_pins[pin], fwd_mask[mask][pin]);
      }
      delay(delay_time);
    } 
  }   
}


void done(){ // unlock stepper to save battery
  for(int mask=0; mask<4; mask++){
    for(int pin=0; pin<4; pin++){
      digitalWrite(R_stepper_pins[pin], LOW);
      digitalWrite(L_stepper_pins[pin], LOW);
    }
    delay(delay_time);
  }
}

String getValue(String data, char separator, int index){
  int found = 0;                                        
  int strIndex[] = {0, -1  };                              
  int maxIndex = data.length()-1;                            
  for(int i=0; i<=maxIndex && found<=index; i++){            
  if(data.charAt(i)==separator || i==maxIndex){              
  found++;                                                  
  strIndex[0] = strIndex[1]+1;                              
  strIndex[1] = (i == maxIndex) ? i+1 : i;                  
  }
 }
  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";  
}

void sendCommand(const char * command){
  Serial.print("Command send :");
  Serial.println(command);
  mySerial.println(command);
  //wait some time
  delay(1000);
  
  char reply[100];
  int i = 0;
  while (mySerial.available()) {
    reply[i] = mySerial.read();
    i += 1;
  }
  //end the string
  reply[i] = '\0';
  Serial.print(reply);
  Serial.println("Reply end");
}

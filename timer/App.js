import * as React from 'react';
import { Text, View, StyleSheet,Vibration,ScrollView,TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles=StyleSheet.create({
  main:{
    justifyContent:'center',
    width:windowWidth,
    height:windowHeight,
    borderWidth:1
  },
  counter:{
    flexDirection:'row',
    margin:10,
    justifyContent: 'center',
  },
  buttonPanel:{
    flexDirection:'row',
    justifyContent:'center',
  },
  button:{
    backgroundColor: '#ffcccc',
    margin: 10,
    width:70,
    height: 40,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:5,
  },
  buttontext:{
    color:"#cc0000"
  },
  text:{
    fontSize:55
  },
  timeselector:{
    flexDirection:'row',
    height:150,
    width:50,
    borderColor:"#000000"
  },
  scroll:{
    justifyContent:'center'
  },
  selectbutton:{
    backgroundColor: '#ffcccc',
    margin: 2,
    width:30,
    height: 20,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:5,
  }
})
const TimeOpt = props => <TouchableOpacity onPress={props.onclick} style={styles.selectbutton}><Text>{props.num}</Text></TouchableOpacity>



let flag=0
export class MainTimer extends React.Component{
  constructor(prop){
    super(prop)
    let min=prop.mins.toString()
    if(min.length==1){
      min="0"+min
    }
    let sec=prop.secs.toString()
    if(sec.length==1){
      sec="0"+sec
    }
    this.state={
      minutes:min,
      seconds:sec
    }
    this.inittime={
    minutes:min,
    seconds:sec
    }

    this.on=false
  }
  start(){
    Vibration.cancel()
    Vibration.vibrate(50)
    if(!this.on){
      this.on=true
      if(flag==1){
        this.setState(prevState=>({
          minutes:this.inittime.minutes,
          seconds:this.inittime.seconds
        }))
        flag=0
      }
      this.interval = setInterval(this.dec,1000)
    }
  }
  componentWillUnmount(){
    clearInterval(this.interval)
  }
  componentDidUpdate(prevprops,prevState)
  {
    if(prevState.minutes == "00" && prevState.seconds=="01"){
      clearInterval(this.interval)
      Vibration.vibrate([50,100,50],true)
      this.on=false
      flag=1
    }
  }
  stop(){
    Vibration.cancel()
    Vibration.vibrate(50)
    if(this.on){
    clearInterval(this.interval)
    this.on=false
    }
  }
  reset(){
    Vibration.cancel()
    clearInterval(this.interval)
    this.on=false
    Vibration.vibrate(50)
    this.setState(prevState=>({
      minutes:this.inittime.minutes,
      seconds:this.inittime.seconds
    }))
  }

  dec = ()=>{
    let min=parseInt(this.state.minutes)
    let sec=parseInt(this.state.seconds)
    if(sec-1 == -1){
      sec=59
      if(min-1 ==-1){
        min=0
      }
      else{
        min=min-1
      }
    }else{
      sec=sec-1
    }
    sec=sec.toString()
    min=min.toString()
    if(sec.length == 1){
      sec="0"+sec
    }
    if(min.length == 1){
      min="0"+min
    }
    this.setState({
      minutes:min,
      seconds:sec
    })
  }
  render(){
    return(
      <View style={styles.main}>
      <View style={styles.buttonPanel}>
      <TouchableOpacity style={styles.button} onPress={()=>this.start()}><Text style={styles.buttontext}>Start</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={()=>this.stop()}><Text style={styles.buttontext}>Stop</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={()=>this.reset()}><Text style={styles.buttontext}>Reset</Text></TouchableOpacity>
      </View>
      <View style={styles.counter}>
      <Text style={styles.text}>
      {this.state.minutes}:{this.state.seconds}
      </Text>
      </View>
      </View>
    )
  }
}
export default class App extends React.Component{
  constructor(){
    super()
    this.state={
      minutes:"25",
      seconds:"30",
      timeselected:false
    }

  }
  setminute(arg1){
    this.setState(prevState=>({
      minutes:arg1.toString(),
      seconds:prevState.seconds,
      timeselected:prevState.timeselected
    }))
  }
  setsecond(arg1){
  console.log("hola")
    this.setState(prevState=>({
      minutes:prevState.minutes,
      seconds:arg1.toString(),
      timeselected:prevState.timeselected
    }))
  }

  re(){
    Vibration.cancel()
    this.setState(prevState=>({
      minutes:prevState.minutes,
      seconds:prevState.seconds,
      timeselected: !prevState.timeselected
    }))
    console.log("Suup")
  }
  render(){
    let arr=[]
    for(let i=0;i<60;i++){
      arr.push(i)
    }
    if(!this.state.timeselected){
      return(
        <View style={styles.main}>
        <View style={{flexDirection:'row',justifyContent:'center',marginBottom:50}}>
        <Text style={{fontSize:30}}>Select Time</Text>
        </View>

            <View style={{flexDirection:'row',height:100,width:windowWidth,justifyContent:"center"}}>
                        <View style={{marginRight:10}}>
                        <Text style={{justifyContent:'center',fontSize:15}}>Minutes</Text>
                        <ScrollView >

                        {
                        arr.map(i=>(<TimeOpt key={i}  num={i} id={0} onclick={()=>this.setminute(i)}/>))
                        }
                        </ScrollView>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Text style={{fontSize:15}}>{this.state.minutes}</Text>
                        </View>
                        </View>
                        <View>
                            <Text style={{justifyContent:'center',fontSize:15}}>Seconds</Text>

                            <ScrollView >
                                {
                                    arr.slice(1).map(i=>(<TimeOpt key={i}  num={i} id={1} onclick={()=>this.setsecond(i)}/>))
                                }
                            </ScrollView>
                            <View style={{flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{fontSize:15}} >{this.state.seconds}</Text>
                            </View>
                        </View>
            </View>

        <View style={{margin:10,flexDirection:'row',justifyContent:'center'}}>
        <TouchableOpacity onPress={()=>this.re()} style={styles.button}><Text>Go</Text></TouchableOpacity>
        </View>
        </View>
      )
    }
    else{
      return(
        <View>
        <MainTimer mins={this.state.minutes} secs={this.state.seconds}/>
        <TouchableOpacity onPress={()=>this.re()} style={[styles.button,{position:'absolute',top:windowHeight-80,width:windowWidth-20}]}>
        <Text style={styles.buttontext}>Back</Text>
        </TouchableOpacity>
        </View>
    )
    }
  }
}
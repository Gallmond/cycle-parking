import React, { Component } from 'react'
import { View, Text, StyleSheet } from "react-native"
import BookmarkIcon from './BookmarkIcon'
import InfoPaneIcon from './InfoPaneIcon'
import SecureIcon from './SecureIcon'
import SpacesIcon from './SpacesIcon'
import StandTypeIcon from './StandTypeIcon'

class InfoPane extends Component{

  constructor(props){
    super(props)

    console.log('this.props', this.props);

    this.state = {
      is_hidden: true,
      height: '10%',
      text: 'no text',
      cyclepark: this.props.marker 
    }
  }

  toggle(){
    const is_hidden = !this.state.is_hidden
    this.setState({...this.state, is_hidden: is_hidden}, this.updateVisible)
    return this
  }
  show(){
    console.log('show', this.state)
    const is_hidden = false
    this.setState({...this.state, is_hidden: is_hidden}, this.updateVisible)
    return this
  }
  hide(){
    const is_hidden = true
    this.setState({...this.state, is_hidden: is_hidden}, this.updateVisible)
    return this
  }

  updateVisible(){
    console.log('updateVisible', this.state)
    this.setState({...this.state, height: this.state.is_hidden ? '0%' : '10%'})
    return this
  }

  setTextAndShow( new_text ){
    this.setState({text: new_text}, this.show)
    return this
  }

  isHidden(){
    return this.state.is_hidden
  }

  getStyle(){
    return {
      width: styles.view.width,
      height: this.state.height,
      backgroundColor: styles.view.backgroundColor,
      flexDirection: "row"
    }
  }

  render(){
    return (
      <View style={ this.getStyle() } >
        <StandTypeIcon standtype={this.props.marker.standtype} />
        <SpacesIcon spaces={this.props.marker.spaces} />
        <SecureIcon secure={this.props.marker.secure} />
        <BookmarkIcon />
        {/* <Text style={styles.text}>{this.state.text}</Text> */}
      </View>
    ) 
  }

}

// const InfoPane = ( props ) => {

//   toggle = () => {

//     is_hidden = !is_hidden

//     if(is_hidden){
//       styles.view.height = '0%'
//     }else{
//       styles.view.height = '10%'
//     }

//   }

//   return (
//     <View style={styles.view}>
//       <Text>{props.text}</Text>
//     </View>
//   )
// }

const styles = StyleSheet.create({
  view:{
    flex: 1,
    width: '100%',
    backgroundColor: 'blue'
  },
  text: {
    color: 'white',
    fontSize: 20
  }
})

export default InfoPane
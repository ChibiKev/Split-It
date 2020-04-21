import React from 'react';
import Tesseract from 'tesseract.js';
import './Camera.css'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import WrongPage from './WrongPage'

export default class Camera extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStep: 1,
      uploads: '',
      text: '',
      subtotal: 0,
      tax: 0,
      total: 0,
      orders: [],
      failAttempts: 0,
      found: false,
    };
  }

  wrongStep = () => {
    this.setState({
      currentStep: 1
    });
  };

  nextStep = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1
    });
  };

  prevStep = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1
    });
  };

  changeSubtotal = (newValue) => {
    this.setState({subtotal: newValue});
  }

  changeTax = (newValue) => {
    this.setState({tax: newValue});
  }

  changeTotal = (newValue) => {
    this.setState({total: newValue});
  }

  handleImageChange = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();

    if (e.target.files.length === 0) {
      return;
    }

    reader.onloadend = (e) => {
      this.setState({
        uploads: [reader.result],
        text: '',
        failAttempts: 0,
        found: false,
      });
    }
    reader.readAsDataURL(file);
  }

  generateText = () => {
    let uploads = this.state.uploads
    for(var i = 0; i < uploads.length; i++) {
      Tesseract.recognize(
        uploads[i], 
        'eng',
      { logger: m => console.log(m) }
      )
      .then(({ data: { text } }) => {
        console.log(text);
        this.setState({ 
          text: text,
          found: true,
        })
      })
      .catch(err => {
        console.error(err);
        this.setState({
          failAttempts: this.state.failAttempts + 1
        });
        if (this.state.failAttempts >= 3){
          alert('Failed To Read Photo!\n' + this.state.failAttempts + '/3\nRedirecting to User Input Page');
          window.location.href = '/UserInput';
        }
        else{
          alert('Failed To Read Photo!\n' + this.state.failAttempts + '/3\nTry Again!');
        }
      })
    }
  }

  parse = () => {
    let text = this.state.text;
    let number = 1;
    this.setState({ subtotal: 0 });
    this.setState({ tax: 0 });
    this.setState({ total: 0 });
    this.setState({ orders: [] });
    let temp = [];
    {text.split('\n').map((item, i) => {
      let array = item.split(' ');
      console.log(array);
      if(array.findIndex(word => 'subtotal' === word.toLowerCase()) > -1){
        this.changeSubtotal(array[array.length-1]);
      }
      else if(array.findIndex(word => 'tax' === word.toLowerCase()) > -1){
        this.changeTax(array[array.length-1]);
      }
      else if(array.findIndex(word => 'total' === word.toLowerCase()) > -1){
        this.changeTotal(array[array.length-1]);
      }
      else if(!isNaN(array[0]) && !isNaN(array[array.length-1]) && array[0] !== ''){
        let size = array.length;
        let quantity = array[0];
        let cost = array[size-1];
        let order = array.slice(1,size-1).join(" ");
        temp.push({number: `Order #${number}`, quantity: quantity, order: order, cost: cost, association: []});
        number++;
      }
    })}
    this.setState({ orders: temp })
  }

  changeOrderQuantity = (index) => e => {
    var newState = Object.assign({}, this.state);
    newState.orders[index].quantity = e.target.value;
    this.setState(newState);
  }

  setOrderQuantity = () => {
    var newState = Object.assign({}, this.state);
    var size = newState.orders.length;
    for (var i = 0; i < size; i++){
      if(newState.orders[i].quantity === ''){
        newState.orders[i].quantity = 1;
        this.setState(newState);
      }
    }
  }

  changeOrders = (index) => e => {
    var newState = Object.assign({}, this.state);
    newState.orders[index].order = e.target.value;
    this.setState(newState);
  }

  setOrders = () => {
    var newState = Object.assign({}, this.state);
    var size = newState.orders.length;
    for (var i = 0; i < size; i++){
      if(newState.orders[i].order === ''){
        newState.orders[i].order = newState.orders[i].number;
        this.setState(newState);
      }
    }
  }

  changeOrderCost = (index) => e => {
    var newState = Object.assign({}, this.state);
    newState.orders[index].cost = e.target.value;
    this.setState(newState);
  }

  setOrderCost = () => {
    var newState = Object.assign({}, this.state);
    var size = newState.orders.length;
    for (var i = 0; i < size; i++){
      if(newState.orders[i].cost === ''){
        newState.orders[i].cost = 0;
        this.setState(newState);
      }
    }
  }

  removeOrderSpecificRow = (index) => () => {
    var newState = Object.assign({}, this.state);
    newState.orders.splice(index,1);
    var size = newState.orders.length;
    for (var i = 0; i < size; i++){
      newState.orders[i].number = `Order #${i + 1}`;
    }
    this.setState(newState);
  }

  render() {
    const { currentStep, uploads, text, subtotal, tax, total, orders, failAttempts, found } = this.state;
    const Camera = { uploads, text, subtotal, tax, total, orders, failAttempts, found };

    switch (currentStep){
      case 1:
        return(
          <div className = "container">
            <Step1
              nextStep = {this.nextStep}
              handleImageChange = {this.handleImageChange}
              generateText = {this.generateText}
              parse = {this.parse}
              Camera = {Camera}
            />
          </div>
        );
      case 2:
        return(
          <div className = "container">
            <Step2
              prevStep = {this.prevStep}
              nextStep = {this.nextStep}
              changeOrderQuantity = {this.changeOrderQuantity}
              changeOrders = {this.changeOrders}
              changeOrderCost = {this.changeOrderCost}
              setOrderQuantity = {this.setOrderQuantity}
              setOrders = {this.setOrders}
              setOrderCost = {this.setOrderCost}
              removeOrderSpecificRow = {this.removeOrderSpecificRow}
              Camera = {Camera}
            />
          </div>
        );
      case 3:
        return(
          <div className = "container">
            <Step3
              prevStep = {this.prevStep}
              Camera = {Camera}
            />
          </div>
        );
      default:
          return(
            <div className = "container">
              <WrongPage
                wrongStep = {this.wrongStep}
              />
            </div>
          );
        }
      }
    }
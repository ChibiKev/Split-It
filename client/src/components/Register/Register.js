import React , { Component }from 'react';
import './Register.css';

export default class Register extends Component {
    constructor(props) {
      super(props);
      this.state = {
        name: "",
        email: "",
        password:"",
        password2: "",
      };
    }

    // Handle field change
    handleChange = input => e => {
      this.setState({ [input]: e.target.value });
    };

    // eventually api call to call the backend 
    handleSubmit = e => {
      e.preventDefault();
      const { name, email, password, password2 } = this.state;
      if (name == ''){
        alert("Please Enter a Username");
      }
      else if (email == ''){
        alert("Please Enter a Correct Email");
      }
      else if (password == ''){
        alert("Please Enter a Password");
      }
      else if (password != password2){
        alert("Your Password and Confirmation Password Do Not Match.");
      }
      else{
        // Insert Backend Here.
        console.log(this.state);
      }
    }
  
    render() {
      return (
        <div className="registerbox">
          <h4><u>Register</u></h4>
          <form className = "col s12">
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">account_circle</i>
                <input placeholder="Enter Name" id="first_name" type="text" onChange={this.handleChange('name')}/>
                <label>Username</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">email</i>
                <input id="email" type="email" placeholder="Enter Email" className="validate" onChange={this.handleChange('email')}/>
                <label>Email</label>
                <span className="helper-text" data-error="Invalid Email" data-success="Valid" onChange={this.handleChange('error')}>Please Enter a Valid Email</span>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">lock</i>
                <input id="password" type="password" placeholder="Enter Password" onChange={this.handleChange('password')}/>
                <label>Password</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">lock</i>
                <input type="password" placeholder="Reenter Password" onChange={this.handleChange('password2')}/>
                <label>Confirm Password</label>
              </div>
            </div>
          </form>
          <button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.handleSubmit}>Sign Up<i className="material-icons right">send</i></button>
        </div>
      );
    }
}
import React, { Component } from 'react';

import axios from 'axios';
import { Route } from 'react-router';

const base_url = "http://localhost:8080";

class Login extends Component{
    state = {
        inputs: {
            mdlName: "",
            mdlPassword: "",
        },
        mdlError: null,
    }

    constructor(props) {
        super(props);

        this.validate = this.validate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        
    }

    async validate(){
        let formData = {
            "userId":0,
            "userName": this.state.inputs.mdlName,
            "password": this.state.inputs.mdlPassword
        }
        let response = await axios.post(base_url + "/authenticate", formData);
        let data = response.data;
        if(data == "OK"){
            await this.setState({
                mdlError: "LOGINED"
            })
            setTimeout(window.location.href="/homepage", 5000)
        }
        else{
            await this.setState({
                mdlError: data
            })
        }
    }
    
    async handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        await this.setState({
            inputs:{
                ...this.state.inputs,
                [name]: value
            }
        })
    }
    render() {
        const { inputs, errors} = this.state;
        return (
            <>
                Login<br/><br/>
                K Adı: <br/>
                <input type="text" value={this.state.inputs.mdlName} name="mdlName" onChange={this.handleInputChange} /> <br/>
                Şifre : <br/>
                <input type="password" value={this.state.inputs.mdlPassword} name="mdlPassword" onChange={this.handleInputChange} /> <br/>
                <button onClick={() => this.validate()}>Giriş Yap</button> <br/>
                {this.state.mdlError}
            </>
        )
    }
}
export default Login;
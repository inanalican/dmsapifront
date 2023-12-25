import React, { Component } from 'react';

import axios from 'axios';
import { Route } from 'react-router';

const base_url = "http://localhost:8080/user";

class HomePage extends Component{
    state = {
        userList: [],
        inputs: {
            mdlId: 0,
            mdlName: "",
            mdlPassword: "",
        },
        edit: {
            mdlId: 0,
            mdlName: "",
            mdlPassword: "",
        },
        mdlError: null,
    }

    constructor(props) {
        super(props);

        this.getUsers = this.getUsers.bind(this);
        this.createUser = this.createUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.editUser = this.editUser.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleEditInputChange = this.handleEditInputChange.bind(this);
        
    }

    async getUsers(){
        let response = await axios.get(base_url + "/get-all");
        let data = response.data;

        await this.setState({
            userList: data
        })
    }
    
    async createUser(){
        let formData = {
            "userId" : this.state.inputs.mdlId,
            "userName": this.state.inputs.mdlName,
            "password": this.state.inputs.mdlPassword,
        }
        let response = await axios.post(base_url + "/create", formData);
        let data = response.data;
        if(data == "OK"){
            await this.setState({
                editMode:false
            })
            await this.getUsers();
        }
        else{
            await this.setState({
                mdlError: data
            })
        }
    }
    async updateUser(){
        let formData = {
            "userId" : this.state.edit.mdlId,
            "userName": this.state.edit.mdlName,
            "password": this.state.edit.mdlPassword,
        }
        let response = await axios.put(base_url + "/update", formData);
        let data = response.data;
        if(data == "OK"){
            await this.setState({
                editMode:false
            })
            await this.getUsers();
        }
        else{
            await this.setState({
                mdlError: data
            })
        }
    }

    async deleteUser(id){
        let response = await axios.delete(base_url + "/delete/" + id);
        let data = response.data;
        if(data == "OK"){
            await this.setState({
                editMode:false
            })
            await this.getUsers();
        }
        else{
            await this.setState({
                mdlError: data
            })
        }
    }

    async editUser(userId){
        let item = this.state.userList.filter(x => x.userId == userId)[0]
        await this.setState({
            editMode:true,
            edit:{
                mdlId: item.userId,
                mdlName: item.userName,
                mdlPassword: "",
            }
        })
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

    async handleEditInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        await this.setState({
            mdlError:null,
            edit:{
                ...this.state.edit,
                [name]: value
            }
        })
    }

    async componentDidMount() {
        this.getUsers();
    }

    render() {
        const { inputs, errors, userList} = this.state;
        console.log(userList)
        return (
            <>
            <a href="/homepage">User Page</a><br/>
            <a href="/file-operations">File Operations</a><br/><br/><br/><br/><br/><br/>
                <table border="1" className='borderClass'>
                    <thead>
                        <tr>
                            <td>User Id</td>
                            <td>User Name</td>
                            {this.state.editMode &&
                                <td>User Password</td>
                            }
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                    {userList.map((item) => (
                        <tr>
                            <td>
                                {item.userId}
                            </td>
                            
                            {!this.state.editMode || this.state.edit.mdlId != item.userId ? (
                                <>
                                    <td>
                                        {item.userName}
                                    </td>
                                    <td>
                                        <a onClick={() => this.editUser(item.userId)}>Edit</a>
                                    /
                                        <a onClick={() => this.deleteUser(item.userId)}>Delete</a>
                                    </td>
                                </>
                            ):(
                                <>
                                <td>
                                    <input type="text" value={this.state.edit.mdlName} name="mdlName" onChange={this.handleEditInputChange} /> 
                                </td>
                                <td>
                                    <input type="password" value={this.state.edit.mdlPassword} name="mdlPassword" onChange={this.handleEditInputChange} /> 
                                </td>
                                <td>
                                    <a onClick={() => this.updateUser(item.userId)}>Update</a>
                                    /
                                    <a onClick={() => this.deleteUser(item.userId)}>Delete</a>
                                </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
                {this.state.mdlError}
                <br/><br/>Create User<br/><br/>
                    <input type="text" value={this.state.inputs.mdlName} name="mdlName" onChange={this.handleInputChange} /> 
                    <input type="password" value={this.state.inputs.mdlPassword} name="mdlPassword" onChange={this.handleInputChange} /> 
                    <button onClick={() => this.createUser()}>Kaydet</button>
            </>
        )
    }
}
export default HomePage;
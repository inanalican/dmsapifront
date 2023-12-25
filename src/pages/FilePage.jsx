import React, { Component } from 'react';

import axios from 'axios';
import { Route } from 'react-router';

const base_url = "http://localhost:8080/files";

class FilePage extends Component{
    state = {
        fileList: [],
        inputs: {
            mdlId: 0,
            mdlName: "",
            mdlFile: null,
        },
        edit: {
            mdlId: 0,
            mdlName: "",
            mdlFile: null,
        },
        mdlFileData: "",
        mdlError: null,
    }

    constructor(props) {
        super(props);

        this.getFiles = this.getFiles.bind(this);
        this.createFile = this.createFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.editFile = this.editFile.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleEditFileChange = this.handleEditFileChange.bind(this);
        this.handleEditInputChange = this.handleEditInputChange.bind(this);
        
    }

    handleFileChange = (e) => {
        let file = e.target.files[0];

        this.setState({
            inputs:{
                ...this.state.inputs,
                mdlFile: file
            }
        })
    }
    handleEditFileChange = (e) => {
        let file = e.target.files[0];

        this.setState({
            edit:{
                ...this.state.edit,
                mdlFile: file
            }
        })
    }

    // Image/File Submit Handler
    handleSubmitFile = () => {

        if (this.state.image_file !== null){

            let formData = new FormData();
            formData.append('customFile', this.state.mdlFile);
            // the image field name should be similar to your api endpoint field name
            // in my case here the field name is customFile

            axios.post(
                this.custom_file_upload_url,
                formData,
                {
                    headers: {
                        "Authorization": "YOUR_API_AUTHORIZATION_KEY_SHOULD_GOES_HERE_IF_HAVE",
                        "Content-type": "multipart/form-data",
                    },                    
                }
            )
            .then(res => {
                console.log(`Success` + res.data);
            })
            .catch(err => {
                console.log(err);
            })
        }
    }

    async getFiles(){
        let response = await axios.get(base_url + "/get-all");
        let data = response.data;

        await this.setState({
            fileList: data
        })
    }

    async getFile(id){
        let response = await axios.get(base_url + "/get-file/" + id);
        let data = response.data;

        await this.setState({
            mdlFileData: data
        })
    }
    
    async createFile(){
        let hasError = false;
        if(this.state.inputs.mdlFile == null){
            hasError = true;
            await this.setState({
                mdlError: "Please select a file!"
            })
        }
        if(this.state.inputs.mdlName == ""){
            hasError = true;
            await this.setState({
                mdlError: "Please enter a file name!"
            })
        }
        if(!hasError){
            let formData = new FormData();
            formData.append('fileName', this.state.inputs.mdlName);
            formData.append('file', this.state.inputs.mdlFile);
            let response = await axios.post(base_url + "/create", formData,{
                headers: {
                    "Content-type": "multipart/form-data",
                },                    
            });
            let data = response.data;
            if(data == "OK"){
                await this.setState({
                    editMode:false
                })
            }
            else{
                await this.setState({
                    mdlError: data
                })
                console.log("data", data)
            }
            await this.clearInputs();
            await this.getFiles();
        }
    }
    async clearInputs(){
        await this.setState({
            inputs: {
                mdlId: 0,
                mdlName: "",
                mdlFile: null,
            },
            edit: {
                mdlId: 0,
                mdlName: "",
                mdlFile: null,
            },
            mdlFileData: ""
        })
    }
    async updateFile(){
        let formData = new FormData();
        formData.append('id', this.state.edit.mdlId);
        formData.append('fileName', this.state.edit.mdlName);
        formData.append('file', this.state.edit.mdlFile);
        let response = await axios.put(base_url + "/update", formData,{
            headers: {
                "Content-type": "multipart/form-data",
            },                    
        });
        let data = response.data;
        if(data == "OK"){
            await this.setState({
                editMode:false
            })
            await this.clearInputs();
        }
        else{
            await this.setState({
                mdlError: data
            })
        }
        await this.setState({
            editMode:false
        })
        await this.getFiles();
    }

    async deleteFile(id){
        await axios.delete(base_url + "/delete/" + id)
        .then(res => {
            console.log("res", res)
            if(res.data == "OK"){
                this.setState({
                    editMode:false
                })
            }
            else{
                this.setState({
                    mdlError: res.data
                })
            }
        })
        .catch(err => {
            this.setState({
                mdlError: "Error!"
            })
        });
        await this.clearInputs();
        await this.getFiles();
    }

    async editFile(fileId){
        let item = this.state.fileList.filter(x => x.id == fileId)[0]
        await this.setState({
            editMode:true,
            edit:{
                mdlId: item.id,
                mdlName: item.fileName,
                mdlFile: "",
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
        this.getFiles();
    }

    render() {
        const { inputs, errors} = this.state;
        return (
            <>  
            
            <a href="/file-operations">File Operations</a><br/>
            <a href="/homepage">User Page</a><br/><br/><br/><br/><br/><br/>
            
            
                <table border="1" className='borderClass'>
                    <thead>
                        <tr>
                            <td>File Id</td>
                            <td>File Name</td>
                            <td>File Path</td>
                            <td>File Extension</td>
                            <td>File Size</td>
                            {this.state.editMode &&
                                <td>File </td>
                            }
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.fileList.map((item) => (
                        <tr>
                            <td>
                                {item.id}
                            </td>
                            
                            {!this.state.editMode || this.state.edit.mdlId != item.id ? (
                                <>
                                    <td>
                                        {item.fileName}
                                    </td>
                                    <td>
                                        {item.filePath}
                                    </td>
                                    <td>
                                        {item.fileTypeName}
                                    </td>
                                    <td>
                                        {item.fileSize} Bytes
                                    </td>
                                    <td>
                                    <a onClick={() => this.getFile(item.id)}>Get File</a>
                                    /
                                        <a onClick={() => this.editFile(item.id)}>Edit</a>
                                    /
                                        <a onClick={() => this.deleteFile(item.id)}>Delete</a>
                                    </td>
                                </>
                            ):(
                                <>
                                <td>
                                    <input type="text" value={this.state.edit.mdlName} name="mdlName" onChange={this.handleEditInputChange} /> 
                                </td>
                                
                                <td>
                                        {item.filePath}
                                    </td>
                                    <td>
                                        {item.fileTypeName}
                                    </td>
                                    <td>
                                        {item.fileSize} Bytes
                                    </td>
                                <td>
                                    <input
                                        type="file"
                                        onChange={this.handleEditFileChange}
                                    />
                                </td>
                                <td>
                                    <a onClick={() => this.getFile(item.id)}>Get File</a>
                                    /
                                    <a onClick={() => this.updateFile(item.id)}>Update</a>
                                    /
                                    <a onClick={() => this.deleteFile(item.id)}>Delete</a>
                                </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
                File Data : <br/>
                {this.state.mdlFileData} <br/>
                Messages :  <br/>
                {this.state.mdlError}
                <br/><br/>Create File<br/><br/>
                    <input
                        type="file"
                        onChange={this.handleFileChange}
                    />
                    <input type="text" value={this.state.inputs.mdlName} name="mdlName" onChange={this.handleInputChange} /> 
                    <button onClick={() => this.createFile()}>Kaydet</button>
            </>
        )
    }
}
export default FilePage;
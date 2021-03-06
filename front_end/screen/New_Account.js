import {Container, Text,Header, Content, Card, Body, Right, Left, Button, Form, Item, Label, Input, Picker, CardItem} from 'native-base';
import React, {Component} from 'react';
import { StyleSheet, View, TextInput, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useCardAnimation } from 'react-navigation-stack';
//import { TextInput } from 'react-native-gesture-handler';

class New_Account extends Component {
    constructor(props){
        super(props);
        this.state={
            username: '',
            password: '',
            checkpassword: '',
            balance: ''
        }
    }
    render(){
        return(
            <Container>
                <View style = {{backgroundColor: '#23596e', justifyContent: 'center',height: '20%', alignItems: 'center', alignContent: 'center'}}>
                    <Icon name = 'accusoft' color= 'white' size={30} style = {{padding: 5}}></Icon>
                    <Text style = {{fontFamily: 'Roboto', fontSize: 25,fontWeight: 'bold', color: 'white'}}>Financial Management App</Text>
                </View>
                <View style = {styles.main}>
                    <View>
                        <Form style = {{width: 300}}>
                            <Card>
                                <CardItem style = {{backgroundColor: '#23596e'}}>
                                <TextInput onChangeText = {(text) => this.setState({username: text})}
                                 placeholder={'Username'} placeholderTextColor={"#e1e9f5"} style = {{color: 'white', width: 250}}></TextInput>
                                </CardItem>
                            </Card>
                            <Card>
                            <CardItem style = {{backgroundColor: '#23596e'}}>
                                <TextInput onChangeText = {(text) => this.setState({password: text})}
                                placeholder={'Password'} placeholderTextColor={"#e1e9f5"} secureTextEntry = {true} style={{color: 'white', width: 250}} ></TextInput>
                            </CardItem>
                            </Card>
                            <Card>
                                <CardItem style = {{backgroundColor: '#23596e'}}>
                                <TextInput onChangeText = {(text) => this.setState({checkpassword: text})}
                                 placeholder={'Retype your password'} placeholderTextColor={"#e1e9f5"} secureTextEntry = {true} style = {{color: 'white', width: 250}}></TextInput>
                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem style = {{backgroundColor: '#23596e'}}>
                                <TextInput onChangeText = {(text) => this.setState({balance: text})}
                                 keyboardType = {'numeric'} placeholder={'Balance'} placeholderTextColor={"#e1e9f5"} style = {{color: 'white', width: 200}}></TextInput>
                                 <Text style = {{color: 'white'}}>VND</Text>
                                </CardItem>
                            </Card>
                        </Form>
                    </View>
                    <View style = {{flexDirection: 'row'}}>
                        <Button style = {{width: 140, margin: 5}} onPress={() => this.create_new_account()}>
                            <View style = {{alignContent: 'center', alignItems: 'center',width: 140}}>
                                <Text style={styles.text}>OK</Text>
                            </View>
                        </Button>
                        <Button style = {{width: 140, margin: 5}} onPress={() => this.login()}>
                            <View style = {{alignContent: 'center', alignItems: 'center',width: 140}}>
                                <Text style = {styles.text}>Login</Text>
                            </View>
                        </Button>
                    </View>
                </View>
            </Container>
        )
    }

    async create_new_account(){
        let username_list = await fetch('http://10.0.2.2:5000/get/user');
        username_list = await username_list.json();
        let ok = 1;
        if(this.state.username == '' || this.state.password == '' || this.state.balance == ''){
            ok = 0;
            alert('Enter information!');
        }
        if(ok == 1){
            for (let i = 0; i<username_list.length;i++){
                if(this.state.username == username_list[i].account){
                    ok = 0;
                    alert("Username has been used!");
                    break;
                }
            }
        }
        if(ok == 1 && this.state.password != this.state.checkpassword){
            ok = 0;
            alert("Check password failed");
        }

        if(ok == 1){
            let id = await fetch('http://10.0.2.2:5000/add/user',{
                method: 'post',
                mode: 'no-cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    "account": this.state.username,
                    "pass": this.state.password,
                    "balance": parseInt(this.state.balance)
                })
            })
            id = await id.json();
            this.setState({
                username: '',
                password: '',
                checkpassword: '',
                balance: ''
            })
            this.props.navigation.navigate('main_screen', {userid: id[0].iduser})
        }
    }

    async login(){
        this.setState({
            username: '',
            password: '',
            checkpassword: '',
            balance: ''
        })
        this.props.navigation.navigate('Login')
        /* if(this.state.username == '' || this.state.password == ''){
            alert('Enter username and password');
        }
        else{ 
            let res = await fetch('http://10.0.2.2:5000/login/' + this.state.username + '/' + this.state.password);
            let data = await res.json();
            if(data.length!=0){
                console.log('OK');
                this.props.navigation.navigate('main_screen', {
                    userid: data[0].iduser,
                })
            }
            else{
                alert('Wrong username or password');
            }
        } */
    }

    async componentDidMount(){
        this.setState({
            username: '',
            password: ''
        })
    }
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: 'white',
        alignContent: 'center',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    text: {
        fontFamily: 'notoserif', 
        fontSize: 18,
        fontWeight: 'bold', 
        color: '#ffffff'
    }
})

export default New_Account;
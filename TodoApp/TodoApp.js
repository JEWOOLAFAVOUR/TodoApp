import React from 'react';
import {StyleSheet, View, Text, SafeAreaView, TextInput, Image, Alert} from 'react-native';
import {TouchableOpacity, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {primary: '#1f145c', white: '#fff'};
const TodoApp = () => {
  const [textInput, setTextInput] = React.useState('')
  const [todos, setTodos] = React.useState([]);
  React.useEffect(()=>{
    getTodosFromUserDevice();
  },[])
  React.useEffect(()=>{
    saveTodoToUserDevice(todos);
  },[todos]);

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1,}}>
          <Text style={{fontWeight: 'bold', fontSize: 15, color: COLORS.primary, textDecorationLine: todo?.completed? 'line-through' : 'none' }}>{todo?.task}</Text>
        </View>
        {
          !todo?.completed && (
          <TouchableOpacity style={[styles.actionIcon]} onPress={()=>markTodoComplete(todo?.id)}>
          <Image source={require('./mark1.png')}
            style={{width: 20, height: 20,}}/>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={[styles.actionIcon, {backgroundColor: 'red'}]}
          onPress={()=>deleteTodo(todo?.id)}>
        <Image source={require('../TodoApp/delete.png')}
          style={{width: 20, height: 20, tintColor: 'white'}}/>
        </TouchableOpacity>
      </View>
    );
  };

  const saveTodoToUserDevice = async (todos) => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (e) {
      console.log(e)
      //saving error
    }
  };
  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if(todos != null){
        setTodos(JSON.parse(todos))
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = () =>{
    if(textInput == ''){
      Alert.alert('Error', 'Please input todo')
    }else{
       const newTodo = {
        id:Math.random(),
        task: textInput,
        completed:false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('')
    }
  };
    
  const markTodoComplete = (todoId) => {
    const newTodos = todos.map((item)=>{
      if(item.id == todoId){
        return{...item, completed: true}
      }
      return item; 
    });
    setTodos(newTodos);
  };
  
  const deleteTodo = (todoId) => {
    const newTodo = todos.filter((item) => item.id != todoId);
    setTodos(newTodo)
  };
  const clearTodo = () => {
    Alert.alert("Confirm", "Clear todos?", [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
    {text: 'No'},
    ])
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>TODO APP</Text>
        <TouchableOpacity onPress={clearTodo}>
        <Image source={require('../TodoApp/delete.png')}
          style={{height: 20, width: 25, tintColor: 'red'}}/>
          </TouchableOpacity>
      </View>

      <FlatList 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item})=><ListItem todo={item}/>}
      />

      {/* FOOTER */
      }
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput placeholder='Add Todo'  
            value={textInput}
            onChangeText={(text)=>setTextInput(text)}/>
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
          <Text style={{fontSize: 30, color: COLORS.white, fontWeight: 'bold'}}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TodoApp;
const styles = StyleSheet.create({
  header:{
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer:{
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40, 
    flex: 1, 
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  iconContainer:{
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  listItem:{
    padding: 20, 
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon:{
    height: 25, 
    width: 25, 
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5, 
    borderRadius: 3,
  },
});
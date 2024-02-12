import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

const ModelScreen = ({ route, navigation }) => {
  const { problem, description, images, treatment } = route.params;
  const navigateBack = () => {
    navigation.goBack(); // Navigate back to the previous screen (Information screen)
  };

  return (
    
      <View style={{ flex: 1, marginTop: 40 }}>
        <ScrollView>
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={myStyles.backIcon}>
          <Ionicons name="chevron-back-outline" size={24} color="#333" />
        </TouchableOpacity> */}

        <Image source={{ uri: images }} style={myStyles.image} />

        <View style={myStyles.Container}>
          <Text style={myStyles.header}>Problem: {problem}</Text>

          <Text style={myStyles.subHeader}>description</Text>
          <Text>{description}</Text>

          <Text style={{color: "green", alignSelf: "center", fontSize: 20, marginTop: 5}}>Treatment</Text>

          <Text style={myStyles.subHeader}>Biological Solution</Text>
              {
                treatment.biological != undefined ? (
                  treatment.biological.map((plant, index) => {           
                    return(
                      <View key={index}>
                        <Text>{plant}</Text>
                      </View>
                    )
                  })
                ) : (<View><Text>No data</Text></View>)
              }

          <Text style={myStyles.subHeader}>chemical Solution</Text>
              {
                treatment.chemical != undefined ? (
                  treatment.chemical.map((plant, index) => {           
                    return(
                      <View key={index}>
                        <Text>{plant}</Text>
                      </View>
                    )
                  })
                ) : (<View><Text>No chemical Solution </Text></View>)
              }

          <Text style={myStyles.subHeader}>Prevention Solution</Text>
              {
                treatment.prevention != undefined ? (
                  treatment.prevention.map((plant, index) => {           
                    return(
                      <View key={index}>
                        <Text>{plant}</Text>
                      </View>
                    )
                  })
                ) : (<View><Text>No prevention found</Text></View>)
              }

          <Pressable onPress={navigateBack} style={myStyles.button}>
            <Text style={myStyles.buttonText}>Go Back</Text>
          </Pressable>
        </View>
        </ScrollView>
      </View>
    
  );
};

const myStyles = StyleSheet.create({
  image: {
    width: "90%",
    height: 250,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 8,
  },
  backIcon:{
    borderRadius:50,
    borderBottomColor:"lightblue",
    backgroundColor:"lightblue",
    marginRight:15,
    marginLeft:15,
}, 
  Container: {   
    marginLeft: "3%",
    marginRight: "3%",
    marginTop: "5%",
    backgroundColor: "grey",
    backgroundColor: "white",
    borderRadius: 8,
    padding: "2%",
  },
  header: {
    fontSize: 20,
    color: "green",
    marginBottom: 2,
  },
  
  button: {
    marginTop: 10,
    backgroundColor: "#00cc66",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  subHeader: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
  }
});

export default ModelScreen;

import { useState, useEffect } from "react";
import { View, Text, Alert, Image, StyleSheet, FlatList, Pressable, useWindowDimensions, ScrollView } from "react-native";
import CustomButton from "../customs/CustomButton/CustomButton";
import CustomLoader from "../customs/CustomLoading/customLoader";
import Ionicons from '@expo/vector-icons/Ionicons';
import LoadingAnimation from "../customs/Custom-Animations/PlantLoader";

import { collection, addDoc, Timestamp, doc, setDoc } from 'firebase/firestore';
import { db, auth  } from '../Data/Firebase'; 

const ResultsScreen = ({ route, navigation }) => {

    const [isLoading, setIsLoading] = useState(false);
    const{data} = route.params;
    //const{email} = route.params;
    const{isHealthy} = route.params;
    //console.log("is plant healthy? ", isHealthy);
    //console.log(data[2].disease_details.treatment);
    const{scanImg} = route.params;
    //console.log(scanImg); 
    const[viewItem, setViewItem] = useState(false);
    const[chosenDetails, setChosenDetails] = useState();

    const [userId, setUserId] = useState(null); // Add the userId state here

    // Fetch the user's UID from Firebase Authentication
    const fetchUserId = async () => {
        
        try {
            const user = auth.currentUser;
            if (user) {
                setUserId(user.uid);
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
       
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    const saveDetailsToFirestore = async () => {
        // Get the current timestamp as the date taken
        const dateTaken = Date.now();
        setIsLoading(true); // Start loading animation
        try {
            // Use the user's UID as the document ID
            const userPlantRef = doc(db, 'user_plant_details', userId);
            await setDoc(userPlantRef, chosenDetails);
    
            console.log('User plant data added to Firestore successfully!');
            // You can perform any additional actions after the details are saved here.
        } catch (error) {
            console.error('Error adding user plant document: ', error);
            // Handle any errors that occur during the saving process
        }
        setTimeout(() => {
            setIsLoading(false);
          }, 5000);
    };

    const viewEach = (e, name, cause, description,  treatment, ) => {
        e.preventDefault();
        setChosenDetails({description: description, problem: name, treatment: treatment, images: scanImg});
        setViewItem(true);
        //console.log(treatment);
      }

    return(
        <View style={{flex: 1, }}>  

        {isHealthy ? (
          <View>   

            <Image style={myStyles.healthImage} source={{ uri:scanImg }} />
           
            <View style={myStyles.healthyBody}>
              <Ionicons name="checkmark-done-circle-outline" color="green" size="58"/>
              <Text style={{fontSize: 20, color:"green"}}>plant is healthy</Text>
            </View>
  
          </View>) : (
          <View>
            {!viewItem ? (
  
              <ScrollView  style={myStyles.container}>
              <Image style={myStyles.scannedImage} source={{ uri:scanImg }} />
  
              <Text style={{fontSize: 20, color: "green", textAlign: "center"}}> Possible ploblems: </Text>
  
              {data.map((item, index) => {
                return(
                  <Pressable key={index} onPress={(e) => {viewEach(e, item.name, item.disease_details.cause, item.disease_details.description, item.disease_details.treatment)}} style={myStyles.diseaseList}>
                    <Text>problem: {item.name}</Text>
                    <Text>cause: {item.disease_details.cause}</Text>
                    <Text>description</Text>
                    <Text>{item.disease_details.description}</Text>
                  </Pressable>
                )
              })}
  
              {/* <CustomButton text="Close" styele={{marginBottom: 10, marginRight: "auto", }}/> */}
  
              </ScrollView>   
              ) : (<ScrollView>
  
              <View style={myStyles.itemContainer}>
                <Text style={{fontSize: 20, marginTop: 5, color: "red"}}>Problem: {chosenDetails.problem}</Text>
                <Text>description: {chosenDetails.description}</Text>
                <Text>treatment:</Text>
  
              <Text style={{fontSize: 20, marginTop: 5}}>Biological Solution</Text>
                {
                  chosenDetails.treatment.biological != undefined ? (
                    chosenDetails.treatment.biological.map((plant, index) => {           
                      return(
                        <View key={index}>
                          <Text>{plant}</Text>
                        </View>
                      )
                    })
                  ) : (<View><Text>No data</Text></View>)
                }
                
  
                <Text style={{fontSize: 20, marginTop: 5}}>chemical Solution</Text>
                {
                  chosenDetails.treatment.chemical != undefined ? (
                    chosenDetails.treatment.chemical.map((plant, index) => {           
                      return(
                        <View key={index}>
                          <Text>{plant}</Text>
                        </View>
                      )
                    })
                  ) : (<View><Text>No chemical Solution found</Text></View>)
                }
  
                <Text style={{fontSize: 20, marginTop: 5}}>Prevention Solution</Text>
                {
                  chosenDetails.treatment.prevention != undefined ? (
                    chosenDetails.treatment.prevention.map((plant, index) => {           
                      return(
                        <View key={index}>
                          <Text>{plant}</Text>
                        </View>
                      )
                    })
                  ) : (<View><Text>No prevention found</Text></View>)
                }
              </View>
  
              <View style={myStyles.ButtonContainer}> 
                <CustomButton text="Save" onPress={saveDetailsToFirestore} />
                <CustomButton text="Cancel" onPress={() => {setViewItem(!viewItem)}} />
              </View>
              {/* {isLoading && <LoadingAnimation  />} */}
              </ScrollView>)} 
          </View>
        )}
      </View>
    )
}

const myStyles = StyleSheet.create({
    scannedImage:{
        width: "90%",
        marginRight: "auto",
        marginLeft: "auto",
        borderRadius: 8,
        height: 250,
        marginTop: 15,
      },
      diseaseList:{
        backgroundColor: "#FAFAFA",
        borderRadius: 5,
        marginTop: 10,
        padding: 5,
      },
      container:{
        marginLeft: 10,
        marginRight: 10,
      
      },
  
      //style for a specific selected plant
      itemContainer:{
        backgroundColor: "white",
        marginTop: "3%",
        marginRight: "3%",
        marginLeft: "3%",
        borderRadius: 5,
        padding: "3%",
      },
  
      ButtonContainer:{
        justifyContent: "center",
        alignItems: "center"
      },
  
      //styles for when the image is healthy:
      healthImage:{
        width: 250,
        marginRight: "auto",
        marginLeft: "auto",
        borderRadius: 8,
        height: 250,
        marginTop: 15,
        
      },
      healthyBody:{
        marginTop: 100,
        alignContent:"center",
        alignItems:"center",
      }
})

export default ResultsScreen; 
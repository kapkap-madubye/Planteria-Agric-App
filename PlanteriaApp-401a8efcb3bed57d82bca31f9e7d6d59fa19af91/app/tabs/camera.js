import { View, Text, RefreshControl, Alert, } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import CustomButton from "../customs/CustomButton/CustomButton";
import * as Location from 'expo-location';
import CustomLoader from "../customs/CustomLoading/customLoader";
import { useNavigation } from "expo-router";

import Axios from "axios";
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";

const CameraScreen = ({ route }) => {
    let apiData;
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [pictureUri, setPictureUri] = useState(null);
    const [formatedPic, setFormatedPic] = useState([]);
    const cameraRef = useRef(null); 
    const [latCoord, setLatCoord] = useState();
    const [longCoord, setLongCoord] = useState();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    //let data = "";
    const[scanPlant, setScanPlant] = useState();
  
    useEffect(() => {
      
      //get the coordinates. latitude and longitude:
      (async () => {     
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
         setLongCoord(location.coords.longitude);
         setLatCoord(location.coords.latitude);
      })();

      //get camera permission:
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);
  
    const handleCameraType = () => {
      setCameraType(
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
      );
    };
  
    const handleTakePicture = async (e) => {
      e.preventDefault();
      setLoading(true);
      if (cameraRef.current) {
        const options = { quality: 0.5, base64: true, skipProcessing: true };
        const data = await cameraRef.current.takePictureAsync();
        setPictureUri(data.uri);
        
        if(!scanPlant){
          setScanPlant(data.uri);
        }

        try{
          if(formatedPic.length <= 3){        
            //console.log("image: ",pictureUri);
            formatedPic.push(await FileSystem.readAsStringAsync(data.uri, {encoding: FileSystem.EncodingType.Base64,})); 
            setLoading(false);      
            if(formatedPic.length == 3){
              callAPI();
            }
          }
          
        }
        catch(error){
          setLoading(false);
          console.error(error);
          window.alert("There was a problem with your picture...");
        }
      }
      
    };

    if (hasPermission === false) {
      Alert.alert("No access to camera, give app camera permission...");
      pageReset();
    }

    //run api function after the image is converted to base64:
    const callAPI = () => {
      setLoading(true);
      if(formatedPic.length > 0){
        //const axios = require('axios');
        console.log("access point is triggered");

        //health data:
        const healthData = {
          // api_key: "4SVwYwK2SpxNsVtJOySrcalg54M8M2KgY48l3tKFhFrQ6OiqVX",
          api_key: "FcK1nJcBa5hNm56Z1mMBeMuuPj8uKV7ILYxTdIljwRTqVnSoxq",
          images: formatedPic,
          latitude: latCoord,
          longitude: longCoord,
          modifiers: ["crops_medium"],
          plant_language: "en",
          disease_details: ["cause",
            "common_names",
            "classification",
            "description",
            "treatment",
            "url"],         
        };
  
        Axios.post('https://api.plant.id/v2/health_assessment', healthData).then(res => {         
          apiData = {...res.data};
          //let plantData = apiData.health_assessment.diseases;
          //console.log(apiData.health_assessment.is_healthy);
          let plantData = [];
          let status = apiData.health_assessment.is_healthy;
          //console.log("image: ", pictureUri);
          //console.log(apiData.health_assessment.diseases[0]);
          for(let i = 0; i < 2; i++){
            plantData.push(apiData.health_assessment.diseases[i])
          }
          
          //below it should check if its a plant using condition:         
          if(apiData.is_plant){
            //console.log("image on camera tab: ", data.uri);
            navigation.navigate('resultsScreen', {data:plantData, scanImg: scanPlant, isHealthy: status});
            setLoading(false);
            pageReset();
          }
          else{
            setLoading(false);
            Alert.alert("could not find plant on the image, scan again!...");
            pageReset();
          }
          
        }).catch(error => {
          //console.error('Error: ', error)
          Alert.alert("poor internet connections, try again...");
          console.log(error);
          setLoading(false);
          pageReset();
        })    
        setFormatedPic([]);
  
      }else{
        console.log("code did not execute")
      }
    }

    // function to manually reset the page:
    const pageReset = () => {
      //e.preventDefault();
      //Alert.alert("page reset...");
      setRefreshing(true);
      setPictureUri(null);
      setFormatedPic([]);
      setLatCoord("");
      setLongCoord("");
      setRefreshing(false);
      setScanPlant(undefined);
    }

    return(     
      <View style={styles.container}>
      {pictureUri === null ? (
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCameraType}>
              <Ionicons name="camera-reverse-outline" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
              <Ionicons name="camera-outline" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </Camera> 
        
      ) : (           
            <View style={{flex: 1, justifyContent: "center"}}> 
            
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={pageReset} />}>
              <View style={{marginTop: "50%", marginBottom: "auto", alignItems: "center"}}>    
                <CustomButton text="Scan Again" onPress={() => setPictureUri(null)} /> 
                <CustomButton text="Done" onPress={() => callAPI()} /> 
                <Text styele={{marginTop: 50}}>scan image multiple times for better results</Text> 
              </View>
             
                <CustomLoader visible={loading} />
              </ScrollView>

            </View>                                        
      )}
    </View>
      
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {  
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 90,
  },
  button: {
    marginHorizontal: 20,
  },
  seeMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 30,
    borderRadius: 5,
  },
  seeMoreText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noPlantInfo: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  centerButton: {
    
  },
});

export default CameraScreen;

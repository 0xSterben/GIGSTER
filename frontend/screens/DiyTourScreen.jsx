import React, { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'

export default function DiyTourScreen() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [hosts, setHosts] = useState([])

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentPosition(location.coords);

      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });

      Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
        setCurrentPosition(location.coords);
      });
    })();
  }, []);


  //FORMATTE LA DATE EN STRING
  const formattedDate = moment(date).format('DD/MM/YYYY');

  //VARIABLE MECHANISME DU CALENDRIER
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    hideDatePicker();
  };

  //RECHERCHE LA VILLE VIA L'INPUT
  const getCityLocation = () => {
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${searchCity}&type='city `)
      .then((response) => response.json())
      .then((data) => {
        if (data.features.length === 0) {
          console.log("City not found");
          return;
        }

        const foundCity = data.features[0];
        setMapRegion({
          latitude: foundCity.geometry.coordinates[1],
          longitude: foundCity.geometry.coordinates[0],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      });
  };

  if (!mapRegion) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  //RECHERCHE ET AFFICHE LES HOTES DISPONIBLE 
  function displayAvailableHost() {

    fetch(`http://${FRONT_IP}:3000/authUsers/announces`)
      .then(response => response.json())
      .then(data => {
        const hostsAvailable = data.filter(elem => elem.availableDates.startDateAt < date && elem.availableDates.endDateAt > date)
        setHosts(hostsAvailable)
      })
  }



  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={mapRegion}
      >
        {currentPosition && (
          <Marker coordinate={currentPosition} title="Me!" pinColor="#fecb2d" />
        )}
      </MapView>

      <View style={styles.topContainer}>

        <TextInput
          style={styles.textInput}
          placeholder={"Where ?"}
          placeholderTextColor={"#666"}
          onChangeText={setSearchCity}
          value={searchCity}
          onFocus={() => setIsOpen(true)}
        />

        {Platform.OS === 'ios' ? (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleConfirm}
            style={styles.calendar}
            isVisible={isDatePickerVisible}
          />
        ) : (
          <>
            <TouchableOpacity style={styles.btnSearch} onPress={showDatePicker}>
              <Text>{formattedDate}</Text>
            </TouchableOpacity>
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleConfirm}
              style={styles.calendar}
              isVisible={isDatePickerVisible}
            />
          </>

        )}

        <TouchableOpacity
          style={styles.btnSearch}
          onPress={() => { getCityLocation(); setIsOpen(false); }}
        >
          <Text style={styles.textSearch}>Go</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Mon Parcours</Text>
        <ScrollView style={styles.roadmap} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.date}>
            <Text>HELLO</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    position: "absolute",
    top: 40,
    width: "80%",
    marginLeft: "15%",

    height: 50,
    borderColor: "black",
    borderWidth: 1,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderRadius: 13,
    padding: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  subTopContainer: {
    position: "absolute",
    top: 100,
    width: "50%",
    marginLeft: "25%",
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderRadius: 13,
    padding: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  textInput: {
    color: "#000",
    height: 45,
    width: "34%",
    paddingLeft: 10,
    fontSize: 16,
  },
  btnSearch: {
    backgroundColor: "#5100FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 13,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 100,
    width: "89%",
    height: "25%",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
    alignItems: "center",
    marginLeft: "5.5%",
    borderRadius: 13,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  title: {
    width: "50%",
    textAlign: "center",
    fontSize: 25,
    marginBottom: 10,
  },
  roadmap: {
    backgroundColor: "white",
    width: "90%",
  },
  textSearch: {
    color: "white",
    fontWeight: "bold",
  },
  date: {
    width: "90%",
    height: 40,
    borderColor: "#5100FF",
    borderWidth: 1,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderRadius: 10,
    justifyContent: "center",
    padding: 5,
  },
  calendar: {
    backgroundColor: 'white',
    color: 'white'

  }
});




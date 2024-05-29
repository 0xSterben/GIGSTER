import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, Platform, Button } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

import AnnounceCard from '../components/AnnounceCard'
import AnnounceCardSearch from '../components/AnnounceCardSearch';
import TopCard from '../components/TopCard'

import ProfileScreen from "./ProfileScreen";
import { useNavigation } from '@react-navigation/native';




export default function HomeScreen() {

    const [modalVisible, setModalVisible] = useState(false);
    const [searching, setSearching] = useState(false)
    const navigation = useNavigation()

    const cardsData = [
        {
            image: require("../assets/Felicita.png"),
            title: 'La Felicita',
            location: 'Paris 13',
            availability: '06 Juin - 17 Juin',
            note: '4.5'
        },
        {
            image: require("../assets/Jardin.png"),
            title: `Jardin d'Arcachon`,
            location: 'Archachon',
            availability: '27 Mai - 02 Juin',
            note: '4.5'
        },
        {
            image: require("../assets/Lyon.png"),
            title: 'Batiment au nom bien long',
            location: 'Lyon',
            availability: '25 Mai - 13 Juillet',
            note: '4.3'
        },
        {
            image: require("../assets/Daddoo.png"),
            title: 'Dortoir du Seigneur',
            location: 'Bordeaux',
            availability: '25 Mai - 31 Mai',
            note: '2.4'
        },
        {
            image: require("../assets/Matelas.png"),
            title: 'Déchetterie (chez moi)',
            location: 'Tokyo',
            availability: '24 Juillet - 23 Janvier',
            note: '1.2'
        },
    ]

    const cardList = cardsData.map((data, i) => {
        return <AnnounceCard
            key={i}
            image={data.image}
            title={data.title}
            location={data.location}
            availability={data.availability}
            note={data.note} />
    })

    const cardListSearch = cardsData.map((data, i) => {
        return <AnnounceCardSearch
            key={i}
            image={data.image}
            title={data.title}
            location={data.location}
            availability={data.availability}
            note={data.note} />
    })

    const topData = [
        {
            image: require("../assets/PP1.png"),
            name: 'Galaxy Brain'
        },
        {
            image: require("../assets/PP2.png"),
            name: 'Antistar'
        },
        {
            image: require("../assets/PP3.png"),
            name: 'Domo Arigato'
        },
        {
            image: require("../assets/PP4.png"),
            name: 'Meuf Manga'
        },
        {
            image: require("../assets/PP5.png"),
            name: 'SupraDarky'
        },
    ]

    const topList = topData.map((data, i) => {
        return <TopCard
            key={i}
            image={data.image}
            name={data.name} />

    })

    function navigateModal() {
        navigation.navigate("TabNavigator", { screen: "Profile" });
        setModalVisible(!modalVisible)
    }

    function logout() {
        navigation.navigate("LoginScreen");
    }

    return (
        <View style={styles.container}>
            <Modal style={styles.modal}
                isVisible={modalVisible}
                swipeDirection="left"
                animationInTiming={500}
                animationIn="slideInLeft"
                animationOut="slideOutLeft"
                hideModalContentWhileAnimating={true}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                onBackdropPress={() => setModalVisible(false)}
                onSwipeComplete={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View>
                        <View style={styles.modalView}>
                            <Image style={styles.profilePic} source={require('../assets/Shulk.png')} />
                            <FontAwesome name='times' onPress={() => setModalVisible(!modalVisible)} size={40} />
                        </View>
                        <View style={styles.modalNav}>
                            <View style={styles.modalSection}>
                                <FontAwesome name='user' size={35} />
                                <View style={styles.modalAlign}>
                                    <Text style={styles.modalText} onPress={() => navigateModal()} >Profile</Text>
                                </View>
                            </View>
                            <View style={styles.modalSection}>
                                <FontAwesome name={true ? 'globe' : 'music'} size={35} />
                                <View style={styles.modalAlign}>
                                    <Text style={styles.modalText}>{true ? 'My tours' : 'My bookings'}</Text>
                                </View>
                            </View>
                            <View style={styles.modalSection}>
                                <FontAwesome name='heart' size={28} />
                                <View style={styles.modalAlign}>
                                    <Text style={styles.modalText}>{true ? 'Liked hosts' : 'Liked artists'}</Text>
                                </View>
                            </View>
                            <View style={styles.modalSection}>
                                <FontAwesome name='star' size={30} />
                                <View style={styles.modalAlign}>
                                    <Text style={styles.modalText}>Preferences</Text>
                                </View>
                            </View>
                            <View style={styles.lastModalSection}>
                                <FontAwesome name='close' size={30} />
                                <View style={styles.modalAlign}>
                                    <Text style={styles.modalText} onPress={() => logout()}>Log out</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.settings}>
                        <FontAwesome name='gear' size={50} />
                        <View style={styles.modalAlign}>
                            <Text style={styles.settingText}>Settings</Text>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnModal} onPress={() => setModalVisible(!modalVisible)}>
                    <Image style={styles.profilePicMenu} source={require('../assets/Shulk.png')} />
                </TouchableOpacity>
                <View style={styles.searchField}>
                    <TextInput
                        placeholder="Find your future hosts"
                        style={styles.input}
                    ></TextInput>
                    <TouchableOpacity style={styles.btnSearch} onPress={() => setSearching(true)}>
                        <Text style={styles.textSearch}>
                            Search
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {!searching ?
                <>
                    <Text style={styles.welcome}>Welcome JustneedVic</Text>
                    <Text style={styles.discover}>Discover...</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.recoZone} >
                        {cardList}
                    </ScrollView>
                    <Text style={styles.titleRanking}>Top Artist</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.topZone}>
                        {topList}
                    </ScrollView>
                </> :

                <ScrollView style={styles.recoZoneSearching} >
                    <View style={styles.searchTitle}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Results for Bordeaux : </Text>
                        <FontAwesome name='close' size={30} onPress={() => setSearching(false)} />
                    </View>
                    {cardListSearch}
                </ScrollView>

            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0E7F6'
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '20%',
        paddingTop: 20,
    },
    searchField: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%',
        height: '40%',
        borderRadius: 15,
        borderWidth: 2,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white'
    },
    input: {
        width: '70%'
    },
    btnSearch: {
        backgroundColor: '#5100FF',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderBottomWidth: 3,
        borderRightWidth: 3
    },
    textSearch: {
        color: 'white',
        fontWeight: 'bold',
    },
    welcome: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 25,
        marginBottom: 10,
        height: '4%'
    },
    discover: {
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 20,
        height: '3%'
    },
    titleRanking: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 25,
        height: '5%'
    },
    recoZone: {
        width: '100%',
        height: '40%',
        flexDirection: 'row'
    },
    recoZoneSearching: {
        width: '100%',
        height: '80%',
        marginLeft: '2%'
    },
    topZone: {
        width: '100%',
        height: '28%',
        flexDirection: 'row'
    },
    btnModal: {
        width: '20%',
        marginRight: 10
    },
    modal: {
        margin: 0
    },
    centeredView: {
        backgroundColor: '#E6E6E6',
        width: '80%',
        height: '100%',
        justifyContent: 'space-between'
    },
    modalView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
    },
    profilePic: {
        width: 70,
        height: 70,
        borderRadius: 40
    },
    profilePicMenu: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'black',
    },
    modalNav: {
        alignItems: 'center',
        marginTop: 20
    },
    modalSection: {
        flexDirection: 'row',
        width: '90%',
        height: 60,
        borderTopWidth: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15
    },
    lastModalSection: {
        flexDirection: 'row',
        width: '90%',
        height: 60,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20
    },
    modalAlign: {
        width: 250
    },
    settings: {
        flexDirection: 'row',
        width: '90%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        marginBottom: 10,
        marginLeft: 10
    },
    settingText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 20
    },
    searchTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '5%',
        paddingRight: '12%',
    }
});
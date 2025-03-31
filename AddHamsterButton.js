import React, { useState, useEffect } from "react";
import { Button, Modal, Text, TextInput, View, StyleSheet, Alert } from "react-native";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";

const AddHamsterButton = () => {
    const [open, setOpen] = useState(false); // State for modal open/close
    const [currentHamster, setCurrentHamster] = useState({}); // State to store hamster details
    const [user_id, setUserId] = useState(""); // State for selected user ID
    const [devices, setDevices] = useState([]); // State to store devices
    const [users, setUsers] = useState([]); // State to store users
    const [hamsters, setHamsters] = useState([]); // State to store hamster list

    useEffect(() => {
        fetchDevicesAndUsers();
        fetchHamsters();
    }, []);

    const fetchDevicesAndUsers = async () => {
        try {
            const deviceResponse = await axios.get("http://3.80.117.46:3000/devices");
            setDevices(deviceResponse.data);

            const userResponse = await axios.get("http://3.80.117.46:3000/users");
            setUsers(userResponse.data);
        } catch (error) {
            console.error("Error fetching devices or users:", error);
            Alert.alert("Error", "Error fetching devices or users. Please try again.");
        }
    };

    const fetchHamsters = async () => {
        try {
            const response = await axios.get("http://3.80.117.46:3000/hamsters");
            setHamsters(response.data);
        } catch (error) {
            console.error("Error fetching hamsters:", error);
            Alert.alert("Error", "Error fetching hamsters. Please try again.");
        }
    };

    const handleSave = async () => {
        if (!currentHamster.name || !user_id || !currentHamster.device_id) {
            Alert.alert("Error", "Name, User ID, and Device ID are required.");
            return;
        }

        const hamsterData = {
            name: currentHamster.name,
            breed: currentHamster.breed || '',
            age: currentHamster.age || null,
            weight: currentHamster.weight || null,
            health_notes: currentHamster.health_notes || '',
            device_id: currentHamster.device_id,
            user_id: user_id,
        };

        try {
            await axios.post("http://3.80.117.46:3000/hamsters", hamsterData);
            setOpen(false);
            fetchHamsters(); // Fetch updated hamster list
        } catch (error) {
            console.error("Error saving hamster:", error);
            Alert.alert("Error", "Error saving hamster. Please check the data and try again.");
        }
    };

    return (
        <>
            <Button title="Add Hamster" onPress={() => setOpen(true)} />

            <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>New Hamster</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={currentHamster.name || ''}
                        onChangeText={(text) => setCurrentHamster({ ...currentHamster, name: text })}
                    />
                    {/* Other input fields go here */}
                    <RNPickerSelect
                        onValueChange={(value) => setCurrentHamster({ ...currentHamster, device_id: value })}
                        items={devices.map(device => ({
                            label: device.device_name || "Unnamed Device",
                            value: device.id
                        }))}
                        value={currentHamster.device_id || ""}
                        placeholder={{ label: "Select a device", value: "" }}
                    />

                    <RNPickerSelect
                        onValueChange={(value) => setUserId(value)}
                        items={users.map(user => ({
                            label: user.name || "Unnamed User",
                            value: user.id
                        }))}
                        value={user_id || ""}
                        placeholder={{ label: "Select a user", value: "" }}
                    />

                    <View style={styles.buttons}>
                        <Button title="CANCEL" onPress={() => setOpen(false)} />
                        <Button title="SAVE" onPress={handleSave} />
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "white",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 20,
    },
});

export default AddHamsterButton;

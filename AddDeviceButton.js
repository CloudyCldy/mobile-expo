import React, { useState, useEffect } from "react";
import { Button, Modal, Text, TextInput, View, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker"; // Import the Picker component for dropdown

const AddDeviceButton = ({ fetchDevices }) => {
    const [open, setOpen] = useState(false); // State for modal open/close
    const [currentDevice, setCurrentDevice] = useState({}); // State to store device details
    const [users, setUsers] = useState([]); // State to store users

    // Fetch users when the component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userResponse = await axios.get("http://3.80.117.46:3000/users"); // Fetch users
            setUsers(userResponse.data); // Set the users in state
        } catch (error) {
            console.error("Error fetching users:", error); // Handle errors
            Alert.alert("Error", "Error fetching users. Please try again.");
        }
    };

    const handleSave = async () => {
        // Check if all required fields are filled
        if (!currentDevice.device_name || !currentDevice.location) {
            Alert.alert("Error", "Device Name and Location are required.");
            return;
        }

        // Prepare the device data
        const deviceData = {
            device_name: currentDevice.device_name,
            location: currentDevice.location || '',
            user_id: currentDevice.user_id,
        };

        try {
            await axios.post("http://3.80.117.46:3000/devices", deviceData); // Send device data to the backend
            setOpen(false); // Close the modal
            fetchDevices(); // Re-fetch the devices to update the list
        } catch (error) {
            console.error("Error saving device:", error); // Handle errors
            Alert.alert("Error", "Error saving device. Please check the data and try again.");
        }
    };

    return (
        <>
            <Button title="Add Device" onPress={() => setOpen(true)} />

            {/* Modal for adding a new device */}
            <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>New Device</Text>
                    
                    {/* Device Name */}
                    <TextInput
                        style={styles.input}
                        placeholder="Device Name"
                        value={currentDevice.device_name || ''}
                        onChangeText={(text) => setCurrentDevice({ ...currentDevice, device_name: text })}
                    />
                    
                    {/* Location */}
                    <TextInput
                        style={styles.input}
                        placeholder="Location"
                        value={currentDevice.location || ''}
                        onChangeText={(text) => setCurrentDevice({ ...currentDevice, location: text })}
                    />
                    
                    {/* Dropdown to select a user */}
                    <Picker
                        selectedValue={currentDevice.user_id || ''}
                        onValueChange={(itemValue) => setCurrentDevice({ ...currentDevice, user_id: itemValue })}
                    >
                        <Picker.Item label="Select a user" value="" />
                        {users.length > 0 ? (
                            users.map((user) => (
                                <Picker.Item key={user.id} label={user.name || "Unnamed User"} value={user.id} />
                            ))
                        ) : (
                            <Picker.Item label="No users available" value="" enabled={false} />
                        )}
                    </Picker>

                    {/* Modal buttons */}
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

export default AddDeviceButton;

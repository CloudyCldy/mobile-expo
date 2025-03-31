import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Modal, Alert, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";

const Device = () => {
    const [devices, setDevices] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [formData, setFormData] = useState({
        device_name: "",
        location: "",
        user_id: "",
    });

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await axios.get("http://3.80.117.46:3000/devices");
            setDevices(response.data);
        } catch (error) {
            console.error("Error fetching devices:", error);
            Alert.alert("Error", "Failed to retrieve devices. Please try again later.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://3.80.117.46:3000/devices/${id}`);
            fetchDevices();
        } catch (error) {
            console.error("Error deleting device:", error);
            Alert.alert("Error", "Failed to delete the device. Please try again later.");
        }
    };

    const handleEdit = (device) => {
        setSelectedDevice(device);
        setFormData({
            device_name: device.device_name,
            location: device.location,
            user_id: device.user_id,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDevice(null);
    };

    const handleChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://3.80.117.46:3000/devices/${selectedDevice.id}`, formData);
            fetchDevices();
            setOpen(false);
        } catch (error) {
            console.error("Error updating device:", error);
            Alert.alert("Error", "Failed to update the device. Please try again later.");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Button title="Add Device" onPress={() => fetchDevices()} />

            <FlatList
                data={devices}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
                        <Text>ID: {item.id}</Text>
                        <Text>User ID: {item.user_id}</Text>
                        <Text>Device Name: {item.device_name}</Text>
                        <Text>Location: {item.location}</Text>
                        <Text>Created At: {item.created_at}</Text>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <TouchableOpacity onPress={() => handleEdit(item)} style={{ marginRight: 10 }}>
                                <Text style={{ color: 'blue' }}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Text style={{ color: 'red' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <Modal visible={open} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                        <Text>Edit Device</Text>
                        <TextInput
                            style={{ borderBottomWidth: 1, marginBottom: 10 }}
                            placeholder="Device Name"
                            value={formData.device_name}
                            onChangeText={(value) => handleChange("device_name", value)}
                        />
                        <TextInput
                            style={{ borderBottomWidth: 1, marginBottom: 10 }}
                            placeholder="Location"
                            value={formData.location}
                            onChangeText={(value) => handleChange("location", value)}
                        />
                        <TextInput
                            style={{ borderBottomWidth: 1, marginBottom: 10 }}
                            placeholder="User ID"
                            value={formData.user_id}
                            onChangeText={(value) => handleChange("user_id", value)}
                        />
                        <Button title="Cancel" onPress={handleClose} />
                        <Button title="Save" onPress={handleSubmit} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Device;

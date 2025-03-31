import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, Alert, FlatList,Dimensions, TouchableOpacity, Button, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";

const SensorDataForm = () => {
    const [sensorData, setSensorData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        device_id: "",
        temperature: "",
        humidity: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    useEffect(() => {
        fetchSensorData();
    }, []);

    const fetchSensorData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://3.80.117.46:3000/sensores");
            setSensorData(response.data);
        } catch (error) {
            console.error("Error fetching sensor data:", error);
            Alert.alert("Error", "Failed to retrieve sensor data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://3.80.117.46:3000/sensores/${id}`);
            fetchSensorData();
        } catch (error) {
            console.error("Error deleting sensor:", error);
            Alert.alert("Error", "Failed to delete the sensor. Please try again later.");
        }
    };

    const handleEdit = (sensor) => {
        setSelectedSensor(sensor);
        setFormData({
            device_id: sensor.device_id,
            temperature: sensor.temperature.toString(),
            humidity: sensor.humidity.toString(),
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedSensor(null);
    };

    const handleChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://3.80.117.46:3000/sensores/${selectedSensor.id}`, formData);
            fetchSensorData();
            setOpen(false);
        } catch (error) {
            console.error("Error updating sensor:", error);
            Alert.alert("Error", "Failed to update the sensor. Please try again later.");
        }
    };

    const totalPages = Math.ceil(sensorData.length / itemsPerPage);
    const currentPageData = sensorData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sensor Data</Text>
            <Button title="Refresh Data" onPress={fetchSensorData} />
            {isLoading && <ActivityIndicator size="small" color="#FFA500" style={styles.loading} />}

            <FlatList
                data={currentPageData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text>ID: {item.id}</Text>
                        <Text>Device ID: {item.device_id}</Text>
                        <Text>Temperature: {item.temperature}°C</Text>
                        <Text>Humidity: {item.humidity}%</Text>
                        <Text>Recorded At: {new Date(item.recorded_at).toLocaleString()}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <View style={styles.pagination}>
                <Button
                    title="Prev"
                    onPress={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                <Text style={styles.pageText}>{currentPage} / {totalPages}</Text>
                <Button
                    title="Next"
                    onPress={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </View>

            <Modal visible={open} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Edit Sensor Data</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Device ID"
                            value={formData.device_id}
                            onChangeText={(value) => handleChange("device_id", value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Temperature"
                            value={formData.temperature}
                            onChangeText={(value) => handleChange("temperature", value)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Humidity"
                            value={formData.humidity}
                            onChangeText={(value) => handleChange("humidity", value)}
                            keyboardType="numeric"
                        />
                        <Button title="Update" onPress={handleSubmit} />
                        <Button title="Cancel" onPress={handleClose} color="red" />
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#F5DEB3",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    loading: {
        marginVertical: 10,
    },
    itemContainer: {
        padding: 8,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        marginBottom: 8,
    },
    actions: {
        flexDirection: "row",
        marginTop: 5,
    },
    editButton: {
        backgroundColor: "#4CAF50",
        padding: 4,
        marginRight: 8,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: "#F44336",
        padding: 4,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 250,
        padding: 15,
        backgroundColor: "white",
        borderRadius: 10,
        width: screenWidth * 0.85,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 8,
        padding: 5,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    pageText: {
        marginHorizontal: 8,
        fontSize: 14,
    },
});

export default SensorDataForm;

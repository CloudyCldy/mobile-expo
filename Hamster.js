import React, { useState, useEffect } from "react";
import { View, Text, Modal, FlatList, TouchableOpacity, Button, TextInput, Dimensions, ActivityIndicator, Alert, StyleSheet } from "react-native";
import axios from "axios";
import AddHamsterButton from "./AddHamsterButton";
import Icon from 'react-native-vector-icons/FontAwesome';  // Importa el ícono

const Hamster = () => {
    const [hamsters, setHamsters] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedHamster, setSelectedHamster] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        breed: "",
        age: "",
        weight: "",
        health_notes: "",
        device_id: "",
        user_id: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchHamsters();
    }, []);

    const fetchHamsters = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://3.80.117.46:3000/hamsters");
            setHamsters(response.data);
        } catch (error) {
            console.error("Error fetching hamsters:", error);
            Alert.alert("Error", "Failed to retrieve hamsters. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://3.80.117.46:3000/hamsters/${id}`);
            fetchHamsters();
        } catch (error) {
            console.error("Error deleting hamster:", error);
            Alert.alert("Error", "Failed to delete the hamster. Please check your connection and try again.");
        }
    };

    const handleEdit = (hamster) => {
        setSelectedHamster(hamster);
        setFormData({
            name: hamster.name,
            breed: hamster.breed,
            age: hamster.age,
            weight: hamster.weight,
            health_notes: hamster.health_notes,
            device_id: hamster.device_id,
            user_id: hamster.user_id,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedHamster(null);
    };

    const handleChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://3.80.117.46:3000/hamsters/${selectedHamster.id}`, formData);
            fetchHamsters();
            setOpen(false);
        } catch (error) {
            console.error("Error updating hamster:", error);
            Alert.alert("Error", "Failed to update the hamster. Please check your connection and try again.");
        }
    };

    const totalPages = Math.ceil(hamsters.length / itemsPerPage);
    const currentHamsters = hamsters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hamster Data</Text>
            
            <View style={styles.buttonRow}>
                <View style={styles.refreshButton}>
                    <TouchableOpacity onPress={fetchHamsters} style={styles.refreshIconButton}>
                        <Icon name="refresh" size={25} color="#FFA500" />
                    </TouchableOpacity>
                </View>
                <AddHamsterButton onAdd={fetchHamsters} />
                </View>

            {isLoading && <ActivityIndicator size="large" color="#FFA500" style={styles.loading} />}

            <FlatList
                data={currentHamsters}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>ID: {item.id}</Text>
                        <Text style={styles.itemText}>Name: {item.name}</Text>
                        <Text style={styles.itemText}>Age: {item.age} years</Text>
                        <Text style={styles.itemText}>Breed: {item.breed}</Text>
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
                contentContainerStyle={styles.flatListContent}
            />

            <View style={styles.pagination}>
                <TouchableOpacity 
                    style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
                    onPress={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <Text style={styles.paginationButtonText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.pageText}>{currentPage} / {totalPages}</Text>
                <TouchableOpacity 
                    style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
                    onPress={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <Text style={styles.paginationButtonText}>Next</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={open} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Hamster Data</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={formData.name}
                            onChangeText={(value) => handleChange("name", value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Age"
                            value={formData.age}
                            onChangeText={(value) => handleChange("age", value)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Breed"
                            value={formData.breed}
                            onChangeText={(value) => handleChange("breed", value)}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
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
        padding: 20,
        backgroundColor: "#F5DEB3",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
        color: "#8B4513",
    },
    loading: {
        marginVertical: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    refreshButton: {
        flex: 1,
        marginRight: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    refreshIconButton: {
        backgroundColor: "#FFF8DC",
        padding: 10,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContent: {
        paddingBottom: 20,
    },
    itemContainer: {
        padding: 15,
        backgroundColor: "#FFF8DC",
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
        color: "#555",
    },
    actions: {
        flexDirection: "row",
        marginTop: 10,
        justifyContent: 'flex-end',
    },
    editButton: {
        backgroundColor: "#4CAF50",
        padding: 8,
        marginRight: 10,
        borderRadius: 5,
        minWidth: 70,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: "#F44336",
        padding: 8,
        borderRadius: 5,
        minWidth: 70,
        alignItems: 'center',
    },
    buttonText: {
        color: "#fff",
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: screenWidth * 0.85,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#8B4513',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#8B4513',
        marginBottom: 15,
        padding: 10,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    updateButton: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: "#F44336",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10,
    },
    paginationButton: {
        backgroundColor: "#FFA500",
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    paginationButtonText: {
        color: "#fff",
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: "#cccccc",
    },
    pageText: {
        marginHorizontal: 15,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8B4513',
    },
});

export default Hamster;

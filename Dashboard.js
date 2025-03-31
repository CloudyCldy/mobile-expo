import React, { useEffect, useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, Platform
} from 'react-native';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';  // ✅ Expo file system
import * as Sharing from 'expo-sharing';          // ✅ Compartir archivos
import axios from 'axios';
import UserChart from './UserChart';
import Hamster from './Hamster';
import Device from './Device';
import SensorDataForm from './SensorDataForm';
import { useRoute } from '@react-navigation/native';

const Dashboard = () => {
    const route = useRoute();
    const { role } = route.params || {};

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    useEffect(() => {
        if (role === 'admin') {
            fetch('http://3.80.117.46:3000/users')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch users');
                    }
                    return response.json();
                })
                .then((data) => {
                    setUsers(data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [role]);

    // ✅ Descargar Excel (compatible con Expo)
    const downloadExcel = async () => {
        if (users.length === 0) {
            Alert.alert('Sin datos', 'No hay datos disponibles para descargar.');
            return;
        }

        try {
            const worksheet = XLSX.utils.json_to_sheet(users);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

            // Exportar el archivo como base64
            const excelFile = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

            const fileUri = `${FileSystem.documentDirectory}users.xlsx`;

            // Guardar el archivo
            await FileSystem.writeAsStringAsync(fileUri, excelFile, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Compartir el archivo
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Descarga exitosa', `Archivo guardado en: ${fileUri}`);
            }
        } catch (error) {
            console.error('Error al descargar Excel:', error);
            Alert.alert('Error', 'No se pudo descargar el archivo Excel.');
        }
    };

    const handleSearchChange = (text) => {
        setSearchTerm(text);
    };

    const deleteUser = (id) => {
        fetch(`http://3.80.117.46:3000/users/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }
                setUsers(users.filter((user) => user.id !== id));
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <FlatList
            data={currentUsers}
            renderItem={({ item }) => (
                <View style={styles.tableRow}>
                    <Text style={styles.tableText}>{item.id}</Text>
                    <Text style={styles.tableText}>{item.name}</Text>
                    <Text style={styles.tableText}>{item.email}</Text>
                    <Text style={styles.tableText}>{item.rol}</Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#dc3545' }]}
                        onPress={() => deleteUser(item.id)}
                    >
                        <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={() => (
                <View style={styles.container}>
                    <Text style={styles.header}>
                        {role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
                    </Text>

                    {role === 'admin' ? (
                        <View style={styles.adminSection}>
                            <View style={styles.topControls}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Buscar usuarios"
                                    value={searchTerm}
                                    onChangeText={handleSearchChange}
                                />
                                <TouchableOpacity style={styles.button} onPress={downloadExcel}>
                                    <Text style={styles.buttonText}>Descargar Excel</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.tableContainer}>
                                <Text style={styles.tableHeader}>Lista de Usuarios</Text>
                            </View>
                            <UserChart users={users} />
                        </View>
                    ) : (
                        <View style={styles.userSection}>
                            <Hamster />
                            <Device />
                            <SensorDataForm />
                        </View>
                    )}
                </View>
            )}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        color: '#007bff',
        marginBottom: 20,
    },
    adminSection: {
        backgroundColor: '#b07c3c87',
        borderRadius: 8,
        padding: 20,
        width: '100%',
    },
    topControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    searchInput: {
        padding: 12,
        fontSize: 16,
        width: '70%',
        backgroundColor: '#fff',
        borderRadius: 25,
        borderColor: '#ced4da',
        borderWidth: 1,
    },
    button: {
        backgroundColor: '#d4bf73',
        padding: 12,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
    },
    tableContainer: {
        marginTop: 20,
        width: '100%',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    tableHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ced4da',
    },
    tableText: {
        flex: 1,
        fontSize: 16,
    },
    userSection: {
        alignItems: 'center',
    },
});

export default Dashboard;

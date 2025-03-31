import React, { useState } from "react";
import axios from "axios";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
    const [user, setUser] = useState({ name: "", email: "", password: "", rol: "normal" });
    const [message, setMessage] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const navigation = useNavigation();

    const handleChange = (name, value) => setUser({ ...user, [name]: value });

    const handleRegister = async () => {
        if (disabled) return;

        try {
            console.log("Enviando registro con:", user);
            const response = await axios.post("http://3.80.117.46:3000/register", user);
            console.log("Respuesta de API:", response.data);

            setMessage("¡Registro exitoso!");
            setTimeout(() => navigation.navigate("Login"), 2000);
        } catch (error) {
            console.error("Error en registro:", error.response ? error.response.data : error.message);
            setMessage(error.response?.data?.message || "Error en el registro.");
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.registerWrap}>
            <Animatable.View animation="fadeIn" style={styles.registerHtml}>
                <Text style={styles.h2}>Registro</Text>
                {message && <Text style={styles.errorMessage}>{message}</Text>}
                <View style={styles.registerForm}>
                    <Animatable.View animation="bounceInUp" duration={600}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            onChangeText={(text) => handleChange("name", text)}
                            value={user.name}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Correo"
                            onChangeText={(text) => handleChange("email", text)}
                            value={user.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            onChangeText={(text) => handleChange("password", text)}
                            value={user.password}
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Rol"
                            onChangeText={(text) => handleChange("rol", text)}
                            value={user.rol}
                        />
                        <TouchableOpacity
                            style={[styles.button, { opacity: disabled ? 0.5 : 1 }]}
                            onPress={handleRegister}
                            disabled={disabled}
                        >
                            <Text style={styles.buttonText}>Registrar</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backButtonText}>← REGRESAR</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    registerWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#c8c8c8",
    },
    registerHtml: {
        width: "80%",
        backgroundColor: "rgba(25, 25, 25, 0.562)",
        padding: 40,
        borderRadius: 10,
        alignItems: "center",
    },
    h2: {
        color: "#fbfafa",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    errorMessage: {
        color: "red",
        marginBottom: 15,
    },
    registerForm: {
        width: "100%",
    },
    input: {
        height: 50,
        marginBottom: 15,
        paddingLeft: 15,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        color: "#fff",
        borderRadius: 25,
    },
    button: {
        backgroundColor: "#81754d",
        paddingVertical: 15,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    backButton: {
        marginTop: 20,
        backgroundColor: "#565a44",
        paddingVertical: 10,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    backButtonText: {
        color: "#fff",
    },
});

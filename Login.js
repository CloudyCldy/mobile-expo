import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
    const [user, setUser] = useState({ email: "", password: "" });
    const [message, setMessage] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const checkLockTime = async () => {
            const lockTime = await AsyncStorage.getItem("lockTime");
            if (lockTime) {
                const remainingTime = 300000 - (Date.now() - Number(lockTime));
                if (remainingTime > 0) {
                    setDisabled(true);
                    setTimeout(() => {
                        AsyncStorage.removeItem("loginAttempts");
                        AsyncStorage.removeItem("lockTime");
                        setAttempts(0);
                        setDisabled(false);
                    }, remainingTime);
                } else {
                    AsyncStorage.removeItem("loginAttempts");
                    AsyncStorage.removeItem("lockTime");
                    setAttempts(0);
                }
            }
        };
        checkLockTime();
    }, []);

    const handleLogin = async () => {
        if (disabled) return;

        if (attempts >= 3) {
            setMessage("Demasiados intentos fallidos. Intenta de nuevo en 5 minutos.");
            setDisabled(true);
            await AsyncStorage.setItem("lockTime", Date.now().toString());
            setTimeout(async () => {
                await AsyncStorage.removeItem("loginAttempts");
                await AsyncStorage.removeItem("lockTime");
                setAttempts(0);
                setDisabled(false);
            }, 300000);
            return;
        }

        try {
            console.log("Enviando login con:", user);

            const res = await axios.post("http://3.80.117.46:3000/login", user);
            console.log("Respuesta de API:", res.data);

            if (!res.data.token) {
                setMessage("Error: No se recibió un token válido.");
                return;
            }

            const token = res.data.token;
            await AsyncStorage.setItem("token", token);

            // Decodificar el token JWT correctamente en React Native
            const payload = token.split(".")[1];
            const decodedPayload = JSON.parse(atob(payload));
            console.log("Token decodificado:", decodedPayload);

            const role = decodedPayload.rol;

            setMessage("Inicio de sesión exitoso. Redirigiendo...");
            
            // ✅ Navegación correcta con parámetros
            navigation.navigate('Dashboard', { role }); 
        } catch (error) {
            console.error("Error en login:", error.response ? error.response.data : error.message);

            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            await AsyncStorage.setItem("loginAttempts", newAttempts.toString());

            setMessage(error.response?.data?.message || "Login fallido. Verifica tus credenciales.");
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.loginWrap}>
            <Animatable.View animation="fadeIn" style={styles.loginHtml}>
                <Text style={styles.h2}>Login</Text>
                {message && <Text style={styles.errorMessage}>{message}</Text>}
                <View style={styles.loginForm}>
                    <Animatable.View animation="bounceInUp" duration={600}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={(text) => setUser({ ...user, email: text })}
                            value={user.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            onChangeText={(text) => setUser({ ...user, password: text })}
                            value={user.password}
                            secureTextEntry
                        />
                        <TouchableOpacity
                            style={[styles.button, { opacity: disabled ? 0.5 : 1 }]}
                            onPress={handleLogin}
                            disabled={disabled}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backButtonText}>← BACK</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    loginWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#c8c8c8",
    },
    loginHtml: {
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
    loginForm: {
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

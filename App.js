import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Blog from './Blog';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard'; 


const Stack = createStackNavigator();
const screenHeight = Dimensions.get('window').height;

function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Encabezado con fondo degradado */}
            <View style={styles.headerGradient}>
                <Text style={styles.title}>🐹 Welcome to Hamtech 🐹</Text>
                
                {/* Contenedor de botones con nuevo diseño */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[styles.button, styles.loginButton]}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.button, styles.registerButton]}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Área del blog */}
            <View style={styles.blogContainer}>
                <ScrollView contentContainerStyle={styles.blogContent}>
                    <Blog />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Dashboard" component={Dashboard} /> 

            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFDF9',
    },
    headerGradient: {
        height: screenHeight * 0.22,
        paddingHorizontal: 25,
        paddingTop: 15,
        backgroundColor: '#FFEFD5',  // Color melocotón claro
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5E3A1D',  // Marrón oscuro
        textAlign: 'center',
        marginBottom: 20,
        textShadowColor: 'rgba(0,0,0,0.05)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    loginButton: {
        backgroundColor: '#E67A54',  // Coral anaranjado
    },
    registerButton: {
        backgroundColor: '#D4A59A',  // Rosa terracota
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    blogContainer: {
        flex: 1,
        backgroundColor: '#FFFDF9',
    },
    blogContent: {
        padding: 20,
        paddingBottom: 30,
    },
});
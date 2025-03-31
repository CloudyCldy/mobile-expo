import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, Image, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import logo from './assets/hobito.png';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

const hamsterFacts = [
    "Syrian hamsters are solitary and must live alone. They can become aggressive if housed together.",
    "Hamsters have expandable cheek pouches that can stretch to their shoulders, allowing them to carry food equal to half their body size.",
    "A hamster's teeth grow continuously throughout their life, about 4-5 inches per year! They need chew toys to keep them trimmed.",
    "Hamsters are crepuscular, meaning they're most active at dawn and dusk, not strictly nocturnal as commonly believed.",
    "The word 'hamster' comes from the German word 'hamstern' meaning 'to hoard', reflecting their food-storing behavior.",
    "Hamsters have poor eyesight (they're nearsighted and colorblind) but excellent senses of smell and hearing.",
    "A hamster can run up to 5-6 miles per night on their wheel - that's like a human running a marathon each night!",
    "Baby hamsters are called 'pups' and are born hairless, blind, and deaf, weighing only 2-3 grams.",
    "Hamsters originated in the deserts of Syria where they burrow to escape the extreme heat.",
    "The average lifespan of a hamster is 2-3 years, though some can live up to 4 years with excellent care."
];

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [factsPerPage] = useState(4);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const token = await AsyncStorage.getItem('token');  // Get token from AsyncStorage
                const response = await axios.get('http://3.80.117.46:3000/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setError(null);
            } catch (err) {
                setError('Error loading profile');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();

        const factInterval = setInterval(() => {
            setCurrentFactIndex(prev => (prev + 1) % hamsterFacts.length);
        }, 8000);

        return () => clearInterval(factInterval);
    }, []);

    const indexOfLastFact = currentPage * factsPerPage;
    const indexOfFirstFact = indexOfLastFact - factsPerPage;
    const currentFacts = hamsterFacts.slice(indexOfFirstFact, indexOfLastFact);
    const totalFactPages = Math.ceil(hamsterFacts.length / factsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading your hamster profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{error}</Text>
                <Button title="Try Again" onPress={() => window.location.reload()} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Image source={logo} style={styles.logo} />
                    <View style={styles.headerContent}>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.email}>📧 {user.email}</Text>
                        <Text style={styles.role}>🏷️ {user.rol}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <View style={styles.factContainer}>
                        <Text style={styles.factTitle}>🐹 Did You Know?</Text>
                        <Text style={styles.factContent}>{hamsterFacts[currentFactIndex]}</Text>
                    </View>

                    <View style={styles.factsSection}>
                        <Text style={styles.factsTitle}>More Hamster Facts</Text>
                        <View style={styles.factsGrid}>
                            {currentFacts.map((fact, index) => (
                                <View key={index} style={styles.factCard}>
                                    <Text style={styles.factIcon}>🐹</Text>
                                    <Text style={styles.factText}>{fact}</Text>
                                </View>
                            ))}
                        </View>

                        {hamsterFacts.length > factsPerPage && (
                            <View style={styles.pagination}>
                                <Button title="Previous" onPress={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} />
                                <View style={styles.pageNumbers}>
                                    {Array.from({ length: totalFactPages }, (_, i) => i + 1).map(number => (
                                        <TouchableOpacity
                                            key={number}
                                            onPress={() => paginate(number)}
                                            style={[styles.pageButton, currentPage === number && styles.activePage]}
                                        >
                                            <Text>{number}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <Button title="Next" onPress={() => paginate(currentPage < totalFactPages ? currentPage + 1 : totalFactPages)} />
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.footer}>
                    <Button title="🏠 Return to Burrow" onPress={() => window.history.back()} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8DC',
        paddingTop: 40,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginHorizontal: 20,
        marginBottom: 20,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#8B4513',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FFD700',
    },
    headerContent: {
        marginLeft: 20,
    },
    name: {
        fontSize: 24,
        color: '#FFD700',
    },
    email: {
        fontSize: 16,
        color: '#F5DEB3',
    },
    role: {
        fontSize: 16,
        color: '#F5DEB3',
    },
    body: {
        padding: 20,
    },
    factContainer: {
        backgroundColor: '#F5DEB3',
        padding: 20,
        borderRadius: 10,
    },
    factTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    factContent: {
        fontSize: 16,
    },
    factsSection: {
        marginTop: 20,
    },
    factsTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    factsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    factCard: {
        width: '45%',
        backgroundColor: 'rgba(245, 222, 179, 0.3)',
        borderRadius: 10,
        padding: 15,
    },
    factIcon: {
        fontSize: 24,
    },
    factText: {
        fontSize: 14,
        marginTop: 10,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    pageNumbers: {
        flexDirection: 'row',
        gap: 10,
    },
    pageButton: {
        padding: 10,
        backgroundColor: '#F5DEB3',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#8B4513',
    },
    activePage: {
        backgroundColor: '#8B4513',
        color: 'white',
    },
    footer: {
        padding: 20,
        backgroundColor: '#F5DEB3',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    loadingText: {
        fontSize: 18,
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    errorMessage: {
        fontSize: 18,
        color: 'red',
    },
});

export default Profile;

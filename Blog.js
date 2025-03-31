import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

// Imágenes de ejemplo para los hámsters (local)
import hobo from './syrian.jpg';

function Blog() {
    const [selectedHamster, setSelectedHamster] = useState(null);
    const [activeTab, setActiveTab] = useState('breeds');

    const hamsters = [
        { 
            id: 1, 
            name: 'Syrian Hamster', 
            image: hobo,
            description: 'The largest and most popular pet hamster. Solitary by nature, they must live alone.',
            lifespan: '2-3 years',
            size: '5-7 inches'
        },
        { 
            id: 2, 
            name: 'Dwarf Hamster', 
            image: 'https://delivery-petsuppliesplus.stylelabs.cloud/api/public/content/AdobeStock_270065630.jpeg?v=d5d407ec',
            description: 'Smaller and more social than Syrians, they can live in same-sex pairs if introduced properly.',
            lifespan: '1.5-2 years',
            size: '2-4 inches'
        },
        { 
            id: 3, 
            name: 'Roborovski Hamster', 
            image: 'https://imagenes.20minutos.es/files/image_1920_1080/uploads/imagenes/2022/07/23/hamster-roborovski.jpeg',
            description: 'The smallest and fastest hamster breed. Not recommended for handling.',
            lifespan: '3-3.5 years',
            size: '1.5-2 inches'
        }
    ];

    const handleImageClick = (hamster) => {
        setSelectedHamster(selectedHamster?.id === hamster.id ? null : hamster);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🐹 Welcome to the Hamster Blog 🐹</Text>
            </View>

            <View style={styles.breedsSection}>
                <Text style={styles.sectionTitle}>🐹 Hamster Breeds</Text>
                <View style={styles.breedCardsContainer}>
                    {hamsters.map(hamster => (
                        <TouchableOpacity 
                            key={hamster.id} 
                            style={[styles.breedCard, selectedHamster?.id === hamster.id && styles.expanded]}
                            onPress={() => handleImageClick(hamster)}
                        >
                            <View style={styles.imageContainer}>
                                <Image 
                                    source={typeof hamster.image === 'string' ? { uri: hamster.image } : hamster.image} 
                                    style={styles.image} 
                                />
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.breedName}>{hamster.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FFF8DC',
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        color: '#6A4E23',
        fontFamily: 'Arial',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    breedsSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#6A4E23',
        marginBottom: 15,
        fontFamily: 'Arial',
    },
    breedCardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    breedCard: {
        width: '48%',
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        borderWidth: 2,
        borderColor: '#F5DEB3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        transition: 'transform 0.2s ease-in-out',
    },
    breedName: {
        fontSize: 18,
        color: '#8B4513',
        fontWeight: 'bold',
        fontFamily: 'Arial',
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#F5DEB3',
    },
    expanded: {
        borderColor: '#8B4513',
        borderWidth: 2,
        transform: [{ scale: 1.05 }],
    },
});

export default Blog;

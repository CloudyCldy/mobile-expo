import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const UserChart = ({ users }) => {
    // Contar la cantidad de usuarios por rol
    const roleCounts = users.reduce((acc, user) => {
        acc[user.rol] = (acc[user.rol] || 0) + 1;
        return acc;
    }, {});

    const totalUsers = users.length;
    const data = Object.keys(roleCounts).map((role) => ({
        name: role,
        percentage: (roleCounts[role] / totalUsers) * 100,
    }));

    // Función para calcular el ángulo de los segmentos del gráfico
    const getArc = (percentage) => {
        const radius = 50; // Radio del círculo
        const circumference = 2 * Math.PI * radius;
        const strokeDasharray = (percentage / 100) * circumference;
        return strokeDasharray;
    };

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.title}>User Role Distribution</Text>
            <View style={styles.pieContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.pieChartWrapper}>
                        <Svg height="120" width="120" viewBox="0 0 120 120">
                            <G rotation="-90" origin="60, 60">
                                <Circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    stroke="#ddd"
                                    strokeWidth="22"
                                    fill="none"
                                />
                                <Circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    stroke="#6f4f1f" // Color café
                                    strokeWidth="22"
                                    fill="none"
                                    strokeDasharray={`${getArc(item.percentage)} ${2 * Math.PI * 50}`}
                                />
                            </G>
                        </Svg>
                        <Text style={styles.pieLabel}>{item.name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    pieContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    pieChartWrapper: {
        alignItems: 'center',
    },
    pieLabel: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default UserChart;

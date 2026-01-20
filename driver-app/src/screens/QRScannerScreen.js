import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StyleSheet as RNStyleSheet, StatusBar, Dimensions } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const QRScannerScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getCameraPermissions();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        try {
            // Assuming data is the Ticket ID
            const result = await api.validateTicket(token, data);

            if (result.valid) {
                Alert.alert(
                    "✅ Ticket Verified",
                    `Name: ${result.passengerName}\nSeat: ${result.seatNumber}`,
                    [{ text: "Scan Next", onPress: () => setScanned(false) }]
                );
            } else {
                Alert.alert(
                    "❌ Invalid Ticket",
                    result.reason || "This ticket is not valid for this trip.",
                    [{ text: "Try Again", onPress: () => setScanned(false) }]
                );
            }
        } catch (error) {
            Alert.alert("Error", "Failed to validate ticket");
            setScanned(false);
        }
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text>Requesting for camera permission</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text>No access to camera</Text></View>;
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                }}
            />

            {/* Overlay */}
            <View style={styles.overlay}>
                <View style={styles.topOverlay}>
                    <Text style={styles.instructions}>Align QR code within the frame</Text>
                </View>
                <View style={styles.centerRow}>
                    <View style={styles.sideOverlay} />
                    <View style={styles.scannerFrame}>
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerTR} />
                        <View style={styles.cornerBL} />
                        <View style={styles.cornerBR} />
                    </View>
                    <View style={styles.sideOverlay} />
                </View>
                <View style={styles.bottomOverlay}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="close" size={24} color="#FFF" />
                        <Text style={styles.closeText}>Close Scanner</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    topOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructions: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    centerRow: {
        flexDirection: 'row',
        height: 250,
    },
    sideOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    scannerFrame: {
        width: 250,
        height: 250,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        position: 'relative',
    },
    cornerTL: { position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#3B82F6' },
    cornerTR: { position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#3B82F6' },
    cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 20, height: 20, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#3B82F6' },
    cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#3B82F6' },

    bottomOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        gap: 8,
    },
    closeText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default QRScannerScreen;

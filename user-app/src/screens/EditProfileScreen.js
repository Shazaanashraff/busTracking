import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const EditProfileScreen = ({ navigation }) => {
    const [name, setName] = useState('Kasun Perera');
    const [email, setEmail] = useState('kasun@example.com');
    const [phone, setPhone] = useState('077 123 4567');

    const handleSave = () => {
        // Mock save logic
        Alert.alert("Success", "Profile updated successfully!", [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={styles.avatarSection}>
                        <View style={styles.avatar}>
                            <Feather name="user" size={40} color="#9CA3AF" />
                            <TouchableOpacity style={styles.cameraBtn}>
                                <Feather name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="user" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="mail" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="phone" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleSave}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 1,
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
    content: { flex: 1, paddingHorizontal: 24 },
    avatarSection: { alignItems: 'center', marginBottom: 32 },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1F2937',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F3F4F6',
    },
    changePhotoText: { color: '#2563EB', fontWeight: '600', fontSize: 14 },
    form: { width: '100%' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 8, textTransform: 'uppercase' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 12,
    },
    input: { flex: 1, fontSize: 16, color: '#1F2937', fontWeight: '600' },
    saveBtn: {
        backgroundColor: '#1F2937',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default EditProfileScreen;

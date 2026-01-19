import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Track in Real-Time',
        description: 'See exactly where your bus is and when it will arrive. No more waiting in uncertainty.',
        icon: 'map-pin',
        color: '#FCD24A'
    },
    {
        id: '2',
        title: 'Book Seats Easily',
        description: 'Reserve your favorite seat in advance with just a few taps. Secure and hassle-free.',
        icon: 'check-square',
        color: '#84CC16'
    },
    {
        id: '3',
        title: 'Journey Happy',
        description: 'Enjoy a comfortable ride to your destination with reliable bus operators.',
        icon: 'smile',
        color: '#3B82F6'
    }
];

const OnboardingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.replace('LanguageSelect');
        }
    };

    const handleSkip = () => {
        navigation.replace('LanguageSelect');
    };

    const renderItem = ({ item }) => (
        <View style={[styles.slide, { backgroundColor: item.color }]}>
            <View style={styles.iconContainer}>
                <Feather name={item.icon} size={80} color={item.color} style={{ opacity: 0.8 }} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item) => item.id}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                scrollEventThrottle={32}
            />

            <View style={styles.footer}>
                <View style={styles.paginator}>
                    {slides.map((_, index) => (
                        <View
                            key={index.toString()}
                            style={[
                                styles.dot,
                                { width: currentIndex === index ? 24 : 8, opacity: currentIndex === index ? 1 : 0.3 }
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.actions}>
                    {currentIndex < slides.length - 1 ? (
                        <>
                            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                                <Text style={styles.skipText}>Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                                <Feather name="arrow-right" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity onPress={handleNext} style={styles.startBtn}>
                            <Text style={styles.startText}>Get Started</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    slide: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    iconContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    textContainer: {
        backgroundColor: '#FFF',
        padding: 24,
        borderRadius: 24,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paginator: {
        flexDirection: 'row',
        height: 64,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#1F2937',
        marginRight: 8,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    skipBtn: {
        padding: 12,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4B5563',
    },
    nextBtn: {
        width: 56,
        height: 56,
        backgroundColor: '#1F2937',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    startBtn: {
        backgroundColor: '#1F2937',
        paddingHorizontal: 32,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    startText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default OnboardingScreen;

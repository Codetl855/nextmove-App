import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    PanResponder,
    Animated,
    Dimensions,
} from 'react-native';
import NMText from './NMText';
import { Colors } from '../../theme/colors';

interface MultiRangeSliderProps {
    title: string;
    min: number;
    max: number;
    initialMinValue?: number;
    initialMaxValue?: number;
    step?: number;
    suffix?: string;
    prefix?: string;
    onValuesChange?: (minValue: number, maxValue: number) => void;
    formatNumber?: (value: number) => string;
}

const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({
    title,
    min,
    max,
    initialMinValue,
    initialMaxValue,
    step = 1,
    suffix = '',
    prefix = '',
    onValuesChange,
    formatNumber,
}) => {
    const sliderWidth = Dimensions.get('window').width - 50;
    const thumbSize = 32;

    // Initialize with proper values or defaults to min/max
    const [minValue, setMinValue] = useState(initialMinValue !== undefined ? initialMinValue : min);
    const [maxValue, setMaxValue] = useState(initialMaxValue !== undefined ? initialMaxValue : max);

    const minThumbPosition = useRef(new Animated.Value(0)).current;
    const maxThumbPosition = useRef(
        new Animated.Value(sliderWidth - thumbSize)
    ).current;

    const valueToPosition = (value: number) => {
        return ((value - min) / (max - min)) * (sliderWidth - thumbSize);
    };

    const positionToValue = (position: number) => {
        const value = (position / (sliderWidth - thumbSize)) * (max - min) + min;
        const steppedValue = Math.round(value / step) * step;
        // Ensure value stays within bounds
        return Math.max(min, Math.min(max, steppedValue));
    };

    const formatValue = (value: number) => {
        if (formatNumber) {
            return formatNumber(value);
        }
        return value.toLocaleString();
    };

    const minPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                minThumbPosition.setOffset(
                    (minThumbPosition as any)._value
                );
                minThumbPosition.setValue(0);
            },
            onPanResponderMove: (_, gestureState) => {
                const newPosition = Math.max(
                    0,
                    Math.min(
                        valueToPosition(maxValue) - thumbSize,
                        (minThumbPosition as any)._offset + gestureState.dx
                    )
                );
                minThumbPosition.setValue(newPosition - (minThumbPosition as any)._offset);
            },
            onPanResponderRelease: () => {
                minThumbPosition.flattenOffset();
                const currentPosition = (minThumbPosition as any)._value;
                const newValue = positionToValue(currentPosition);
                const constrainedValue = Math.max(min, Math.min(newValue, maxValue - step));

                setMinValue(constrainedValue);

                const finalPosition = valueToPosition(constrainedValue);
                Animated.spring(minThumbPosition, {
                    toValue: finalPosition,
                    useNativeDriver: false,
                    tension: 80,
                    friction: 12,
                }).start();

                onValuesChange?.(constrainedValue, maxValue);
            },
        })
    ).current;

    const maxPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                maxThumbPosition.setOffset(
                    (maxThumbPosition as any)._value
                );
                maxThumbPosition.setValue(0);
            },
            onPanResponderMove: (_, gestureState) => {
                const newPosition = Math.max(
                    valueToPosition(minValue) + thumbSize,
                    Math.min(
                        sliderWidth - thumbSize,
                        (maxThumbPosition as any)._offset + gestureState.dx
                    )
                );
                maxThumbPosition.setValue(newPosition - (maxThumbPosition as any)._offset);
            },
            onPanResponderRelease: () => {
                maxThumbPosition.flattenOffset();
                const currentPosition = (maxThumbPosition as any)._value;
                const newValue = positionToValue(currentPosition);
                const constrainedValue = Math.min(max, Math.max(newValue, minValue + step));

                setMaxValue(constrainedValue);

                const finalPosition = valueToPosition(constrainedValue);
                Animated.spring(maxThumbPosition, {
                    toValue: finalPosition,
                    useNativeDriver: false,
                    tension: 80,
                    friction: 12,
                }).start();

                onValuesChange?.(minValue, constrainedValue);
            },
        })
    ).current;

    const activeTrackLeft = minThumbPosition.interpolate({
        inputRange: [0, sliderWidth - thumbSize],
        outputRange: [0, sliderWidth - thumbSize],
        extrapolate: 'clamp',
    });

    const activeTrackWidth = Animated.subtract(
        maxThumbPosition,
        minThumbPosition
    );

    useEffect(() => {
        const initialMinPos = valueToPosition(minValue);
        const initialMaxPos = valueToPosition(maxValue);

        minThumbPosition.setValue(initialMinPos);
        maxThumbPosition.setValue(initialMaxPos);
    }, []);

    useEffect(() => {
        const newMinPos = valueToPosition(minValue);
        const newMaxPos = valueToPosition(maxValue);

        Animated.parallel([
            Animated.timing(minThumbPosition, {
                toValue: newMinPos,
                duration: 0,
                useNativeDriver: false,
            }),
            Animated.timing(maxThumbPosition, {
                toValue: newMaxPos,
                duration: 0,
                useNativeDriver: false,
            }),
        ]).start();
    }, [min, max]);

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <NMText fontSize={16} fontFamily='semiBold' color={Colors.textPrimary}>
                    {title}
                </NMText>
                <NMText fontSize={14} fontFamily='medium' color={Colors.textLight}>
                    {prefix}{formatValue(min)}{suffix} - {prefix}{formatValue(max)}{suffix}
                </NMText>
            </View>

            <View style={styles.sliderContainer}>
                <View style={[styles.track, { width: sliderWidth }]}>
                    <View style={styles.inactiveTrack} />

                    <Animated.View
                        style={[
                            styles.activeTrack,
                            {
                                left: activeTrackLeft,
                                width: activeTrackWidth,
                            },
                        ]}
                    />

                    <Animated.View
                        {...minPanResponder.panHandlers}
                        style={[
                            styles.thumb,
                            {
                                left: minThumbPosition,
                            },
                        ]}
                    />

                    <Animated.View
                        {...maxPanResponder.panHandlers}
                        style={[
                            styles.thumb,
                            {
                                left: maxThumbPosition,
                            },
                        ]}
                    />
                </View>
            </View>

            <View style={styles.labelsContainer}>
                <View style={styles.label}>
                    <NMText fontSize={12} fontFamily='medium' color={Colors.textLight}>
                        {prefix}{formatValue(minValue)}{suffix}
                    </NMText>
                </View>
                <View style={styles.label}>
                    <NMText fontSize={12} fontFamily='medium' color={Colors.textLight}>
                        {prefix}{formatValue(maxValue)}{suffix}
                    </NMText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginHorizontal: '5%'
    },
    sliderContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    track: {
        height: 6,
        position: 'relative',
        justifyContent: 'center',
    },
    inactiveTrack: {
        position: 'absolute',
        width: '100%',
        height: 8,
        backgroundColor: Colors.background,
        borderRadius: 3,
    },
    activeTrack: {
        position: 'absolute',
        height: 8,
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    thumb: {
        position: 'absolute',
        width: 26,
        height: 26,
        borderRadius: 26 / 2,
        borderColor: Colors.background,
        borderWidth: 4,
        backgroundColor: Colors.primary,
        top: -13,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: '5%'
    },
    label: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
});

export default MultiRangeSlider;

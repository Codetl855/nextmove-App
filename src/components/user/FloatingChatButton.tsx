import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { MessageCircle } from "lucide-react-native";
import { Colors } from "../../theme/colors";

interface FloatingChatButtonProps {
    navigation: any;
    params?: Record<string, any>;
    screenName?: string;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
    navigation,
    params = {},
    screenName = "ChatScreen",
}: FloatingChatButtonProps) => {
    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => navigation.navigate(screenName, params)}
            >
                <MessageCircle color="white" size={26} />
            </Pressable>
        </View>
    );
};

export default FloatingChatButton;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 100,
        right: 25,
        zIndex: 1000,
    },
    button: {
        backgroundColor: Colors.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
});

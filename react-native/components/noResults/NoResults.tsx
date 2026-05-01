import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

type Props = {
    message: string;
};

export function NoResults({ message }: Props) {
    return (
        <ThemedText style={styles.text}>{message}</ThemedText>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        lineHeight: 32,
        marginTop: 10,
    },
});

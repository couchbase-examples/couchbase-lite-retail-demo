import { useColorScheme } from 'react-native';
import {ThemedView} from "@/components/ThemedView";
import {SearchBar} from "@rneui/themed";

type Props = {
    placeholder: string;
    onChangeText: (text: string) => void;
    value: string;
};

export function ThemedSearchBar({
                                    placeholder,
                                    onChangeText,
                                    value,
                                }: Props) {
    const colorScheme = useColorScheme();
    return (
        <ThemedView>
            <SearchBar
                autoCapitalize="none"
                placeholder={placeholder}
                onChangeText={onChangeText}
                value={value}
                inputStyle={{ color: colorScheme === 'dark' ? 'white' : 'black' }} // Text color
                containerStyle={{
                    backgroundColor: colorScheme === 'dark' ? '#333' : 'white', // Background color of the container
                    borderTopColor: 'transparent',
                    borderBottomColor: 'transparent',
                }}
                inputContainerStyle={{
                    backgroundColor: colorScheme === 'dark' ? '#555' : '#f0f0f0', // Background color of the input field
                }}
            />
        </ThemedView>
    );
}
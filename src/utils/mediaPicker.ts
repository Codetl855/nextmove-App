import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';

export type PickImageConfig = {
    multiple?: boolean;
    includeBase64?: boolean;
};

export const pickImagesFromGallery = async (
    config: PickImageConfig = {}
): Promise<Asset[] | null> => {

    try {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: config.multiple ? 0 : 1,
            includeBase64: config.includeBase64 ?? false,
        };

        const result = await launchImageLibrary(options);

        if (result.didCancel) return null;
        if (result.errorCode) {
            console.warn("Image Picker Error:", result.errorMessage);
            return null;
        }

        return result.assets || null;

    } catch (err) {
        console.warn("pickImagesFromGallery ERROR:", err);
        return null;
    }
};

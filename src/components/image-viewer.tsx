import { Image } from 'expo-image';
import { FlatList, Modal, ScrollView, StatusBar, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Spacing } from '@/constants/theme';
import { IconButton } from './ui';
import { ThemedText } from './themed-text';

/** Full-screen, uncropped viewer. Swipe between images; pinch to zoom on iOS. */
export function ImageViewer({ images, startIndex, visible, onClose }: {
  images: string[]; startIndex: number; visible: boolean; onClose: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(startIndex);

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent
      onShow={() => setPage(startIndex)}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar barStyle="light-content" />
        {visible && (
          <FlatList
            data={images} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            initialScrollIndex={Math.min(startIndex, images.length - 1)}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <ScrollView style={{ width, height }} contentContainerStyle={{ width, height, justifyContent: 'center' }}
                maximumZoomScale={4} minimumZoomScale={1} centerContent bouncesZoom
                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: item }} contentFit="contain" style={{ width, height }} />
              </ScrollView>
            )} />
        )}
        <View pointerEvents="box-none" style={{ position: 'absolute', top: insets.top + Spacing.two, left: Spacing.three, right: Spacing.three, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, opacity: images.length > 1 ? 1 : 0 }}>
            <ThemedText type="smallBold" style={{ color: '#fff' }}>{page + 1} / {images.length}</ThemedText>
          </View>
          <IconButton name="close" label="Close image" color="#fff" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

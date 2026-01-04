import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native'
import React, { useState } from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import { Colors } from '../../../theme/colors'
import NMText from '../../../components/common/NMText'
import { ChevronLeft, Heart, Share2, StarIcon, PlusIcon } from 'lucide-react-native'
import NMButton from '../../../components/common/NMButton'
import CommentView from '../../../components/user/CommentView'
import CommentSheetModal from '../../../components/user/CommentSheetModal'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { WebView } from 'react-native-webview'

interface BlogData {
    id: number;
    title: string;
    category: string;
    cover_photo: string;
    description: string;
    tags: string;
    created_at: string;
    updated_at: string;
    slug: string;
    status: string;
    deleted_at: string | null;
}

type RootStackParamList = {
    BlogDetail: {
        blog: BlogData;
    };
};

type BlogDetailRouteProp = RouteProp<RootStackParamList, 'BlogDetail'>;

const BlogDetail: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    // Handle both 'blog' and 'item' param names (for compatibility with different navigation calls)
    const routeParams = route.params as any;
    const blog = routeParams?.blog || routeParams?.item;
    const [commentSheetVisible, setCommentSheetVisible] = useState(false);
    const [webViewHeight, setWebViewHeight] = useState(400);

    const formatDate = (isoDate?: string) => {
        if (!isoDate) return '';
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(new Date(isoDate));
    };

    // Strip HTML tags from description for display
    const stripHtml = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    };

    // Debug: Log route params to see what's being passed
    React.useEffect(() => {
        console.log('BlogDetail Route Params:', route.params);
        console.log('Blog Data:', blog);
        console.log('Blog ID:', blog?.id);
        console.log('Blog Title:', blog?.title);
    }, [route.params, blog]);

    // Show loading or error if blog is not available
    if (!blog || !blog.id) {
        return (
            <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                    <NMText fontSize={16} color={Colors.textPrimary}>
                        Blog not found
                    </NMText>
                    <NMText fontSize={14} color={Colors.textLight} style={{ marginTop: 10 }}>
                        Please go back and try again
                    </NMText>
                </View>
            </NMSafeAreaWrapper>
        );
    }

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.container}>
                    <View style={styles.headerView}>
                        <View style={styles.inRow}>
                            <TouchableOpacity
                                style={styles.backBox}
                                onPress={() => navigation.goBack()}
                            >
                                <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                            </TouchableOpacity>
                            <View style={styles.titleView}>
                                <NMText fontSize={20} fontFamily='semiBold' color={Colors.textSecondary}>
                                    Blog Detail
                                </NMText>
                            </View>
                        </View>
                        {/* <View style={styles.inRow}>
                            <TouchableOpacity style={[styles.backBox, { marginRight: 10 }]}>
                                <Heart color={Colors.black} size={18} strokeWidth={1.5} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.backBox}>
                                <Share2 color={Colors.black} size={18} strokeWidth={1.5} />
                            </TouchableOpacity>
                        </View> */}
                    </View>

                    <View style={styles.contentContainer}>
                        <NMText fontSize={18} fontFamily='bold' color={Colors.textPrimary}>
                            {blog.title}
                        </NMText>

                        {/* <View style={styles.ratingBox}>
                            <NMText fontSize={14} fontFamily='regular' color={Colors.textSecondary}>
                                0 <NMText fontSize={14} fontFamily='bold' color={Colors.textSecondary}>Reviews</NMText>
                            </NMText>
                            <View style={styles.line} />
                            <View style={styles.inRow}>
                                <View style={styles.inRow}>
                                    {[1, 2, 3, 4, 5].map((item, index) => (
                                        <StarIcon key={index} color={Colors.star} size={16} fill={Colors.star} />
                                    ))}
                                </View>
                                <NMText fontSize={16} fontFamily='regular' color={Colors.textSecondary} style={{ marginLeft: 5 }}>
                                    0.0
                                </NMText>
                            </View>
                        </View> */}

                        <NMText fontSize={16} fontFamily='regular' color={Colors.textPrimary} style={{ marginTop: 10 }}>
                            Category: <NMText fontSize={16} fontFamily='semiBold' color={Colors.primary}>{blog.category}</NMText>
                        </NMText>

                        <NMText fontSize={16} fontFamily='regular' color={Colors.textPrimary} style={{ marginTop: 10 }}>
                            Date: <NMText fontSize={16} fontFamily='semiBold' color={Colors.primary}>{formatDate(blog.created_at)}</NMText>
                            {'           '}
                            <NMText fontSize={16} fontFamily='regular' color={Colors.textPrimary}>
                                Tags: <NMText fontSize={16} fontFamily='semiBold' color={Colors.primary}>{blog.tags || 'N/A'}</NMText>
                            </NMText>
                        </NMText>

                        {/* <NMText fontSize={16} fontFamily='regular' color={Colors.textPrimary} style={{ marginTop: 10 }}>
                            Comments: <NMText fontSize={16} fontFamily='semiBold' color={Colors.primary}>0</NMText>
                        </NMText> */}

                        {blog.cover_photo && (
                            <Image source={{ uri: blog.cover_photo }} style={styles.blogImage} />
                        )}

                        {blog.description && (
                            <View style={styles.descriptionContainer}>
                                <WebView
                                    source={{
                                        html: `
                                        <!DOCTYPE html>
                                        <html>
                                            <head>
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                                                <style>
                                                    * {
                                                        margin: 0;
                                                        padding: 0;
                                                        box-sizing: border-box;
                                                    }
                                                    html, body {
                                                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                                                        font-size: 16px;
                                                        line-height: 1.5;
                                                        color: #333;
                                                        padding: 0 !important;
                                                        margin: 0 !important;
                                                        word-wrap: break-word;
                                                        height: auto !important;
                                                        min-height: auto !important;
                                                        max-height: none !important;
                                                    }
                                                    html {
                                                        overflow: hidden;
                                                        height: auto !important;
                                                    }
                                                    body {
                                                        overflow: visible;
                                                        height: auto !important;
                                                    }
                                                    body > *:first-child {
                                                        margin-top: 0 !important;
                                                        padding-top: 0 !important;
                                                    }
                                                    body > *:last-child {
                                                        margin-bottom: 0 !important;
                                                        padding-bottom: 0 !important;
                                                    }
                                                    p {
                                                        margin: 6px 0;
                                                    }
                                                    p:first-child {
                                                        margin-top: 0 !important;
                                                        padding-top: 0 !important;
                                                    }
                                                    p:last-child {
                                                        margin-bottom: 0 !important;
                                                        padding-bottom: 0 !important;
                                                    }
                                                    img {
                                                        max-width: 100%;
                                                        height: auto;
                                                        border-radius: 8px;
                                                        margin: 6px 0;
                                                        display: block;
                                                    }
                                                    img:first-child {
                                                        margin-top: 0 !important;
                                                    }
                                                    img:last-child {
                                                        margin-bottom: 0 !important;
                                                    }
                                                    h1, h2, h3, h4, h5, h6 {
                                                        margin: 10px 0 4px 0;
                                                        font-weight: bold;
                                                        color: #000;
                                                        line-height: 1.3;
                                                    }
                                                    h1:first-child, h2:first-child, h3:first-child, h4:first-child, h5:first-child, h6:first-child {
                                                        margin-top: 0 !important;
                                                        padding-top: 0 !important;
                                                    }
                                                    h1:last-child, h2:last-child, h3:last-child, h4:last-child, h5:last-child, h6:last-child {
                                                        margin-bottom: 0 !important;
                                                        padding-bottom: 0 !important;
                                                    }
                                                    h1 { font-size: 24px; }
                                                    h2 { font-size: 22px; }
                                                    h3 { font-size: 20px; }
                                                    h4 { font-size: 18px; }
                                                    h5 { font-size: 16px; }
                                                    h6 { font-size: 14px; }
                                                    strong, b {
                                                        font-weight: bold;
                                                    }
                                                    em, i {
                                                        font-style: italic;
                                                    }
                                                    ul, ol {
                                                        margin: 6px 0;
                                                        padding-left: 20px;
                                                    }
                                                    ul:first-child, ol:first-child {
                                                        margin-top: 0 !important;
                                                    }
                                                    ul:last-child, ol:last-child {
                                                        margin-bottom: 0 !important;
                                                    }
                                                    li {
                                                        margin: 3px 0;
                                                    }
                                                    a {
                                                        color: #007AFF;
                                                        text-decoration: none;
                                                    }
                                                    blockquote {
                                                        border-left: 4px solid #ddd;
                                                        padding-left: 12px;
                                                        margin: 6px 0;
                                                        color: #666;
                                                    }
                                                    blockquote:first-child {
                                                        margin-top: 0 !important;
                                                    }
                                                    blockquote:last-child {
                                                        margin-bottom: 0 !important;
                                                    }
                                                    code {
                                                        background-color: #f4f4f4;
                                                        padding: 2px 6px;
                                                        border-radius: 4px;
                                                        font-family: monospace;
                                                        font-size: 14px;
                                                    }
                                                    pre {
                                                        background-color: #f4f4f4;
                                                        padding: 10px;
                                                        border-radius: 8px;
                                                        overflow-x: auto;
                                                        margin: 6px 0;
                                                    }
                                                    pre:first-child {
                                                        margin-top: 0 !important;
                                                    }
                                                    pre:last-child {
                                                        margin-bottom: 0 !important;
                                                    }
                                                    div {
                                                        margin: 0 !important;
                                                        padding: 0 !important;
                                                    }
                                                    div:first-child {
                                                        margin-top: 0 !important;
                                                        padding-top: 0 !important;
                                                    }
                                                    div:last-child {
                                                        margin-bottom: 0 !important;
                                                        padding-bottom: 0 !important;
                                                    }
                                                </style>
                                            </head>
                                            <body>
                                                ${blog.description}
                                                <script>
                                                    function updateHeight() {
                                                        // Force remove all padding and margins
                                                        document.body.style.margin = '0';
                                                        document.body.style.padding = '0';
                                                        document.documentElement.style.margin = '0';
                                                        document.documentElement.style.padding = '0';
                                                        document.body.style.height = 'auto';
                                                        document.documentElement.style.height = 'auto';
                                                        
                                                        const body = document.body;
                                                        
                                                        // Wait a moment for layout to settle
                                                        setTimeout(function() {
                                                            // Get all elements in body
                                                            const allElements = body.querySelectorAll('*');
                                                            
                                                            // Find the absolute bottom of all content
                                                            let maxBottom = 0;
                                                            let hasContent = false;
                                                            
                                                            allElements.forEach(function(el) {
                                                                const rect = el.getBoundingClientRect();
                                                                const bodyRect = body.getBoundingClientRect();
                                                                const elementBottom = rect.bottom - bodyRect.top;
                                                                
                                                                // Check if element has content
                                                                if (rect.height > 0 || el.textContent.trim().length > 0 || el.tagName === 'IMG') {
                                                                    hasContent = true;
                                                                    if (elementBottom > maxBottom) {
                                                                        maxBottom = elementBottom;
                                                                    }
                                                                }
                                                            });
                                                        
                                                            // If no content found, use scrollHeight as fallback
                                                            let finalHeight = maxBottom;
                                                            
                                                            if (!hasContent || maxBottom === 0) {
                                                                finalHeight = body.scrollHeight;
                                                            } else {
                                                                // Use the maximum of calculated bottom and scrollHeight to ensure full content
                                                                finalHeight = Math.max(maxBottom, body.scrollHeight);
                                                            }
                                                        
                                                            // Ensure we capture all content - add 1px to prevent clipping
                                                            finalHeight = Math.ceil(finalHeight) + 1;
                                                        
                                                            // Send height to React Native
                                                            window.ReactNativeWebView.postMessage(JSON.stringify({ 
                                                                type: 'height', 
                                                                height: finalHeight
                                                            }));
                                                        }, 50);
                                                    }
                                                    
                                                    // Wait for all images to load
                                                    function waitForImages() {
                                                        const images = document.querySelectorAll('img');
                                                        let loadedCount = 0;
                                                        
                                                        if (images.length === 0) {
                                                            updateHeight();
                                                            return;
                                                        }
                                                        
                                                        images.forEach((img) => {
                                                            if (img.complete) {
                                                                loadedCount++;
                                                                if (loadedCount === images.length) {
                                                                    updateHeight();
                                                                }
                                                            } else {
                                                                img.onload = function() {
                                                                    loadedCount++;
                                                                    if (loadedCount === images.length) {
                                                                        updateHeight();
                                                                    }
                                                                };
                                                                img.onerror = function() {
                                                                    loadedCount++;
                                                                    if (loadedCount === images.length) {
                                                                        updateHeight();
                                                                    }
                                                                };
                                                            }
                                                        });
                                                    }
                                                    
                                                    // Run immediately
                                                    updateHeight();
                                                    
                                                    // Run after DOM is ready
                                                    if (document.readyState === 'loading') {
                                                        document.addEventListener('DOMContentLoaded', function() {
                                                            waitForImages();
                                                            setTimeout(updateHeight, 100);
                                                        });
                                                    } else {
                                                        waitForImages();
                                                        setTimeout(updateHeight, 100);
                                                    }
                                                    
                                                    // Run after window load
                                                    window.addEventListener('load', function() {
                                                        setTimeout(updateHeight, 150);
                                                        setTimeout(updateHeight, 300);
                                                    });
                                                    
                                                    // Multiple updates to catch all content
                                                    setTimeout(updateHeight, 200);
                                                    setTimeout(updateHeight, 400);
                                                    setTimeout(updateHeight, 600);
                                                    setTimeout(updateHeight, 1000);
                                                    setTimeout(updateHeight, 1500);
                                                </script>
                                            </body>
                                        </html>
                                    ` }}
                                    style={[styles.webView, { height: webViewHeight }]}
                                    scrollEnabled={false}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    startInLoadingState={true}
                                    scalesPageToFit={true}
                                    onMessage={(event) => {
                                        try {
                                            const data = JSON.parse(event.nativeEvent.data);
                                            if (data.type === 'height' && data.height && data.height > 0) {
                                                // Use the calculated height - it already includes 1px to prevent clipping
                                                const newHeight = Math.ceil(data.height);
                                                console.log('WebView height update:', {
                                                    received: data.height,
                                                    final: newHeight
                                                });
                                                // Only update if height is valid and different
                                                if (newHeight !== webViewHeight && newHeight > 50) {
                                                    setWebViewHeight(newHeight);
                                                }
                                            }
                                        } catch (e) {
                                            console.error('Error parsing WebView message:', e);
                                        }
                                    }}
                                    injectedJavaScript={`
                                        (function() {
                                            function updateHeight() {
                                                document.body.style.margin = '0';
                                                document.body.style.padding = '0';
                                                document.documentElement.style.margin = '0';
                                                document.documentElement.style.padding = '0';
                                                
                                                setTimeout(function() {
                                                    const body = document.body;
                                                    const allElements = body.querySelectorAll('*');
                                                    let maxBottom = 0;
                                                    let hasContent = false;
                                                    
                                                    allElements.forEach(function(el) {
                                                        const rect = el.getBoundingClientRect();
                                                        const bodyRect = body.getBoundingClientRect();
                                                        const elementBottom = rect.bottom - bodyRect.top;
                                                        
                                                        if (rect.height > 0 || el.textContent.trim().length > 0 || el.tagName === 'IMG') {
                                                            hasContent = true;
                                                            if (elementBottom > maxBottom) {
                                                                maxBottom = elementBottom;
                                                            }
                                                        }
                                                    });
                                                
                                                    let finalHeight = hasContent && maxBottom > 0 
                                                        ? Math.max(maxBottom, body.scrollHeight) 
                                                        : body.scrollHeight;
                                                
                                                    finalHeight = Math.ceil(finalHeight) + 1;
                                                
                                                    window.ReactNativeWebView.postMessage(JSON.stringify({ 
                                                        type: 'height', 
                                                        height: finalHeight
                                                    }));
                                                }, 50);
                                            }
                                            
                                            updateHeight();
                                            setTimeout(updateHeight, 100);
                                            setTimeout(updateHeight, 300);
                                            setTimeout(updateHeight, 600);
                                            setTimeout(updateHeight, 1000);
                                        })();
                                    `}
                                />
                            </View>
                        )}
                    </View>

                    {/* <View style={styles.contentContainer}>
                        <View style={[styles.inRow, { justifyContent: 'space-between' }]}>
                            <NMText fontSize={18} fontFamily='medium' color={Colors.textPrimary}>
                                Guest Reviews
                            </NMText>
                            <NMButton
                                title='Add Review'
                                leftIcon={<PlusIcon color={Colors.black} size={16} strokeWidth={2} fill={Colors.black} />}
                                width={'36%'}
                                height={46}
                                borderRadius={8}
                                backgroundColor='transparent'
                                textColor={Colors.black}
                                fontFamily='medium'
                                fontSize={14}
                                style={{ borderWidth: 1, borderColor: Colors.black }}
                                onPress={() => setCommentSheetVisible(true)}
                            />
                        </View>

                        {[1, 2, 3, 4, 5].map((item, index, arr) => (
                            <CommentView
                                key={index}
                                widthSet={index === arr.length - 1 ? 0 : 1}
                            />
                        ))}

                        <CommentSheetModal
                            visible={commentSheetVisible}
                            onClose={() => setCommentSheetVisible(false)}
                        />
                    </View> */}
                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    )
}

export default BlogDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
    headerView: {
        width: '100%',
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    headerLogo: {
        width: 100,
        height: 40,
        resizeMode: 'contain'
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleView: {
        marginLeft: 10
    },
    backBox: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background
    },
    contentContainer: {
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 14,
        marginVertical: 10
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    line: {
        width: 1,
        height: 20,
        backgroundColor: Colors.border,
        marginHorizontal: 10
    },
    blogImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 8,
        marginTop: 10
    },
    highlightBox: {
        backgroundColor: Colors.background,
        padding: 14,
        borderRadius: 8,
        marginTop: 10
    },
    threeImageBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    threeImage: {
        width: '30%',
        height: 80,
        resizeMode: 'cover',
        borderRadius: 8
    },
    descriptionContainer: {
        marginTop: 10,
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: Colors.white
    },
    webView: {
        width: '100%',
        backgroundColor: 'transparent',
    }
})
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useTheme } from '../../context/ThemeContext';

const MediaGallery = ({ mediaItems = [] }) => {
    const [activeMedia, setActiveMedia] = useState(null);
    const [filteredMedia, setFilteredMedia] = useState([]);
    const [filter, setFilter] = useState('all');
    const { getThemeColors } = useTheme();
    const colors = getThemeColors();

    useEffect(() => {
        if (mediaItems.length > 0) {
            setActiveMedia(mediaItems[0]);
            setFilteredMedia(mediaItems);
        }
    }, [mediaItems]);

    useEffect(() => {
        if (filter === 'all') {
            setFilteredMedia(mediaItems);
        } else {
            setFilteredMedia(mediaItems.filter(item => item.type === filter));
        }
    }, [filter, mediaItems]);

    const isVideo = (url) => {
        return url.match(/\.(mp4|webm|mov)$/) || 
               url.includes('youtube.com') || 
               url.includes('youtu.be') || 
               url.includes('vimeo.com');
    };

    const getMediaType = (url) => {
        return isVideo(url) ? 'video' : 'image';
    };

    const handleMediaClick = (media) => {
        setActiveMedia(media);
    };

    const renderActiveMedia = () => {
        if (!activeMedia) return null;

        const type = getMediaType(activeMedia.url);

        if (type === 'video') {
            return (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <ReactPlayer
                        url={activeMedia.url}
                        controls
                        width="100%"
                        height="100%"
                        style={{ borderRadius: '0.5rem' }}
                        light={activeMedia.thumbnail || false}
                        playing={false}
                        config={{
                            youtube: {
                                playerVars: { showinfo: 1 }
                            },
                            vimeo: {
                                playerOptions: { 
                                    byline: true, 
                                    portrait: true, 
                                    title: true 
                                }
                            },
                            file: {
                                attributes: {
                                    controlsList: 'nodownload',
                                    style: { borderRadius: '0.5rem' }
                                }
                            }
                        }}
                    />
                </div>
            );
        } else {
            return (
                <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img
                        src={activeMedia.url}
                        alt={activeMedia.caption || 'Project media'}
                        className="w-full h-full object-contain"
                    />
                </div>
            );
        }
    };

    return (
        <div className="space-y-4">
            {/* Filter buttons */}
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-md text-sm ${
                        filter === 'all'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                    style={filter === 'all' ? { backgroundColor: colors.primary, color: '#fff' } : {}}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('image')}
                    className={`px-4 py-2 rounded-md text-sm ${
                        filter === 'image'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                    style={filter === 'image' ? { backgroundColor: colors.primary, color: '#fff' } : {}}
                >
                    Images
                </button>
                <button
                    onClick={() => setFilter('video')}
                    className={`px-4 py-2 rounded-md text-sm ${
                        filter === 'video'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                    style={filter === 'video' ? { backgroundColor: colors.primary, color: '#fff' } : {}}
                >
                    Videos
                </button>
            </div>

            {/* Active media display */}
            {renderActiveMedia()}

            {/* Caption */}
            {activeMedia && activeMedia.caption && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-2">
                    {activeMedia.caption}
                </p>
            )}

            {/* Media thumbnails */}
            <div className="grid grid-cols-4 gap-2 mt-4">
                {filteredMedia.map((media, index) => {
                    const type = getMediaType(media.url);
                    const isActive = activeMedia && activeMedia.url === media.url;

                    return (
                        <div
                            key={index}
                            onClick={() => handleMediaClick(media)}
                            className={`cursor-pointer relative h-24 rounded-md overflow-hidden border-2 ${
                                isActive ? 'border-blue-500' : 'border-transparent'
                            }`}
                            style={{ borderColor: isActive ? colors.primary : 'transparent' }}
                        >
                            {type === 'video' ? (
                                <>
                                    {media.thumbnail ? (
                                        <img
                                            src={media.thumbnail}
                                            alt={media.caption || `Video thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 rounded-tl-md p-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </>
                            ) : (
                                <img
                                    src={media.url}
                                    alt={media.caption || `Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredMedia.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No {filter === 'all' ? 'media' : filter} found
                </div>
            )}
        </div>
    );
};

export default MediaGallery;
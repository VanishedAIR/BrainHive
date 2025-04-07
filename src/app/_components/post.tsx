'use client';

import React, { useState } from 'react';

const PostPage: React.FC = () => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [studyDate, setStudyDate] = useState('');
    const [subject, setSubject] = useState('');
    const [bio, setBio] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, image, studyDate, subject, bio, isPublic }),
            });

            if (response.ok) {
                alert('Post created successfully!');
                setContent('');
                setImage('');
                setStudyDate('');
                setSubject('');
                setBio('');
                setIsPublic(true);
            } else {
                alert('Failed to create post.');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[600px] mx-auto p-5 font-sans">
            <h1 className="text-center text-gray-800 dark:text-white text-2xl font-bold mb-6">Create a Study Group Post</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                {/* Content */}
                <div className="space-y-2">
                    <label className="block font-bold text-gray-700 dark:text-white">Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Write something..."
                        required
                    />
                </div>

                {/* Image */}
                <div className="space-y-2">
                    <label className="block font-bold text-gray-700 dark:text-white">Image URL:</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter image URL (optional)"
                    />
                </div>

                {/* Study Date */}
                <div className="space-y-2">
                    <label className="block font-bold text-gray-700 dark:text-white">Study Date:</label>
                    <input
                        type="date"
                        value={studyDate}
                        onChange={(e) => setStudyDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                    />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                    <label className="block font-bold text-gray-700 dark:text-white">Subject:</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter the subject to study"
                        required
                    />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <label className="block font-bold text-gray-700 dark:text-white">Brief Bio:</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Write a brief description of the study group"
                        required
                    />
                </div>

                {/* Public/Private Toggle */}
                <div className="space-y-2">
                    <label className="block font-bold text-gray-700 dark:text-white">Visibility:</label>
                    <button
                        type="button"
                        onClick={() => setIsPublic(!isPublic)}
                        className={`px-5 py-2.5 text-white rounded-md text-base transition-colors ${isPublic ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                        {isPublic ? 'Public' : 'Private'}
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white rounded-md text-base hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default PostPage;
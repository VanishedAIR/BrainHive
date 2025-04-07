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
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Create a Study Group Post</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Content */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '16px',
                        }}
                        placeholder="Write something..."
                        required
                    />
                </div>

                {/* Image */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Image URL:</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '16px',
                        }}
                        placeholder="Enter image URL (optional)"
                    />
                </div>

                {/* Study Date */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Study Date:</label>
                    <input
                        type="date"
                        value={studyDate}
                        onChange={(e) => setStudyDate(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '16px',
                        }}
                        required
                    />
                </div>

                {/* Subject */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Subject:</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '16px',
                        }}
                        placeholder="Enter the subject to study"
                        required
                    />
                </div>

                {/* Bio */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Brief Bio:</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '16px',
                        }}
                        placeholder="Write a brief description of the study group"
                        required
                    />
                </div>

                {/* Public/Private Toggle */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Visibility:</label>
                    <button
                        type="button"
                        onClick={() => setIsPublic(!isPublic)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: isPublic ? '#28a745' : '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
                    >
                        {isPublic ? 'Public' : 'Private'}
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default PostPage;
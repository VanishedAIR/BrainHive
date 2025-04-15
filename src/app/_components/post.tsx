"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPost } from "@/actions/postactions";

const PostPage: React.FC = () => {
  const [studyGroupName, setStudyGroupName] = useState("");
  const [studyGroupBio, setStudyGroupBio] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]); // Array to store multiple subjects
  const [newSubject, setNewSubject] = useState(""); // Temporary input for adding a new subject
  const [when2MeetLink, setWhen2MeetLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [studyDates, setStudyDates] = useState<string[]>([]); // Array to store multiple study dates
  const [studyTime, setStudyTime] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]); // Local state to store posts
  const [newStudyDate, setNewStudyDate] = useState(""); // Temporary input for adding a new study date

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject)) {
      setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
      setNewSubject(""); // Clear the input field
    }
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    setSubjects((prevSubjects) =>
      prevSubjects.filter((subject) => subject !== subjectToRemove)
    );
  };

  const handleAddStudyDate = () => {
    if (newStudyDate.trim() && !studyDates.includes(newStudyDate)) {
      setStudyDates((prevDates) => [...prevDates, newStudyDate]);
      setNewStudyDate(""); // Clear the input field
    }
  };

  const handleRemoveStudyDate = (dateToRemove: string) => {
    setStudyDates((prevDates) =>
      prevDates.filter((date) => date !== dateToRemove)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        studyGroupName,
        studyGroupBio,
        subjects,
        when2MeetLink,
        image: image ? URL.createObjectURL(image) : null, // Simulate image URL
        studyDates,
        studyTime,
        location,
      };

      const response = await createPost(postData);

      if (response.success) {
        alert("Post created successfully!");
        // Reset form fields
        setStudyGroupName("");
        setStudyGroupBio("");
        setSubjects([]);
        setWhen2MeetLink("");
        setImage(null);
        setStudyDates([]);
        setStudyTime("");
        setLocation("");
      } else {
        alert(`Failed to create post: ${response.message}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 font-sans">
      <h1 className="text-center text-gray-800 dark:text-white text-2xl font-bold mb-6">
        Create a Study Group Post
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/*Study Group Name*/}
        <div className="space-y-2">
          <Label
            htmlFor="studyGroupName"
            className="block font-bold text-gray-700 dark:text-white"
          >
            Name of Study Group:
          </Label>
          <Input
            id="studyGroupName"
            type="text"
            value={studyGroupName}
            onChange={(e) => setStudyGroupName(e.target.value)}
            className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter the name of the study group"
            required
          />
        </div>

        {/*Study Group Bio*/}
        <div className="space-y-2">
          <Label
            htmlFor="studyGroupBio"
            className="block font-bold text-gray-700 dark:text-white"
          >
            Study Group Bio:
          </Label>
          <Input
            id="studyGroupBio"
            type="text"
            value={studyGroupBio}
            onChange={(e) => setStudyGroupBio(e.target.value)}
            className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter a brief bio about the study group"
          />
        </div>

        {/*Subjects*/}
        <div className="space-y-2">
          <Label
            htmlFor="subjects"
            className="block font-bold text-gray-700 dark:text-white"
          >
            Subjects:
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="subjects"
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Add a subject"
            />
            <button
              type="button"
              onClick={handleAddSubject}
              className="h-12 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-gray-200 text-gray-700 rounded-md"
              >
                <span>
                  <button
                    onClick={() => handleRemoveSubject(subject)}
                    className=" hover:text-red-700 hover:bg-red-300 bg-transparent"
                  >
                    {subject}
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/*When2Meet Link*/}
        <div className="space-y-2">
          <Label
            htmlFor="when2MeetLink"
            className="block font-bold text-gray-700 dark:text-white"
          >
            When2Meet Link:
          </Label>
          <Input
            id="when2MeetLink"
            type="url"
            value={when2MeetLink}
            onChange={(e) => setWhen2MeetLink(e.target.value)}
            className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter the When2Meet link"
            required
          />
        </div>

        {/*Image Upload*/}
        <div className="space-y-2">
          <Label
            htmlFor="picture"
            className="block font-bold text-gray-700 dark:text-white"
          >
            Picture:
          </Label>
          <Input
            id="picture"
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full h-12 px-3 py-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
        </div> 

        {/*Study Dates*/}
        <div className="space-y-2">
          <Label
            htmlFor="studyDates"
            className="block font-bold text-gray-700 dark:text-white"
          >
            Study Dates:
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="studyDates"
              type="date"
              value={newStudyDate}
              onChange={(e) => setNewStudyDate(e.target.value)}
              className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Add a study date"
            />
            <button
              type="button"
              onClick={handleAddStudyDate}
              className="h-12 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {studyDates.map((date, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleRemoveStudyDate(date)}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-red-300 hover:text-red-700 transition-colors"
              >
                {new Date(date).toLocaleDateString()}
              </button>
            ))}
          </div>
        </div>

        {/*Study Time*/}
        <div className="space-y-2">
          <Label
            htmlFor="studyTime"
            className="block font-bold text-gray-700 dark:text-white"
          >
            Study Time:
          </Label>
          <Input
            id="studyTime"
            type="time"
            value={studyTime}
            onChange={(e) => setStudyTime(e.target.value)}
            className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>

        {/*Location*/}
        <div className="space-y-2">
          <Label
            htmlFor="location"
            className="block font-bold text-gray-700 dark:text-white"
          >
            Location:
          </Label>
          <Input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full h-12 p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter the location of the study group"
          />
        </div>

        {/*Submit Button*/}
        <button
          type="submit"
          className="px-5 py-2.5 bg-primary text-white rounded-md text-base hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/*Display Created Posts*/}
      {posts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Created Study Groups:
          </h2>
          {posts.map((post, index) => (
            <div key={index}>
              <p>Study Group Name: {post.studyGroupName}</p>
              <p>Study Date: {new Date(post.studyDate).toLocaleDateString()}</p>
              <p>Study Time: {new Date(post.studyTime).toLocaleTimeString()}</p>
              <p>Location: {post.location || "No location provided"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostPage;
